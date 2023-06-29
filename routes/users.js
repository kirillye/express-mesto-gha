const router = require("express").Router();
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUserInfo,
  getUsersById,
  createUsers,
  login,
  updateUserById,
  updateUserAvatarById,
  // deleteUserById,
} = require("../controllers/users");

// список пользователей
router.get("/users", auth, getUsers);

// Информация о пользователе
router.get("/users/me", auth, getUserInfo);

// поиск пользователя по id
router.get("/users/:id", auth, getUsersById);

// создание пользователя
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email({ minDomainSegments: 2 }),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")),
    }),
  }),
  createUsers
);

// авторизация
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email({ minDomainSegments: 2 }),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")),
    }),
  }),
  login
);

// обновляет профиль
router.patch(
  "/users/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      about: Joi.string().min(3).max(30),
      name: Joi.string().min(2).max(30),
    }),
  }),
  updateUserById
);

// обновляет аватар пользователя
router.patch(
  "/users/me/avatar",
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /(?:http|https):\/\/((?:[\w-]+)(?:\.[\w-]+)+)(?:[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
        ),
    }),
  }),
  updateUserAvatarById
);

// // удалить пользователя
// router.delte("/me", deleteUserById);

module.exports = router;
