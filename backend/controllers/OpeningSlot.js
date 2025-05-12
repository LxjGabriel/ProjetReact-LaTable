const OpeningSlot = require('./../models/opening_slots.model.js');
const db = require('../db');
const TableAvailabilityService = require('./../services/TableAvailabilityService.js');

class OpeningSlotController {
    // Récupérer tous les créneaux d'ouverture
    async getAllOpeningSlots(req, res) {
        try {
            const result = await OpeningSlot.getAll();
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // Récupérer tous les créneaux d'ouverture disponibles
    async getAllAvailableOpeningSlots(req, res) {
        try {
            const result = await OpeningSlot.getAllAvailable();
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // Récupérer un créneau d'ouverture par ID
    async getOpeningSlotById(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID de créneau requis" });
        }

        try {
            const result = await OpeningSlot.findById(id);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Créneau non trouvé" });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // Créer un créneau d'ouverture (admin seulement)
    async createOpeningSlot(req, res) {
        const { date_time, duration, available, comment } = req.body;
        
        if (!date_time || !duration) {
            return res.status(400).json({ error: "Date/heure et durée requises" });
        }
        
        try {
            const newOpeningSlot = { date_time, duration, available: available || true, comment: comment || '' };
            const result = await OpeningSlot.create(newOpeningSlot);
            res.status(201).json({ message: 'Créneau créé', openingSlot: result.rows[0] });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // Mettre à jour un créneau d'ouverture (admin seulement)
    async updateOpeningSlot(req, res) {
        const { id } = req.params;
        const { date_time, duration, available, comment } = req.body;

        if (!id) {
            return res.status(400).json({ error: "ID de créneau requis" });
        }

        try {
            const result = await OpeningSlot.findById(id);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Créneau non trouvé" });
            }

            const currentSlot = result.rows[0];
            const updatedSlot = {
                date_time: date_time || currentSlot.date_time,
                duration: duration || currentSlot.duration,
                available: available !== undefined ? available : currentSlot.available,
                comment: comment !== undefined ? comment : currentSlot.comment
            };

            const updateResult = await OpeningSlot.update(id, updatedSlot);
            res.status(200).json({ message: 'Créneau mis à jour', openingSlot: updateResult.rows[0] });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // Supprimer un créneau d'ouverture (admin seulement)
    async deleteOpeningSlot(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID de créneau requis" });
        }

        try {
            const result = await OpeningSlot.findById(id);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Créneau non trouvé" });
            }

            await OpeningSlot.delete(id);
            res.status(200).json({ message: 'Créneau supprimé' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    
    // Vérifier et mettre à jour la disponibilité d'un créneau
    async checkAndUpdateSlotAvailability(req, res) {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: "ID de créneau requis" });
        }
        
        try {
            // Récupérer le créneau
            const slotResult = await OpeningSlot.findById(id);
            if (slotResult.rows.length === 0) {
                return res.status(404).json({ error: "Créneau non trouvé" });
            }
            
            // Vérifier et mettre à jour la disponibilité
            await TableAvailabilityService.updateOpeningSlotAvailability(id);
            
            // Récupérer le créneau mis à jour
            const updatedSlotResult = await OpeningSlot.findById(id);
            
            res.status(200).json({ 
                message: 'Disponibilité du créneau mise à jour', 
                openingSlot: updatedSlotResult.rows[0]
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}

module.exports = new OpeningSlotController();
