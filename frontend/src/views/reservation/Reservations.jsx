import { useEffect, useState } from 'react';
import { ReservationService } from '../../services/ReservationService';
import { AuthService } from '../../services/AuthService';
import './../../styles/Reservations.css';

const STATUS_TEXT = { 0: 'En attente', 1: 'Confirmée', 2: 'Annulée' };
const STATUS_CLASS = { 0: 'pending', 1: 'confirmed', 2: 'cancelled' };

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

                const userIds = [...new Set(reservationsData.map(r => r.user_id))];
                const usersData = {};
                for (const userId of userIds) {
                    try {
                        usersData[userId] = await AuthService.GetUserById(userId);
                    } catch {
                        usersData[userId] = { fname: 'Inconnu', lname: '' };
                    }
                }
                setUsers(usersData);
            } catch {
                setError('Erreur lors du chargement des réservations');
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
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    const handleConfirmReservation = async (reservationId) => {
        try {
            await ReservationService.confirmReservation(reservationId);
            setReservations(prev =>
                prev.map(r => r.id === reservationId ? { ...r, status: 1 } : r)
            );
            alert('Réservation confirmée avec succès');
        } catch {
            alert('Erreur lors de la confirmation');
        }
    };

    const filteredReservations = reservations.filter(r => {
        const date = new Date(r.date).toISOString().split('T')[0];
        return (
            (!dateFrom || date >= dateFrom) &&
            (!dateTo || date <= dateTo) &&
            (statusFilter === 'all' || r.status === parseInt(statusFilter))
        );
    });

    return (
        <div className="container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Gestion des réservations</h1>
                    <p className="page-subtitle">Vue d'ensemble de toutes les réservations</p>
                </div>
            </div>

            <div className="filters-bar">
                <div className="filters-row">
                    <div className="filter-group">
                        <label className="filter-label">Date de début</label>
                        <input
                            type="date"
                            className="filter-input"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Date de fin</label>
                        <input
                            type="date"
                            className="filter-input"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Statut</label>
                        <select
                            className="filter-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="0">En attente</option>
                            <option value="1">Confirmée</option>
                            <option value="2">Annulée</option>
                        </select>
                    </div>
                    <button
                        className="filter-reset"
                        onClick={() => { setDateFrom(''); setDateTo(''); setStatusFilter('all'); }}
                    >
                        Réinitialiser
                    </button>
                </div>
                <div className="filters-count">
                    <strong>{filteredReservations.length}</strong> sur <strong>{reservations.length}</strong> réservation(s) affichée(s)
                </div>
            </div>

            {loading ? (
                <p className="loading-state">Chargement des réservations...</p>
            ) : error ? (
                <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</p>
            ) : (
                <div className="table-wrapper">
                    <table className="res-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Personnes</th>
                                <th>Client</th>
                                <th>Téléphone</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="table-empty">
                                        Aucune réservation trouvée
                                    </td>
                                </tr>
                            ) : filteredReservations.map((r) => (
                                <tr key={r.id}>
                                    <td>#{r.id}</td>
                                    <td>{new Date(r.date).toLocaleDateString('fr-FR')}</td>
                                    <td>{new Date(r.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{r.number_of_people}</td>
                                    <td>
                                        {users[r.user_id]
                                            ? `${users[r.user_id].fname} ${users[r.user_id].lname}`
                                            : 'Chargement...'}
                                    </td>
                                    <td>
                                        {users[r.user_id] ? (
                                            <a href={`tel:0${users[r.user_id].phone}`} className="table-link">
                                                0{users[r.user_id].phone}
                                            </a>
                                        ) : 'Chargement...'}
                                    </td>
                                    <td>
                                        <span className={`badge badge-${STATUS_CLASS[r.status] || 'pending'}`}>
                                            {STATUS_TEXT[r.status] || 'Inconnu'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {r.status === 0 && (
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleConfirmReservation(r.id)}
                                                >
                                                    Confirmer
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteReservation(r.id)}
                                            >
                                                {r.status === 0 ? 'Refuser' : 'Annuler'}
                                            </button>
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
