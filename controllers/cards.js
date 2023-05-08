const Card = require('../models/card');
const {
  CREATED_CODE,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/response-codes');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Передан некорректный id карточки',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Карточка с указанным id не найдена',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Передан несуществующий id карточки',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Передан несуществующий id карточки',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
