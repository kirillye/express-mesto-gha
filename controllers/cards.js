const Card = require("../models/Card");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch(() => {
      return res.status(500).send({ message: "server error" });
    });
};

const createCard = (req, res) => {
  let newCardsData = req.body;
  newCardsData.owner = req.user._id;
  // return res.status(201).send(newCardsData);
  return Card.create(newCardsData)
    .then((newCards) => {
      return res.status(201).send(newCards);
    })
    .catch((err) => {
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

const deleteCard = (req, res) => {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "user not found" });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).send({ message: "id карточки не корректен" });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
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
        return res.status(404).send({ message: "user not found" });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).send({ message: "id карточки не корректен" });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
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
        return res.status(404).send({ message: "user not found" });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).send({ message: "id карточки не корректен" });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
