const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const Unauthorized = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  // Отправка токена в ответе
  // const token = req.headers.authorization;

  // Токен через cookies
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Unauthorized("Необходимо авторизоваться"));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
