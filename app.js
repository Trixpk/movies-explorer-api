require('dotenv').config();

const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const auth = require('./middlewares/auth');
const {
  usersRoutes,
  moviesRoutes,
  signinRoute,
  signupRouter,
  signOut,
} = require('./routes/index');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const corsOptions = {
  origin: 'https://trixpk.nomoredomains.club/',
  optionsSuccessStatus: 200,
  credentials: true,
};

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

app.use(cors(corsOptions));

app.use(requestLogger);

app.use('/signup', signupRouter);
app.use('/signin', signinRoute);
app.use('/signout', signOut);

app.use(auth);
app.use('/users', usersRoutes);
app.use('/movies', moviesRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена 404'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер доступен по адресу http://localhost:${PORT}`);
});
