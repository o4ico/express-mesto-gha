require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { loginValidation, createUserValidation } = require('./middlewares/validation');
const errorHandler = require('./middlewares/errorHandler');
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use('*', (req, res) => {
  return res.status(404).send({ message: 'Страницы не существует' })
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});