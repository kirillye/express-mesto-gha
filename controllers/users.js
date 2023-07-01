const User = require("../models/User");
const { generateToken } = require("../util/jwt");
const bcrypt = require("bcryptjs");
const BadRequest = require("../errors/bad-request-error");
const NotFound = require("../errors/not-found-error");
const Conflict = require("../errors/conflict-error");

const getUsers = (req, res, next) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch(next);
};

const getUsersById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFound("Пользователь не найден");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Передан некорретный Id"));
        return;
      }
      next(err);
    });
};

const createUsers = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      })
        .then((newUser) => {
          const { password, ...others } = newUser._doc;
          return res.status(201).send(others);
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new Conflict("Пользователь уже зарегистрирован"));
          }
          if (err.name === "ValidationError") {
            return next(new Conflict("Данные не корректны"));
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user);

      // отправка токена в ответе
      // return res.send({token})

      // Токен через cookies
      return res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: "Авторизация прошла успешна!" });
    })
    .catch(next);
};

const updateUserById = (req, res, next) => {
  const filter = {
    _id: req.user._id,
  };
  const newUserData = req.body;
  return User.findOneAndUpdate(filter, newUserData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFound("Пользователь не найден");
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        return next(
          new BadRequest(
            `${Object.values(err.errors)
              .map((err) => err.message)
              .join()}`
          )
        );
      }
      next(err);
    });
};

const updateUserAvatarById = (req, res, next) => {
  const filter = {
    _id: req.user._id,
  };
  const newUserDataAvatar = req.body.avatar;
  return User.findOneAndUpdate(
    filter,
    { avatar: `${newUserDataAvatar}` },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFound(`Пользователь не найден`);
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        return next(
          new BadRequest(
            `${Object.values(err.errors)
              .map((err) => err.message)
              .join()}`
          )
        );
      } else {
        next(err);
      }
    });
};

// const deleteUserById = (req, res) => {};

module.exports = {
  getUsers,
  getUserInfo,
  getUsersById,
  createUsers,
  login,
  updateUserById,
  updateUserAvatarById,
  // deleteUserById,
};
