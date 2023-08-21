const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return Promise.reject(new UnauthorizedError('Необходима авторизация'))
    }

    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, SECRET_KEY);// верифицируем токен
    } catch (err) {
      return Promise.reject(new UnauthorizedError('Необходима авторизация'))
    }

    req.user = payload; // записываем пейлоуд в объект запроса

    next(); // пропускаем запрос дальше
  } catch (err) {
    next(err);
  }

};