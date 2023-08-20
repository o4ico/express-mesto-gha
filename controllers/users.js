const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const { SECRET_KEY } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {

    return res.status(400).send({ message: 'Переданы некорректные данные при добавлении пользователя' })
  }
  bcrypt.hash(req.body.password, 8)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({ name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user.id }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при добавлении пользователя' })
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Пользователь с этим email уже существует' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь по указанному ${userId} не найден` })
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
};

module.exports.patchUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  console.log(name, about, req.user._id, _id)
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь по указанному ${_id} не найден` })
      }
      if (name === undefined || about === undefined) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  console.log(avatar, req.user._id)
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь по указанному ${_id} не найден` })
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара профиля' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' }
      );

      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: 'Успешная авторизация!' });
    })

    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getCurrentUserInfo = (req, res) => {
  const { _id } = req.user;
  console.log(req.user._id);
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь по указанному ${_id} не найден` })
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
};