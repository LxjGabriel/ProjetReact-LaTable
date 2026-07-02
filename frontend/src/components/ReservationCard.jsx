import './../styles/ReservationCard.css';

const STATUS_TEXT = { 0: 'En attente', 1: 'Confirmée', 2: 'Annulée' };
const STATUS_CLASS = { 0: 'pending', 1: 'confirmed', 2: 'cancelled' };

export default function ReservationCard({ reservation, onDelete }) {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('fr-FR');

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.includes('T')
      ? new Date(timeString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : timeString.slice(0, 5);
  };

  return (
    <div className="res-card">
      <div className="res-card-header">
        <span className="res-card-id">Réservation #{reservation.id}</span>
        <span className={`badge badge-${STATUS_CLASS[reservation.status] || 'pending'}`}>
          {STATUS_TEXT[reservation.status] || 'Inconnu'}
        </span>
      </div>

      <div className="res-card-body">
        <div className="res-card-row">
          <span className="res-card-label">Date</span>
          <span className="res-card-value">{formatDate(reservation.date)}</span>
        </div>
        <div className="res-card-row">
          <span className="res-card-label">Heure</span>
          <span className="res-card-value">{formatTime(reservation.time)}</span>
        </div>
        <div className="res-card-row">
          <span className="res-card-label">Personnes</span>
          <span className="res-card-value">{reservation.number_of_people}</span>
        </div>
      </div>

      {reservation.status !== 2 && onDelete && (
        <div className="res-card-footer">
          <button
            className="btn btn-danger"
            onClick={() => onDelete(reservation.id)}
          >
            Annuler la réservation
          </button>
        </div>
      )}
    </div>
  );
}
