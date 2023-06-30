const User = require("../models/User");
const { generateToken } = require("../util/jwt");
const bcrypt = require("bcryptjs");
const { GeneralError, BadRequest, NotFound } = require("../util/errors");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return next(new GeneralError(err.message));
    });
};

const getUserInfo = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch((err) => {
      return next(new GeneralError(err.message));
    });
};

const getUsersById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFound("Пользователь не найден");
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      return next(new GeneralError(err.message));
    });
};

const createUsers = (req, res) => {
  const newUserData = req.body;
  User.findOne({ email: newUserData.email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: "email уже зарегистрирован" });
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
          const { password, ...others } = newUser._doc;
          return res.status(201).send(others);
        })
        .catch((err) => {
          return next(new GeneralError(err.message));
        });
    })
    .catch((err) => {
      return next(new GeneralError(err.message));
    });
};

const login = (req, res) => {
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
    .catch((err) => {
      if (err.message == "Неправильные почта или пароль") {
        res.status(401).send({ message: err.message });
      } else {
        return next(new GeneralError(err.message));
      }
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
      return next(new GeneralError(err.message));
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
        return next(new GeneralError(err.message));
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
