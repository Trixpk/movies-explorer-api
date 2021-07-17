const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(
      new RegExp('^(http|https):\\/\\/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\\.[a-z]{2,4}\\b(\\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?'),
    ).required(),
    trailer: Joi.string().pattern(
      new RegExp('^(http|https):\\/\\/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\\.[a-z]{2,4}\\b(\\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?'),
    ).required(),
    thumbnail: Joi.string().pattern(
      new RegExp('^(http|https):\\/\\/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\\.[a-z]{2,4}\\b(\\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?'),
    ).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).required(),
}), createMovie);
router.delete('/:movieId', celebrate({
  params: {
    movieId: Joi.string().length(24).hex().required(),
  },
}), deleteMovie);

module.exports = router;
