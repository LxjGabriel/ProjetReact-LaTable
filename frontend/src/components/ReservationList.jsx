import React, { useState } from 'react';
import ReservationCard from './ReservationCard';
import './../styles/ReservationList.css';

export default function ReservationList({ reservations, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!reservations || reservations.length === 0) {
    return (
      <div className="reservation-list">
        <p className="no-reservations">Aucune réservation trouvée</p>
      </div>
    );
  }

  // Calcul pagination
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = reservations.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="reservation-list">
      {/* Liste des réservations */}
      <div className="reservation-list-container">
        {currentReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}

      {/* Info pagination */}
      <div className="pagination-info">
        Page {currentPage} sur {totalPages} | {reservations.length} réservation(s) au total
      </div>
    </div>
  );
}