const Reservation = require('./../models/reservations.model.js');
// const ReservationTable = require('./..models/reservation_tables.model.js');

class ReservationController {

    // Only for Admin 
    async getAllReservations(req, res) {
        try {
            const result = await Reservation.getAll();
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // only for connected user
    async getMyReservations(req, res) {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ error: "ID utilisateur requis" });
        }

        try {
            const result = await Reservation.findByUserId(user_id);
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // only for connected user
    async createReservation(req, res) {
        const { user_id, number_of_people, date, time, status } = req.body;
        try {
            const newReservation = {user_id, number_of_people, date, time, status};
            const result = await Reservation.create(newReservation);
            res.status(201).json({ message: 'Reservation créée', reservation: result });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async updateReservation(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID de réservation requis" });
        }

        const { user_id, number_of_people, date, time, status } = req.body;
        if (!user_id || !number_of_people || !date || !time) {
            return res.status(400).json({ error: "Données de réservation incomplètes" });
        }

        try {
            const updatedReservation = {user_id, number_of_people, date, time, status};
            const result = await Reservation.update(id, updatedReservation);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Réservation non trouvée" });
            }

            res.status(200).json({ message: 'Reservation mise à jour', reservation: result });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async deleteReservation(req, res) {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: "ID de réservation requis" });
        }
        
        try {
            const result = await Reservation.delete(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Reservation non trouvée" });
            }
            res.status(200).json({ message: 'Reservation supprimée' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}

module.exports = new ReservationController();