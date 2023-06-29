const User = require("../models/User");
const { generateToken } = require("../util/jwt");
const bcrypt = require("bcryptjs");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden");
const BadRequestError = require("../errors/bad-reques-error");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(500).send({ message: err.message });
    });
};

const getUserInfo = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      return res.status(200).send({ message: { user } });
    })
    .catch((err) => {
      return res.status(500).send({ message: err.message });
    });
};

const getUsersById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name == "CastError") {
        throw new BadRequestError("Id пользователя не корректен");
      }
      return res.status(500).send({ message: err.message });
    });
};

const createUsers = (req, res) => {
  const newUserData = req.body;
  User.findOne({ email: newUserData.email })
    .then((user) => {
      if (user) {
        throw new ForbiddenError("Такой пользователь уже есть");
      }
      return bcrypt
        .hash(req.body.password, 10)
        .then((hash) =>
          User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            about: req.body.about,
            avatar: req.body.avatar,
          })
        )
        .then((newUser) => {
          return res.status(201).send(newUser);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user);
      return res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: "Авторизация прошла успешно" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const updateUserById = (req, res) => {
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
        throw new NotFoundError("Пользователь не найден");
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join()}`,
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

const updateUserAvatarById = (req, res) => {
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
        throw new NotFoundError(`Пользователь не найден`);
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join()}`,
        });
      }
      return res.status(500).send({ message: err.message });
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
