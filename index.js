require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
    response.send('<h1>Welcome to the phonebook REST? api</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

const generateId = () => {
    const randId = Math.round(Math.random() * 100000000)
    return randId 
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name | !body.number) {
    return response.status(400).json({
      error: "Name or number is missing",
    });
  }

  const checkifNameExists = persons.find((person) => person.name === body.name);
  if (checkifNameExists) {
    return response.status(400).json({
        error: "Name already exists in phonebook",
    })
  }   

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})