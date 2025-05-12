const express = require('express');
const router = express.Router();

// Controllers
const AuthController = require('../controllers/Auth');
const ReservationTableController = require('../controllers/ReservationTable');
const ReservationController = require('../controllers/Reservation');

// Routes /user
router.get('/auth', AuthController.getAllUsers);


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
