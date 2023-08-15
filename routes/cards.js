const router = require('express').Router();
const Card = require('../models/card');
const { getCards, createCard, deleteCard, putLikeCard, deleteLikeCard } = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', putLikeCard);

router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;