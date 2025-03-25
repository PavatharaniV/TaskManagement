const express = require('express');

const router = express.Router();
const { createUser, Login, refreshToken } = require('../controllers/user')
const { isAuth } = require('../middleware/auth');

router.post('/auth/signup', createUser);
router.post('/auth/login', Login);
router.post('/refresh',refreshToken)

module.exports = router;