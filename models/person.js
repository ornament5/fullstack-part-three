const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URL

mongoose.connect(url, { useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true })
const personSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    minlength:3,
    unique:true
  },
  number:{
    type:String,
    minlength:8,
    required:true
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
personSchema.plugin(uniqueValidator)
const Person = mongoose.model('Person', personSchema)

module.exports = Person