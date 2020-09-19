const mongoose = require('mongoose');

const argumentsCount = process.argv.length;

if (argumentsCount < 3) {
    console.log('This application needs at least tree arguments in order to run: node mongo.js <your password>');
    process.exit(1);
} else {
    const password = process.argv[2];
    const url = `mongodb+srv://korisnik_1:${password}@cluster0.f3yob.mongodb.net/phonebook-app?retryWrites=true&w=majority`
    mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true});
    const personSchema = new mongoose.Schema({
        name:String,
        number:String
    });
    personSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString();
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    });
    const Person = mongoose.model('Person', personSchema);
    
    if (argumentsCount === 3) {
        let allPhonebookEntries='';
        Person.find({})
            .then(persons => {
                persons.forEach(person => {
                    allPhonebookEntries = `${allPhonebookEntries}${person.name} ${person.number}\n`
                });
                console.log(`phonebook:\n${allPhonebookEntries}`);
                mongoose.connection.close();
            });
    } else {
        const person = new Person({
            name:process.argv[3],
            number:process.argv[4]
        })
        person.save().then(savedPerson => {
            console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`);
            mongoose.connection.close();
        });
    }
}