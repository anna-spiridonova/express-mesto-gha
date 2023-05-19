const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use(userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Передан несуществующий запрос'));
});

module.exports = router;
