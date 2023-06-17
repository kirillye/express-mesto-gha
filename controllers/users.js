const User = require("../models/User");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(500).send({ message: "server error" });
    });
};

const getUsersById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "user not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return res
          .status(400)
          .send({ message: "Id пользователя не корректен" });
      }
      console.log(err.name);
      return res.send(err.name);
      return res.status(500).send({ message: "server error" });
    });
};

const createUsers = (req, res) => {
  const newUserData = req.body;
  return User.create(newUserData)
    .then((newUser) => {
      return res.status(201).send(newUser);
    })
    .catch((err) => {
      console.log(err);
      if (err.name == "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join()}`,
        });
      }
      return res.status(500).send({ message: "server error" });
    });
};

const updateUserById = (req, res) => {
  const userId = req.user;
  const newUserData = req.body;
  return User.findOneAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "user not found" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name == "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join()}`,
        });
      }
      return res.status(500).send({ message: "server error" });
    });
};

const updateUserAvatarById = (req, res) => {
  const userId = req.user;
  const newUserDataAvatar = req.body.avatar;
  return User.findOneAndUpdate(
    userId,
    { avatar: `${newUserDataAvatar}` },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "user not found" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name == "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join()}`,
        });
      }
      return res.status(500).send({ message: "server error" });
    });
};

// const deleteUserById = (req, res) => {};

module.exports = {
  getUsers,
  getUsersById,
  createUsers,
  updateUserById,
  updateUserAvatarById,
  // deleteUserById,
};
