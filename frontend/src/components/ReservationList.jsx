import { useState } from 'react';
import ReservationCard from './ReservationCard';
import './../styles/ReservationList.css';

export default function ReservationList({ reservations, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!reservations || reservations.length === 0) {
    return (
      <div className="res-list">
        <p className="res-list-empty">Aucune réservation trouvée</p>
      </div>
    );
  }

  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReservations = reservations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="res-list">
        {currentReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onDelete={onDelete}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}

      <p className="pagination-info">
        Page {currentPage} sur {totalPages} &mdash; {reservations.length} réservation(s)
      </p>
    </div>
  );
}
