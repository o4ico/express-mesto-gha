const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, dataBase_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

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

app.use((req, res, next) => {
  req.user = {
    _id: '64db0f2905cee63f80294a97',
  };

  next();
});

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));
app.use('*', (req, res) => {
  return res.status(400).send({ message: 'Страницы не существует' })
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});