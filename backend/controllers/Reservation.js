const Reservation = require('./../models/reservations.model.js');
const ReservationTable = require('./../models/reservation_tables.model.js');
const OpeningSlot = require('./../models/opening_slots.model.js');
const TableAvailabilityService = require('./../services/TableAvailabilityService.js');
const db = require('../db');

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
    async getReservationsByUserId(req, res) {
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

    async getMyReservations(req, res) {
        const user_id = req.user.id;

        console.log(user_id);
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
        const { user_id, number_of_people, date, time, status, opening_slot_id } = req.body;
        
        if (!user_id || !number_of_people || !opening_slot_id) {
            return res.status(400).json({ error: "Données de réservation incomplètes" });
        }

        try {
            // Vérifier la disponibilité des tables pour ce créneau
            const availabilityCheck = await TableAvailabilityService.checkAvailability(opening_slot_id, number_of_people);
            
            if (!availabilityCheck.available) {
                return res.status(400).json({ error: availabilityCheck.message });
            }
            
            // Démarrer une transaction
            const client = await db.connect();
            try {
                await client.query('BEGIN');
                
                // Créer la réservation
                const newReservation = {user_id, number_of_people, date, time, status, opening_slot_id};
                const reservationResult = await client.query(
                    'INSERT INTO reservations (user_id, number_of_people, date, time, status, opening_slot_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [user_id, number_of_people, date, time, status, opening_slot_id]
                );
                
                const createdReservation = reservationResult.rows[0];
                
                // Associer les tables sélectionnées à la réservation et mettre à jour la disponibilité du créneau
                const selectedTables = availabilityCheck.selectedTables;
                const tableIds = selectedTables.map(table => table.id);
                
                // Utiliser notre service pour associer les tables et mettre à jour la disponibilité du créneau
                // en passant le client existant pour utiliser la même transaction
                await TableAvailabilityService.assignTablesToReservation(createdReservation.id, tableIds, opening_slot_id, client);
                
                await client.query('COMMIT');
                
                res.status(201).json({ 
                    message: 'Reservation créée avec succès', 
                    reservation: createdReservation,
                    tables: selectedTables
                });
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }
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

        const { user_id, number_of_people, date, time, status, opening_slot_id } = req.body;
        if (!user_id || !number_of_people || !date || !time) {
            return res.status(400).json({ error: "Données de réservation incomplètes" });
        }

        try {
            // Récupérer la réservation existante
            const existingReservationResult = await Reservation.findById(id);
            if (existingReservationResult.rows.length === 0) {
                return res.status(404).json({ error: "Réservation non trouvée" });
            }
            
            const existingReservation = existingReservationResult.rows[0];
            
            // Vérifier si le nombre de personnes ou le créneau a changé
            const peopleChanged = existingReservation.number_of_people !== Number(number_of_people);
            const slotChanged = existingReservation.opening_slot_id !== Number(opening_slot_id);
            
            // Si un paramètre critique a changé, vérifier la disponibilité
            if ((peopleChanged || slotChanged) && opening_slot_id) {
                // Vérifier la disponibilité des tables pour le nouveau créneau
                const availabilityCheck = await TableAvailabilityService.checkAvailability(
                    opening_slot_id, 
                    number_of_people
                );
                
                if (!availabilityCheck.available) {
                    return res.status(400).json({ error: availabilityCheck.message });
                }
                
                // Démarrer une transaction pour la mise à jour
                const client = await db.connect();
                try {
                    await client.query('BEGIN');
                    
                    // Mettre à jour la réservation
                    const updatedReservation = {user_id, number_of_people, date, time, status, opening_slot_id};
                    await client.query(
                        'UPDATE reservations SET user_id = $1, number_of_people = $2, date = $3, time = $4, status = $5, opening_slot_id = $6 WHERE id = $7',
                        [user_id, number_of_people, date, time, status, opening_slot_id, id]
                    );
                    
                    // Supprimer les anciennes associations de tables
                    await client.query(
                        'DELETE FROM reservation_tables WHERE reservation_id = $1',
                        [id]
                    );
                    
                    // Créer les nouvelles associations de tables et mettre à jour la disponibilité du créneau
                    const selectedTables = availabilityCheck.selectedTables;
                    const tableIds = selectedTables.map(table => table.id);
                    
                    // Utiliser notre service pour associer les tables et mettre à jour la disponibilité du créneau
                    // en passant le client existant pour utiliser la même transaction
                    await TableAvailabilityService.assignTablesToReservation(id, tableIds, opening_slot_id, client);
                    
                    await client.query('COMMIT');
                    
                    res.status(200).json({ 
                        message: 'Réservation mise à jour avec succès',
                        reservation: { id, user_id, number_of_people, date, time, status, opening_slot_id },
                        tables: selectedTables
                    });
                } catch (err) {
                    await client.query('ROLLBACK');
                    throw err;
                } finally {
                    client.release();
                }
            } else {
                // Si aucun paramètre critique n'a changé, mettre à jour simplement la réservation
                const updatedReservation = {
                    user_id, 
                    number_of_people, 
                    date, 
                    time, 
                    status, 
                    opening_slot_id: opening_slot_id || existingReservation.opening_slot_id
                };
                
                const result = await Reservation.update(id, updatedReservation);
                
                res.status(200).json({ 
                    message: 'Réservation mise à jour', 
                    reservation: { 
                        id, 
                        user_id, 
                        number_of_people, 
                        date, 
                        time, 
                        status, 
                        opening_slot_id: opening_slot_id || existingReservation.opening_slot_id
                    }
                });
            }
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