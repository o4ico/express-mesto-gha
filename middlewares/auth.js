const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');

module.exports = (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }

    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, SECRET_KEY);// верифицируем токен
    } catch (err) {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }

    req.user = payload; // записываем пейлоуд в объект запроса

    next(); // пропускаем запрос дальше
  } catch (err) {
    next(err);
  }

};