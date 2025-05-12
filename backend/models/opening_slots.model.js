const db = require('../db');

module.exports = class OpeningSlot {
  constructor(id, date_time, duration, available, comment) {
    this.id = id;
    this.date_time = date_time;
    this.duration = duration;
    this.available = available;
    this.comment = comment;
  }

  // Créer un nouveau créneau d'ouverture
  static create(newOpeningSlot) {
    return db.query(
      'INSERT INTO opening_slots (date_time, duration, available, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [newOpeningSlot.date_time, newOpeningSlot.duration, newOpeningSlot.available, newOpeningSlot.comment]
    );
  }

  // Récupérer tous les créneaux d'ouverture
  static getAll() {
    return db.query('SELECT * FROM opening_slots');
  }

  // Récupérer tous les créneaux d'ouverture disponibles
  static getAllAvailable() {
    return db.query('SELECT * FROM opening_slots WHERE available = true');
  }

  // Récupérer un créneau d'ouverture par ID
  static findById(id) {
    return db.query('SELECT * FROM opening_slots WHERE id = $1', [id]);
  }

  // Mettre à jour un créneau d'ouverture
  static update(id, openingSlot) {
    return db.query(
      'UPDATE opening_slots SET date_time = $1, duration = $2, available = $3, comment = $4 WHERE id = $5 RETURNING *',
      [openingSlot.date_time, openingSlot.duration, openingSlot.available, openingSlot.comment, id]
    );
  }

  // Supprimer un créneau d'ouverture
  static delete(id) {
    return db.query('DELETE FROM opening_slots WHERE id = $1', [id]);
  }
}
