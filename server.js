const express = require('express');
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Exercises 3.1-3.6</h1>');
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>\n<p>${date}</p>`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

const generateNumber = () => {
  const number = `${Math.floor(Math.random() * 100)}-${Math.floor(
    Math.random() * 100
  )}-${Math.floor(Math.random() * (9999999 - 100000)) + 100000}`;
  return number;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const names = persons.map((e) => e.name);
  if (names.includes(body.name)) {
    return response.status(404).json({
      error: 'name must be unique',
    });
  } else if (!body.name) {
    return response.status(404).json({
      error: 'name missing',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: generateNumber(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
