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
      name: Joi.string().required().min(2).max(30),
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
router.delete("/:cardId", auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.number().min(10)
  }),
}), deleteCard);

// поставить лайк карточке
router.put("/:cardId/likes", auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(10)
  }),
}), likeCard);

// убрать лайк с карточки
router.delete("/:cardId/likes", auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(10)
  }),
}), dislikeCard);

module.exports = router;
