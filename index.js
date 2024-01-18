const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: "Jon",
    number: "333",
    id: 5
  }
]
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
  const currentTime = new Date()
  const infoMessage = `Phonebook has info for ${persons.length} people.`
  console.log('GET/info')
  response.send(`<p>${infoMessage}</p>\n<p>${currentTime}</p>`)
})
app.get('/api/persons', (request, response) => {
  console.log('GET api/persons')
  response.json(persons)
})
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
  console.log(`DELETE/api/persons/${id}`)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const contentType = request.header('Content-Type')
  if (!contentType || !contentType.includes('application/json')) {
    return response.status(400).json({ error: 'Content-Type Unsupported' })
  }
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const existingPerson = persons.find(person => person.name === body.name)
  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000)
  }
  persons = persons.concat(person)
  console.log(`POST/api/persons Added: ${person.name}`)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
