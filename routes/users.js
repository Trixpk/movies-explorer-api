const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getUser,
  updateUser
} = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required()
  }).required()
}) , updateUser);

module.exports = router;