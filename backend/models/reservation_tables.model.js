const pool = require('../db');

module.exports = class ReservationTable {
  constructor(reservation_id, table_id) {
    this.reservation_id = reservation_id;
    this.table_id = table_id;
  }

  // Créer une nouvelle réservation de table
  static create(newReservationTable) {
    return pool.query(
      'INSERT INTO reservation_tables (reservation_id, table_id) VALUES ($1, $2)',
      [newReservationTable.reservation_id, newReservationTable.table_id]
    );
  }

  static delete(reservation_id, table_id) {
    return pool.query(
      'DELETE FROM reservation_tables WHERE reservation_id = $1 AND table_id = $2',
      [reservation_id, table_id]
    );
  }
  
  // Récupérer toutes les réservations de table
  static getAll() {
    return pool.query('SELECT * FROM reservation_tables');
  }

  // Récupérer une réservation de table par ID de table
  static findByTableId(table_id) {
    return pool.query('SELECT * FROM reservation_tables WHERE table_id = $1', [table_id]);
  }
  static findByReservationId(reservation_id) {
    return pool.query('SELECT * FROM reservation_tables WHERE reservation_id = $1', [reservation_id]);
  }
}
