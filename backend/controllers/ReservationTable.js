const pool = require('../db');
const ReservationTable = require('./../models/reservation_tables.model.js');

class ReservationTableController {
    async getAllReservationTables(req, res) {
        try {
            const result = await ReservationTable.getAll();
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async getReservationTableByTableId(req, res) {
        const { table_id } = req.params;

        if (!table_id) {
            return res.status(400).json({ error: "ID de table requis" });
        }

        try {
            const result = await ReservationTable.findByTableId(table_id);
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async getReservationTableByReservationId(req, res) {
        const { reservation_id } = req.params;

        if (!reservation_id) {
            return res.status(400).json({ error: "ID utilisateur requis" });
        }

        try {
            const result = await ReservationTable.findByReservationId(reservation_id);
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async createReservationTable(req, res) {
        const { reservation_id, table_id } = req.body;
        try {
            const newReservationTable = {reservation_id, table_id};
            const result = await ReservationTable.create(newReservationTable);
            res.status(201).json({ message: 'Reservation Table créée', reservation: result });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async deleteReservationTable(req, res) {
        const { reservation_id, table_id } = req.params;
        try {
            const result = await ReservationTable.delete(reservation_id, table_id);
            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Réservation non trouvée" });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}

module.exports = new ReservationTableController();