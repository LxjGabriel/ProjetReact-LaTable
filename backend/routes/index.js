const express = require('express');
const router = express.Router();

// Controllers
const AuthController = require('../controllers/Auth');

// Routes /user
router.get('/auth', AuthController.getAllUsers);
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup)

module.exports = router;
