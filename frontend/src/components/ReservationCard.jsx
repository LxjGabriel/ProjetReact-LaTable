import React from 'react';
import './../styles/ReservationCard.css';

export default function ReservationCard({ reservation, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.includes('T') 
      ? new Date(timeString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : timeString.slice(0, 5);
  };

  const getStatusText = (status) => {
    const statuses = { 0: 'En attente', 1: 'Confirmée', 2: 'Annulée' };
    return statuses[status] || 'Inconnu';
  };

  const getStatusColor = (status) => {
    const colors = { 0: '#ffa500', 1: '#28a745', 2: '#dc3545' };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="reservation-card">
      <div className="reservation-card-header">
        <h3 className="reservation-card-title">
          Réservation #{reservation.id}
        </h3>
        <span 
          className="reservation-card-status"
          style={{ backgroundColor: getStatusColor(reservation.status) }}
        >
          {getStatusText(reservation.status)}
        </span>
      </div>
      
      <div className="reservation-card-body">
        <p><strong>Date:</strong> {formatDate(reservation.date)}</p>
        <p><strong>Heure:</strong> {formatTime(reservation.time)}</p>
        <p><strong>Personnes:</strong> {reservation.number_of_people}</p>
      </div>
      
      {reservation.status !== 2 && onDelete && (
        <button 
          className="cancel-button"
          onClick={() => onDelete(reservation.id)}
        >
          Annuler
        </button>
      )}
    </div>
  );
}