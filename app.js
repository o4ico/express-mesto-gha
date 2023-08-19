require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth.js');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000, dataBase_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(cookieParser());

mongoose
  .connect(dataBase_URL, {})
  .then(() => {
    console.log(`Подключен к базе данных на ${dataBase_URL}`);
  })
  .catch((err) => {
    console.log(`Ошибка при подключении к базе данных ${err}`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
/*
app.use((req, res, next) => {
  req.user = {
    _id: '64db0f2905cee63f80294a97',
  };

  next();
});*/

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));
app.post('/signin', login);
app.post('/signup', createUser);
app.use('*', (req, res) => {
  return res.status(404).send({ message: 'Страницы не существует' })
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});