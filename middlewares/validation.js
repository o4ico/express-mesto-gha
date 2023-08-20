const { celebrate, Joi } = require('celebrate');
linkValid = (/http:\/\/(.+?)\/(([a-zA-Z0-9_ \-%\.]*)\.(jpg|png|jpeg|gif))/);
const { ValidationError } = require('../errors/ValidationError');

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const userInfoEditValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({ 'ValidationError': 'Переданы некорректные данные' }),
    about: Joi.string().min(2).max(30).messages({ 'ValidationError': 'Переданы некорректные данные' }),
  }),
});

const userAvatarEditValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(linkValid).messages({ 'ValidationError': 'Переданы некорректные данные' }),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required().messages({ 'ValidationError': 'Переданы некорректные данные' }),
  }),
});

const cardCreateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({ 'ValidationError': 'Переданы некорректные данные' }),
    link: Joi.string().regex(linkValid).required().messages({ 'ValidationError': 'Переданы некорректные данные' }),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({ 'ValidationError': 'Переданы некорректные данные' }),
    password: Joi.string().required().min(8).messages({ 'ValidationError': 'Переданы некорректные данные' }),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({ 'ValidationError': 'Переданы некорректные данные' }),
    about: Joi.string().min(2).max(30).messages({ 'ValidationError': 'Переданы некорректные данные' }),
    avatar: Joi.string().regex(linkValid).messages({ 'ValidationError': 'Переданы некорректные данные' }),
    email: Joi.string().required().email().messages({ 'ValidationError': 'Переданы некорректные данные' }),
    password: Joi.string().required().min(8).messages({ 'ValidationError': 'Переданы некорректные данные' }),
  }),
});

module.exports = {
  userIdValidation,
  userInfoEditValidation,
  userAvatarEditValidation,
  cardIdValidation,
  cardCreateValidation,
  loginValidation,
  createUserValidation,
};