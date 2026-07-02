import { useState, useEffect } from 'react';
import ButtonComponent from '../../components/form/ButtonComponent';
import InputComponent from '../../components/form/InputComponent';
import { ReservationService } from '../../services/ReservationService';
import OpeningSlotsService from '../../services/OpeningSlotsService';
import ToastService from "../../services/ToastService";
import localStorageHelper from '../../services/localStorageHelper';
import { useNavigate } from "react-router-dom";

export default function NewReservation() {
    const navigate = useNavigate();
    const [slots_available, setSlotsAvailable] = useState([]);
    const [formData, setFormData] = useState({
        number_of_people: '',
        opening_slot_id: ''
    });

    useEffect(() => {
        const getSlots = async () => {
            const slots = await OpeningSlotsService.GetOpeningSlots();
            slots.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
            setSlotsAvailable(slots);
        };
        getSlots();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const reloadSlots = async () => {
        const slots = await OpeningSlotsService.GetOpeningSlots();
        setSlotsAvailable(slots);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = localStorageHelper.getData('user');
        if (!user || !user.id) {
            alert('Erreur : Utilisateur non connecté');
            return;
        }
        try {
            await ReservationService.MakeReservation(
                user.id,
                parseInt(formData.number_of_people),
                parseInt(formData.opening_slot_id)
            );
            ToastService.success("Réservation effectuée avec succès !");
            navigate("/my-reservations");
            setFormData({ number_of_people: '', opening_slot_id: '' });
            await reloadSlots();
        } catch (error) {
            const msg = error.response?.data?.error || error.message || "Une erreur s'est produite";
            ToastService.danger(msg || "Pas assez de places disponibles pour ce créneau");
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Nouvelle réservation</h1>
                    <p className="page-subtitle">Choisissez un créneau et indiquez le nombre de convives</p>
                </div>
            </div>

            <div className="form-page">
                <div className="form-section">
                    <form onSubmit={handleSubmit}>
                        <InputComponent
                            label="Nombre de personnes"
                            id="number_of_people"
                            type="number"
                            required
                            value={formData.number_of_people}
                            onChange={handleChange}
                        />

                        <div className="mb-3">
                            <span className="slot-section-label">Créneaux disponibles</span>
                            {slots_available.length === 0 ? (
                                <p className="empty-state">Aucun créneau disponible pour le moment.</p>
                            ) : (
                                <div className="slot-grid">
                                    {slots_available.map((slot) => {
                                        const date = new Date(slot.date_time);
                                        const dateStr = date.toLocaleDateString('fr-FR');
                                        const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                                        const isSelected = formData.opening_slot_id == slot.id;

                                        return (
                                            <label
                                                key={slot.id}
                                                className={`slot-card ${isSelected ? 'slot-card-selected' : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="opening_slot_id"
                                                    value={slot.id}
                                                    checked={isSelected}
                                                    onChange={(e) => setFormData({ ...formData, opening_slot_id: e.target.value })}
                                                    className="slot-radio"
                                                />
                                                <div className="slot-info">
                                                    <span className="slot-date">{dateStr}</span>
                                                    <span className="slot-time">{timeStr}</span>
                                                    <span className="slot-duration">{slot.duration} min</span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <ButtonComponent label="Confirmer la réservation" onClick={handleSubmit} />
                    </form>
                </div>
            </div>
        </div>
    );
}
