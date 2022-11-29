const express = require('express')
const app = express()

let persons = [ 
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

var morgan = require('morgan')
app.use(express.json())

// Middleware
const logger = morgan(function (tokens, req, res) {
  let message = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
  let body = req.body;
  if (tokens.method(req, res) === "POST") {
    message += `\n${JSON.stringify(body)}`;
  }
  return message
})
app.use(logger)

app.get('/', (request, response) => {
    response.send('<h1>Welcome to the phonebook REST? api</h1>')
})

app.get('/api/persons/', (request, response) => {
    response.json(persons)
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
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});