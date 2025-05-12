const db = require('../db');

/**
 * Pour gérer la disponibilité des tables pour les réservations
 */
class TableAvailabilityService {
  static async checkAvailability(openingSlotId, numberOfPeople) {
    try {
      // 1. Vérifier si le créneau est disponible
      const slotResult = await db.query(
        'SELECT * FROM opening_slots WHERE id = $1 AND available = true',
        [openingSlotId]
      );
      
      if (slotResult.rows.length === 0) {
        return { available: false, message: "Le créneau sélectionné n'est pas disponible" };
      }

      // Récupérer toutes les tables
      const allTablesResult = await db.query('SELECT * FROM tables ORDER BY seats');
      
      // Récupérer les tables déjà réservées pour ce créneau
      const reservedTablesResult = await db.query(
        `SELECT t.id, t.seats FROM tables t
         JOIN reservation_tables rt ON t.id = rt.table_id
         JOIN reservations r ON rt.reservation_id = r.id
         WHERE r.opening_slot_id = $1`,
        [openingSlotId]
      );

      // Identifier les tables disponibles
      const reservedTableIds = reservedTablesResult.rows.map(table => table.id);
      const availableTables = allTablesResult.rows.filter(table => !reservedTableIds.includes(table.id));
      
      // Calculer le nombre total de places disponibles
      const totalAvailableSeats = availableTables.reduce((sum, table) => sum + table.seats, 0);

      // Vérifier si le nombre de places disponibles est suffisant
      if (totalAvailableSeats < numberOfPeople) {
        return { 
          available: false, 
          message: `Pas assez de places disponibles pour ce créneau (${totalAvailableSeats} places disponibles pour ${numberOfPeople} personnes demandées)`
        };
      }

      // Déterminer les tables optimales pour cette réservation
      const selectedTables = this.selectOptimalTables(availableTables, numberOfPeople);

      return { 
        available: true, 
        availableTables: availableTables,
        selectedTables: selectedTables
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      throw error;
    }
  }

  static selectOptimalTables(tables, numberOfPeople) {
    // Trier les tables par nombre de places (croissant)
    const sortedTables = [...tables].sort((a, b) => a.seats - b.seats);
    
    let remainingPeople = numberOfPeople;
    const selectedTables = [];
    
    // Essayer d'abord de trouver une table parfaite ou presque
    const idealTable = sortedTables.find(table => table.seats >= numberOfPeople && table.seats <= numberOfPeople + 2);
    if (idealTable) {
      return [idealTable];
    }

    // Sinon, faire une allocation optimisée en commençant par les grandes tables
    const reversedTables = [...sortedTables].reverse();
    
    for (const table of reversedTables) {
      if (remainingPeople > 0) {
        selectedTables.push(table);
        remainingPeople -= table.seats;
      }
      
      if (remainingPeople <= 0) {
        break;
      }
    }

    return selectedTables;
  }

  /**
   * Vérifie si toutes les tables sont réservées pour un créneau donné et met à jour 
   * le statut du créneau si nécessaire (available = false)
   * @param {number} openingSlotId - ID du créneau d'ouverture
   * @param {Object} existingClient - Client de connexion existant (optionnel)
   * @returns {Promise<void>}
   */
  static async updateOpeningSlotAvailability(openingSlotId, existingClient = null) {
    const useExistingClient = existingClient !== null;
    const client = useExistingClient ? existingClient : await db.connect();
    
    try {
      // Ne démarrer une transaction que si on n'utilise pas un client existant
      if (!useExistingClient) {
        await client.query('BEGIN');
      }
      
      // 1. Récupérer toutes les tables
      const allTablesResult = await client.query('SELECT COUNT(*) as total FROM tables');
      const totalTables = parseInt(allTablesResult.rows[0].total);
      
      // 2. Récupérer le nombre de tables déjà réservées pour ce créneau
      const reservedTablesResult = await client.query(
        `SELECT COUNT(DISTINCT t.id) as reserved FROM tables t
         JOIN reservation_tables rt ON t.id = rt.table_id
         JOIN reservations r ON rt.reservation_id = r.id
         WHERE r.opening_slot_id = $1`,
        [openingSlotId]
      );
      const reservedTables = parseInt(reservedTablesResult.rows[0].reserved);
      
      // 3. Si toutes les tables sont réservées
      if (reservedTables >= totalTables) {
        await client.query(
          'UPDATE opening_slots SET available = false WHERE id = $1',
          [openingSlotId]
        );
        console.log(`Le créneau ${openingSlotId} est maintenant complet (available = false).`);
      }
      
      // Ne commit que si on n'utilise pas un client existant
      if (!useExistingClient) {
        await client.query('COMMIT');
      }
    } catch (error) {
      // Ne rollback que si on n'utilise pas un client existant
      if (!useExistingClient) {
        await client.query('ROLLBACK');
      }
      console.error('Erreur lors de la mise à jour de la disponibilité du créneau:', error);
      throw error;
    } finally {
      // Ne libère le client que si on l'a créé ici
      if (!useExistingClient) {
        client.release();
      }
    }
  }

  static async assignTablesToReservation(reservationId, tableIds, openingSlotId, existingClient = null) {
    const useExistingClient = existingClient !== null;
    const client = useExistingClient ? existingClient : await db.connect();
    
    try {
      // Ne démarrer une transaction que si on n'utilise pas un client existant
      if (!useExistingClient) {
        await client.query('BEGIN');
      }
      
      // Insérer chaque association table-réservation
      for (const tableId of tableIds) {
        await client.query(
          'INSERT INTO reservation_tables (reservation_id, table_id) VALUES ($1, $2)',
          [reservationId, tableId]
        );
      }
      
      // Mettre à jour la disponibilité du créneau après l'association des tables
      if (openingSlotId) {
        // Récupérer l'ID du créneau d'ouverture si non fourni
        if (!openingSlotId) {
          const reservationResult = await client.query(
            'SELECT opening_slot_id FROM reservations WHERE id = $1',
            [reservationId]
          );
          if (reservationResult.rows.length > 0) {
            openingSlotId = reservationResult.rows[0].opening_slot_id;
          }
        }
        
        // Vérifier si toutes les tables sont réservées directement ici
        // 1. Récupérer toutes les tables
        const allTablesResult = await client.query('SELECT COUNT(*) as total FROM tables');
        const totalTables = parseInt(allTablesResult.rows[0].total);
        
        // 2. Récupérer le nombre de tables déjà réservées pour ce créneau
        const reservedTablesResult = await client.query(
          `SELECT COUNT(DISTINCT t.id) as reserved FROM tables t
           JOIN reservation_tables rt ON t.id = rt.table_id
           JOIN reservations r ON rt.reservation_id = r.id
           WHERE r.opening_slot_id = $1`,
          [openingSlotId]
        );
        const reservedTables = parseInt(reservedTablesResult.rows[0].reserved);
        
        // 3. Si toutes les tables sont réservées, mettre à jour le créneau
        if (reservedTables >= totalTables) {
          await client.query(
            'UPDATE opening_slots SET available = false WHERE id = $1',
            [openingSlotId]
          );
          console.log(`Le créneau ${openingSlotId} est maintenant complet (available = false).`);
        }
      }
      
      // Ne commit que si on n'utilise pas un client existant
      if (!useExistingClient) {
        await client.query('COMMIT');
      }
      return true;
    } catch (error) {
      // Ne rollback que si on n'utilise pas un client existant
      if (!useExistingClient) {
        await client.query('ROLLBACK');
      }
      console.error('Erreur lors de l\'association des tables:', error);
      throw error;
    } finally {
      // Ne libère le client que si on l'a créé ici
      if (!useExistingClient) {
        client.release();
      }
    }
  }
}

module.exports = TableAvailabilityService;
