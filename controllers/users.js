const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при добавлении пользователя' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
};

module.exports.getUserInfo = (req, res) => {
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
  User.findByIdAndUpdate(req.user._id, { name, about })
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
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Пользователь по указанному ${_id} не найден` })
      }
      if (avatar === undefined) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара профиля' })
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