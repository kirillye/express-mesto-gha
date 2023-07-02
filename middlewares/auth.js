const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const AuthError = require("../errors/auth-error");

module.exports = (req, res, next) => {
  // Отправка токена в ответе
  // const token = req.headers.authorization;

  // Токен через cookies
  const token = req.cookies.jwt;
  let payload;

  if (!token) {
    return next(new AuthError("Необходимо авторизоваться"));
  }

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthError("Необходимо авторизоваться"));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
