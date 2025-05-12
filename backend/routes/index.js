const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// Middleware
const authMiddleware = require('../authMiddleware');
const requireRole = require('../roleMiddleware');
// Controllers
const AuthController = require('../controllers/Auth');
const MenuController = require('../controllers/Menu');
const ReservationTableController = require('../controllers/ReservationTable');
const ReservationController = require('../controllers/Reservation');

// Routes /user
router.get('/auth', authMiddleware, requireRole(Role.ADMIN), AuthController.getAllUsers);
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup)


// Routes /menu
router.get('/menu', MenuController.getAllMenus);
router.get('/menu/:id', MenuController.getMenuById);
router.post('/menu', authMiddleware, requireRole(Role.ADMIN), MenuController.createMenu);
router.put('/menu/:id', authMiddleware, requireRole(Role.ADMIN), MenuController.updateMenu);
router.delete('/menu/:id',  authMiddleware, requireRole(Role.ADMIN), MenuController.deleteMenu);


// Routes /reservation
router.get('/reservation', ReservationController.getAllReservations);
router.get('/reservation/:user_id', ReservationController.getMyReservations);
router.post('/reservation', ReservationController.createReservation);
router.put('/reservation/:id', ReservationController.updateReservation);
router.delete('/reservation/:id', ReservationController.deleteReservation);

// Routes /reservation_table
router.get('/reservation_table', ReservationTableController.getAllReservationTables);
router.get('/reservation_table/table/:table_id', ReservationTableController.getReservationTableByTableId);
router.get('/reservation_table/reservation/:reservation_id', ReservationTableController.getReservationTableByReservationId);
router.post('/reservation_table', ReservationTableController.createReservationTable);
router.delete('/reservation_table/:reservation_id/:table_id', ReservationTableController.deleteReservationTable);

module.exports = router;
