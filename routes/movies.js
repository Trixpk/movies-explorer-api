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
    image: Joi.string().uri().required(),
    trailer: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().required(),
    movieId: Joi.string().required(),
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