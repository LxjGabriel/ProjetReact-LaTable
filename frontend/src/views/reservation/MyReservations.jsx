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
        setError('Erreur lors du chargement des réservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await ReservationService.deleteReservation(reservationId);
      setReservations(prev =>
        prev.filter(reservation => reservation.id !== reservationId)
      );
      alert('Réservation annulée avec succès');
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className='container'><p>Chargement...</p></div>;
  if (error) return <div className='container'><p style={{color: 'red'}}>{error}</p></div>;

  return (
    <div className='container'>
      <h1>Mes Réservations</h1>
      <ReservationList 
        reservations={reservations} 
        onDelete={handleDeleteReservation} 
      />
      <h2>Faire une nouvelle réservation</h2>
      <ReservationButton />
    </div>
  );
}