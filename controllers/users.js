const User = require('../models/user');
const {
  CREATED_CODE,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/response-codes');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Передан некорректный id пользователя',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Пользователь по указанному id не найден',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
};
