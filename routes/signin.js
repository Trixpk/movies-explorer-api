const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { login } = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
}), login);

module.exports = router;
