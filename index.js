require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require('./models/person');

app.use(express.json());
app.use(express.static('build'));

morgan.token('req-data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'));

app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {
    const personsCount = persons.length;
    const html = `
        <p>Phonebook has info for ${personsCount} people</p>
        <p>${new Date()}</p>`;
    response.send(html);
  })
  .catch(error => next(error));
});

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
  .catch(error => next(error));    
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }  
  })
  .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if(!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    });
  }
  const newPerson = new Person({
    name: body.name,
    number: body.number
  });
  newPerson.save()
  .then(savedPerson => response.json(savedPerson))
  .catch(error => next(error)); 
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end();
  })
  .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name:body.name,
    number:body.number
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error));  
});

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid id'});
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error:error});
  }
  next(error);
};

app.use(errorHandler);

const PORT= process.env.PORT;
app.listen(PORT);
