const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then(cards => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;

  console.log(name, link, req.user._id);
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(201).send(cards))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  console.log(cardId);
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: `Карточка с указанным  id(${cardId}) не найдена` });
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}

module.exports.putLikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: `Пользователь по указанному id(${cardId}) не найден` })
      }
      return res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при добавлении лайка карточке' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}

module.exports.deleteLikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: `Пользователь по указанному id(${cardId}) не найден` })
      }
      return res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при удалении лайка с карточки' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    });
}