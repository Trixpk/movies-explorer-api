const mongoose = require('mongoose');
const { emailRegExp } = require('../utils/regexp');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: (v) => emailRegExp.test(v),
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  }
});

module.exports = mongoose.model('user', userSchema);