const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.json())
app.use(morgan(':method :url :response-time :status :body'))
app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const person = persons.find(p => p.id === id)
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.filter(p => p.id !== id)

    // response.status(204).end()

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`Phonebook has info for ${persons.length} people. <br /> ${date}`)
})

const generateId = () => {
    const randomId = Math.floor(Math.random() * 1000)
    return randomId
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ error: 'name missing' })
    }

    if (!body.number) {
        return response.status(400).json({ error: 'number missing' })
    }

    // if (persons.some(p => p.name === body.name)) {
    //     return response.status(400).json({ error: 'name already exists in the phonebook' })
    // }

    const person = new Person({
        // id: generateId(),
        name: body.name,
        number: body.number,
    })

    // persons = persons.concat(person)
    // response.json(person)

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})