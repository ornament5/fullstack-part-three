const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

morgan.token('req-data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'));

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ];

app.get('/info', (request, response) => {
    const personsCount = persons.length;
    const html = `
        <p>Phonebook has info for ${personsCount} people</p>
        <p>${new Date()}</p>`;
    response.send(html);
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
   const personId = Number(request.params.id);
   const person = persons.find( person => person.id === personId)
   
   if (!person) {
       return response.status(404).end()
   }

   response.json(person);
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    });
  }

  const isNameDuplicate = persons.some(person => person.name === body.name);

  if(isNameDuplicate) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const newPerson = {
    ...body,
    id:Math.floor(Math.random() * (1000 - 1 + 1) + 1)
  };
  persons = persons.concat(newPerson);
  response.json(newPerson);
});

app.delete('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id);
    persons = persons.filter( person => person.id !== personId);
        response.status(204).end();
 });

const PORT= process.env.PORT || 3001
app.listen(PORT)
