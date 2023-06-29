const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { NODE_ENV, JWT_SECRET } = process.env;

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    { expiresIn: "7d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, options, function (err, decoded) {
    if (err) return false;

    return User.findById(decoded.id).then((user) => {
      return Boolean(user);
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
