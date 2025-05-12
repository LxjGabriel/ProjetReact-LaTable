const db = require('../db');

module.exports = class Reservation {
  constructor(id, user_id, number_of_people, date, time, status) {
    this.id = id;
    this.user_id = user_id;
    this.number_of_people = number_of_people;
    this.date = date;
    this.time = time;
    this.status = status;
  }

  // Créer une nouvelle réservation
  static create(newReservation) {
    return db.query(
      'INSERT INTO reservations (user_id, number_of_people, date, time, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newReservation.user_id, newReservation.number_of_people, newReservation.date, newReservation.time, newReservation.status]
    );
  }

  // Récupérer toutes les réservations
  static getAll() {
    return db.query('SELECT * FROM reservations');
  }

  // Récupérer une réservation par ID
  static findById(id) {
    return db.query('SELECT * FROM reservations WHERE id = $1', [id]);
  }

  // Récupérer les réservations d'un utilisateur
  static findByUserId(userId) {
    return db.query('SELECT * FROM reservations WHERE user_id = $1', [userId]);
  }

  // Mettre à jour une réservation
  static update(id, reservation) {
    return db.query(
      'UPDATE reservations SET user_id = $1, number_of_people = $2, date = $3, time = $4, status = $5 WHERE id = $6',
      [reservation.user_id, reservation.number_of_people, reservation.date, reservation.time, reservation.status, id]
    );
  }

  // Supprimer une réservation
  static delete(id) {
    return db.query('DELETE FROM reservations WHERE id = $1', [id]);
  }
}