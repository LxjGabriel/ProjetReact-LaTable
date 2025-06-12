import React, { useEffect, useState } from 'react';
import { ReservationService } from '../../services/ReservationService';
import { AuthService } from '../../services/AuthService';
import ButtonComponent from '../../components/form/ButtonComponent';
import './../../styles/Reservations.css';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState({});
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await ReservationService.getAllReservations();
                const reservationsData = response.data || [];
                setReservations(reservationsData);

                // Récupérer les informations des utilisateurs
                const userIds = [...new Set(reservationsData.map(r => r.user_id))];
                const usersData = {};
                
                for (const userId of userIds) {
                    try {
                        const userResponse = await AuthService.GetUserById(userId);
                        usersData[userId] = userResponse;
                    } catch (err) {
                        console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, err);
                        usersData[userId] = { fname: 'Inconnu', lname: '' };
                    }
                }
                
                setUsers(usersData);
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

    const handleConfirmReservation = async (reservationId) => {
        try {
            await ReservationService.confirmReservation(reservationId);
            setReservations(prev =>
                prev.map(reservation =>
                    reservation.id === reservationId ? { ...reservation, status: 1 } : reservation
                )
            );
            alert('Réservation confirmée avec succès');
        } catch (err) {
            alert('Erreur lors de la confirmation de la réservation');
        }
    };

    const getFilteredReservations = () => {
        return reservations.filter(reservation => {
            const reservationDate = new Date(reservation.date).toISOString().split('T')[0];
            
            const matchDateFrom = !dateFrom || reservationDate >= dateFrom;
            const matchDateTo = !dateTo || reservationDate <= dateTo;
            const matchStatus = statusFilter === 'all' || 
                reservation.status === parseInt(statusFilter);
            
            return matchDateFrom && matchDateTo && matchStatus;
        });
    };

    const filteredReservations = getFilteredReservations();

    const getStatusText = (status) => {
        const statuses = { 0: 'En attente', 1: 'Confirmée', 2: 'Annulée' };
        return statuses[status] || 'Inconnu';
    };

    const getStatusColor = (status) => {
        const colors = { 0: '#ffa500', 1: '#28a745', 2: '#dc3545' };
        return colors[status] || '#6c757d';
    };

    return (
        <div className='container'>
            <h1>Liste des Réservations</h1>

<div style={{marginBottom: '20px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
    <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'end', marginBottom: '15px'}}>
        <div style={{minWidth: '150px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px', color: '#495057'}}>Date de début :</label>
            <input 
                type="date" 
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{width: '100%', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px'}}
            />
        </div>
        <div style={{minWidth: '150px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px', color: '#495057'}}>Date de fin :</label>
            <input 
                type="date" 
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{width: '100%', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px'}}
            />
        </div>
        <div style={{minWidth: '150px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px', color: '#495057'}}>Statut :</label>
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{width: '100%', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', backgroundColor: 'white'}}
            >
                <option value="all">Tous les statuts</option>
                <option value="0">En attente</option>
                <option value="1">Confirmée</option>
                <option value="2">Annulée</option>
            </select>
        </div>
        <div>
            <button 
                onClick={() => {setDateFrom(''); setDateTo(''); setStatusFilter('all');}}
                style={{padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer'}}
            >
                Réinitialiser
            </button>
        </div>
    </div>
    <div style={{fontSize: '14px', color: '#6c757d', textAlign: 'right', borderTop: '1px solid #eee', paddingTop: '10px'}}>
        <strong>{filteredReservations.length}</strong> sur <strong>{reservations.length}</strong> réservations affichées
    </div>
</div>

            {loading ? (
                <p>Chargement des réservations...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : filteredReservations.length === 0 ? (
                <p>Aucune réservation trouvée.</p>
            ) : (
                <div className="table-container">
                    <table className="reservations-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Nb de personnes</th>
                                <th>Client</th>
                                <th>Téléphone</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.id}</td>
                                    <td>{new Date(reservation.date).toLocaleDateString('fr-FR')}</td>
                                    <td>{new Date(reservation.date).toLocaleTimeString('fr-FR', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}</td>
                                    <td className="text-center">{reservation.number_of_people}</td>
                                    <td>
                                        {users[reservation.user_id] 
                                            ? `${users[reservation.user_id].fname} ${users[reservation.user_id].lname}`
                                            : 'Chargement...'
                                        }
                                    </td>
                                    <td>
                                        {users[reservation.user_id] 
                                            ? <a href={`tel:0${users[reservation.user_id].phone}`} style={{color: '#007bff', textDecoration: 'underline'}}>
                                                0{users[reservation.user_id].phone}
                                              </a>
                                            : 'Chargement...'
                                        }
                                    </td>
                                    <td style={{color: getStatusColor(reservation.status)}}>{getStatusText(reservation.status)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {reservation.status === 0 ? ( 
                                                <ButtonComponent
                                                    className="btn btn-success"
                                                    onClick={() => handleConfirmReservation(reservation.id)}
                                                    label="Confirmer"
                                                />
                                            ) : null }
                                            <ButtonComponent
                                                className="btn btn-danger"
                                                onClick={async () => {await handleDeleteReservation(reservation.id);}}
                                                label={reservation.status === 0 ? "Refuser" : "Annuler"}
                                                severity="danger"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}