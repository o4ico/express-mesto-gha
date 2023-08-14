const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  User.create({ name, about, avatar })
    .then(user => res.send({
      data: user
    }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserInfo = (req, res) => {
  const { userId } = req.user._id;
  User.findById(req.user._id)
    .then(user => res.send({
      data: user
    }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};