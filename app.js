const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const NotFoundError = require('./errors/not-found-err');
const { createUser, login, signOut } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
    password: Joi.string().required(),
  }).required(),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
}), login);
app.post('/signOut', signOut);

app.use(auth);
app.use('/users', usersRoutes);
app.use('/movies', moviesRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена 404'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: message || 'Произошла ошибка на сервере',
    });

  return next();
});

app.listen(PORT, () => {
  console.log(`Сервер доступен по адресу http://localhost:${PORT}`);
});
