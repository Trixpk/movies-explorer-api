const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then(movies => {
      res.status(200).send({ data: movies });
    })
    .catch(next);
}

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id
  })
    .then(movie => {
      res.status(200).send({data: movie});
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(err);
      }
    })
}

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById( movieId )
    .then(movie => {
      if(!movie) {
        next(new NotFoundError('Фильм не найден'));
      }

      if(movie.owner.toString() === req.user._id) {
        Movie.deleteOne({ _id: movie._id })
          .then(deletedMovie => {
            res.status(200).send({ data: deletedMovie });
          })
          .catch(next);
      }else {
        next(new ForbiddenError('Не достаточно прав'));
      }
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка валидации'));
      }

      next(err);
    })
}