require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

// Middleware
app.use(express.static('build'))
app.use(express.json())
app.use(cors())

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
  Person.find({}).then(result => {
    response.send(`<p>Phonebook has info for ${result.length} people</p><p>${date}</p>`)
  })
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (name === undefined | number === undefined) {
    return response.status(400).json({ error: 'Name or number is missing' })
  }

  const newPerson = new Person({
    name: name,
    number: number
  })

  Person.find({ name: newPerson.name })
    .then(person => {
      if (person.length > 0) {
        return response.status(400).json({ error: 'Person is already in phonebook' }).end()
      } else {
        newPerson.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      //response.json(person)
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Update person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// handler of requests with malformatted id
// Already present in solution to exercise 3.15
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})