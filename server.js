const express = require('express');
const app = express();
const morgan = require('morgan');

morgan.token('path', (req) => req.path);

// morgan.token('person', (req) => req.body.name);

// morgan.token('number', (req) => req.body.number);

morgan.token('nameNumber', (req) =>
  JSON.stringify({ name: req.body.name, number: req.body.number })
);

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method);
//   console.log('Path:  ', request.path);
//   console.log('Body:  ', request.body);
//   console.log('---');
//   next();
// };

app.use(express.json());
// app.use(requestLogger);
app.use(
  morgan(
    ':method :path :status :res[content-length] - :response-time ms :nameNumber'
  )
  // {"name":":person", "number":":number"}
);

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

// app.get('/', (request, response) => {
//   response.send('<h1>Exercises 3.1-3.6</h1>');
// });
app.get('/', function (req, res) {
  res.send('hello, world!');
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
  body.number = generateNumber();
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
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
