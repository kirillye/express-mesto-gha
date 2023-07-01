const Card = require("../models/Card");
const BadRequest = require("../errors/bad-request-error");
const NotFound = require("../errors/not-found-error");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res) => {
  let newCardsData = req.body;
  newCardsData.owner = req.user._id;
  return Card.create(newCardsData)
    .then((newCards) => {
      return res.status(201).send(newCards);
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

const deleteCard = (req, res) => {
  const userId = req.user._id;
  return Card.findByIdAndRemove({ _id: req.params.cardId }, { owner: userId })
    .then((card) => {
      if (!card) {
        throw new NotFound("Карточка не найдена");
      }
      if (!(userId == card.owner)) {
        return res
          .status(403)
          .send({ message: "У вас нет прав не удаление карточки" });
      } else {
        return res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return next(new BadRequest("id карточки не корректен"));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFound("Карточка не найдена");
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return next(new BadRequest("id карточки не корректен"));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFound("Карточка не найдена");
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return next(new BadRequest("id карточки не корректен"));
      } else {
        next(err);
      }
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
