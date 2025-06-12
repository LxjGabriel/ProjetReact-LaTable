const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// Middleware
const authMiddleware = require('../authMiddleware');
const requireRole = require('../roleMiddleware');

// Controllers
const AuthController = require('../controllers/Auth');
const tableController = require('../controllers/table.controller');
const MenuController = require('../controllers/Menu');
const ReservationTableController = require('../controllers/ReservationTable');
const ReservationController = require('../controllers/Reservation');
const OpeningSlotController = require('../controllers/OpeningSlot');

// Routes /user
router.get('/auth', authMiddleware, requireRole(Role.ADMIN), AuthController.getAllUsers);
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup)
router.get('/user/:id', authMiddleware, requireRole(Role.ADMIN), AuthController.getUserById);
router.post('/change-password', authMiddleware, AuthController.changePassword);
router.get('/me', authMiddleware, AuthController.getMe);
router.put('/update-profile', authMiddleware, AuthController.updateProfile);

// Routes /menu
router.get('/menu', MenuController.getAllMenus);
router.get('/menu/category/:category', MenuController.getAllMenusByCategory);
router.get('/menu/:id', MenuController.getMenuById);
router.post('/menu', authMiddleware, requireRole(Role.ADMIN), MenuController.createMenu);
router.put('/menu/:id', authMiddleware, requireRole(Role.ADMIN), MenuController.updateMenu);
router.delete('/menu/:id',  authMiddleware, requireRole(Role.ADMIN), MenuController.deleteMenu);


// Routes /reservation
router.get('/reservation', authMiddleware, requireRole(Role.ADMIN), ReservationController.getAllReservations);
router.get('/reservation/my', authMiddleware, requireRole(), ReservationController.getMyReservations);
router.get('/reservation/:user_id', authMiddleware, requireRole(), ReservationController.getReservationsByUserId);
router.post('/reservation', authMiddleware, requireRole(), ReservationController.createReservation);
router.put('/reservation/:id', authMiddleware, requireRole(Role.ADMIN), ReservationController.updateReservation);
router.put('/reservation/:id/confirm', authMiddleware, requireRole(Role.ADMIN), ReservationController.confirmReservation);
router.delete('/reservation/:id', authMiddleware, ReservationController.deleteReservation);

// Routes /reservation_table
router.get('/reservation_table', authMiddleware, requireRole(Role.ADMIN) ,ReservationTableController.getAllReservationTables);
router.get('/reservation_table/table/:table_id', ReservationTableController.getReservationTableByTableId);
router.get('/reservation_table/reservation/:reservation_id', ReservationTableController.getReservationTableByReservationId);
router.post('/reservation_table', ReservationTableController.createReservationTable);
router.delete('/reservation_table/:reservation_id/:table_id', ReservationTableController.deleteReservationTable);

// Routes tables

router.get('/table',  authMiddleware, requireRole(), tableController.getAllTables);
router.post('/table', authMiddleware, requireRole(Role.ADMIN), tableController.createTable);
router.delete('/table/:id', authMiddleware, requireRole(Role.ADMIN), tableController.deleteTable);
router.put('/table/:id', authMiddleware, requireRole(Role.ADMIN), tableController.updateTable);

// Routes /opening_slots
router.get('/opening_slot', OpeningSlotController.getAllOpeningSlots);
router.get('/opening_slot/available', OpeningSlotController.getAllAvailableOpeningSlots);
router.get('/opening_slot/:id', OpeningSlotController.getOpeningSlotById);
router.post('/opening_slot', authMiddleware, requireRole(Role.ADMIN), OpeningSlotController.createOpeningSlot);
router.put('/opening_slot/:id', authMiddleware, requireRole(Role.ADMIN), OpeningSlotController.updateOpeningSlot);
router.delete('/opening_slot/:id', authMiddleware, requireRole(Role.ADMIN), OpeningSlotController.deleteOpeningSlot);
router.put('/opening_slot/:id/check-availability', OpeningSlotController.checkAndUpdateSlotAvailability);

module.exports = router;