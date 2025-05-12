const express = require('express');
const router = express.Router();

// Controllers
const AuthController = require('../controllers/Auth');
const MenuController = require('../controllers/Menu');

// Routes /user
router.get('/auth', AuthController.getAllUsers);
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup)


// Routes /menu
router.get('/menu', MenuController.getAllMenus);
router.get('/menu/:id', MenuController.getMenuById);
router.post('/menu', MenuController.createMenu);
router.put('/menu/:id', MenuController.updateMenu);
router.delete('/menu/:id', MenuController.deleteMenu);

module.exports = router;
