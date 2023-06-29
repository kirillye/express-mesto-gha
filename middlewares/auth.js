const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const ForbiddenError = require("../errors/forbidden");

module.exports = (req, res, next) => {

  // Отправка токена в ответе
  // const token = req.headers.authorization;

  // Токен через cookies
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err)
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
