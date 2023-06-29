const router = require("express").Router();
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

// возвращает все карточки
router.get("", auth, getCards);

// создаёт карточку
router.post(
  "",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(
          /(?:http|https):\/\/((?:[\w-]+)(?:\.[\w-]+)+)(?:[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
        ),
    }),
  }),
  createCard
);

// удаляет карточку по идентификатору
router.delete("/:cardId", auth, deleteCard);

// поставить лайк карточке
router.put("/:cardId/likes", auth, likeCard);

// убрать лайк с карточки
router.delete("/:cardId/likes", auth, dislikeCard);

module.exports = router;
