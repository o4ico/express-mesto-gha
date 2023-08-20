const Card = require('../models/card');
const { InternalServerError } = require('../errors/InternalServerError');
const { ConflictError } = require('../errors/ConflictError');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { BadRequestError } = require('../errors/BadRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then(cards => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;

  console.log(name, link, req.user._id);
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(201).send(cards))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
}

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(`Карточка с указанным id(${cardId}) не найдена`));
      }
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
      }
      next(err);
    });
}

module.exports.putLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(`Карточка с указанным id(${cardId}) не найдена`));
      }
      return res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при добавлении лайка карточке'));
      }
      next(err);
    });
}

module.exports.deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(`Карточка с указанным id(${cardId}) не найдена`));
      }
      return res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при добавлении лайка карточке'));
      }
      next(err);
    });
}