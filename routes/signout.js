const router = require('express').Router();
const { signOut } = require('../controllers/users');

router.post('/', signOut);

module.exports = router;
