import { useState, useEffect } from 'react';
import { ReservationService } from '../../services/ReservationService';
import ReservationList from '../../components/ReservationList';
import ReservationButton from '../../components/ReservationButton';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await ReservationService.getMyReservations();
        setReservations(response.data || []);
      } catch (err) {
        setError('Impossible de charger vos réservations.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('Annuler cette réservation ?')) return;
    try {
      await ReservationService.deleteReservation(reservationId);
      setReservations(prev => prev.filter(r => r.id !== reservationId));
      alert('Réservation annulée avec succès');
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="container"><p className="loading-state">Chargement...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mes réservations</h1>
          <p className="page-subtitle">{reservations.length} réservation(s) enregistrée(s)</p>
        </div>
      </div>

      <ReservationList
        reservations={reservations}
        onDelete={handleDeleteReservation}
      />

      <div className="my-res-new-section">
        <h2 className="my-res-new-title">Faire une nouvelle réservation</h2>
        <ReservationButton />
      </div>
    </div>
  );
}
