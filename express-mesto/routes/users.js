const router = require("express").Router();
const {
  getUsers,
  getUsersById,
  createUsers,
  updateUserById,
  updateUserAvatarById,
  // deleteUserById,
} = require("../controllers/users");

// список пользователей
router.get("", getUsers);

// поиск пользователя по id
router.get("/:id", getUsersById);

// создание пользователя
router.post("", createUsers);

// обновляет профиль
router.patch("/me", updateUserById);

// обновляет аватар пользователя
router.patch("/me/avatar", updateUserAvatarById);

// // удалить пользователя
// router.delte("/me", deleteUserById);

module.exports = router;
