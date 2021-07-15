const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized');
const BadRequestError = require('../errors/bad-request');
const MongoError = require('../errors/mongo-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Необходима авторизация'));
      }

      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 6)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const response = user.toObject();
      delete response.password;
      res.status(200).send({ data: response });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new MongoError('Такой пользователь уже зарегистрирован!'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;

  User.findOne({ email }).select('+ password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Не правильные почта или пароль'));
      }

      userId = user._id;
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Не правильные почта или пароль'));
          }

          const token = jwt.sign(
            { _id: userId },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          res
            .cookie('jwt', token, { httpOnly: true })
            .status(200)
            .send({ jwt: token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt').status(200).send({ message: 'Всего доброго' });
};
