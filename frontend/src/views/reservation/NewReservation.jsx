import { useState, useEffect } from 'react';
import ButtonComponent from '../../components/form/ButtonComponent';
import InputComponent from '../../components/form/InputComponent';
import {ReservationService} from '../../services/ReservationService';
import { AuthService } from '../../services/AuthService';
import localStorageHelper from '../../services/localStorageHelper';
import OpeningSlotsService from '../../services/OpeningSlotsService';
import ToastService from "../../services/ToastService";
import { useNavigate } from "react-router-dom";

export default function NewReservation() {
    const navigate = useNavigate()
    const [slots_available, setSlotsAvailable] = useState([]);
    const [formData, setFormData] = useState({
            number_of_people: '',
            opening_slot_id: ''
        });
    
    // Récupérer les créneaux disponibles
    useEffect(() => {
        const getSlots = async () => {
            const slots = await OpeningSlotsService.GetOpeningSlots();
            console.log(slots);

            slots.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
            setSlotsAvailable(slots);
        };
        getSlots();
    }, []);
   
    const user_id = localStorageHelper.getData('user')
    console.log('user', user_id);
   
        
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const reloadSlots = async () => {
        const slots = await OpeningSlotsService.GetOpeningSlots();
        setSlotsAvailable(slots);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Récupérer user_id au moment de l'envoi
        const user = localStorageHelper.getData('user');
        
        if (!user || !user.id) {
            alert('Erreur : Utilisateur non connecté');
            return;
        }
        
        console.log('user_id à envoyer:', user.id);
        console.log('formData:', formData);
        
        try {
            await ReservationService.MakeReservation(
                user.id,
                parseInt(formData.number_of_people),
                parseInt(formData.opening_slot_id)
            );
            ToastService.success("Reservation réussie !");
            navigate("/my-reservations")
            setFormData({
                number_of_people: '',
                opening_slot_id: ''
            });
            await reloadSlots();
            
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Une erreur s'est produite";
            ToastService.danger(errorMessage ||"Pas assez de places disponibles pour ce créneau")
        }
    }
    
    return (
        <div className="container">
            <h1>Faire une nouvelle réservation</h1>
            <form onSubmit={handleSubmit}>
                
                <InputComponent label="Nombre de personnes" id="number_of_people" required value={formData.number_of_people} onChange={handleChange} />
                
                {/* Affichage simple des créneaux disponibles */}
                <div style={{margin: '20px 0'}}>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>
                        Créneaux disponibles :
                    </label>
                    {slots_available.map((slot) => {
                        const date = new Date(slot.date_time);
                        const dateStr = date.toLocaleDateString('fr-FR');
                        const timeStr = date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
                        
                        return (
                            <div key={slot.id} style={{
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '8px', 
                                margin: '5px 0',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <input 
                                    type="radio" 
                                    id={`slot_${slot.id}`}
                                    name="opening_slot_id"
                                    value={slot.id}
                                    onChange={(e) => setFormData({...formData, opening_slot_id: e.target.value})}
                                    style={{marginRight: '10px'}}
                                />
                                <label htmlFor={`slot_${slot.id}`} style={{cursor: 'pointer', flex: 1}}>
                                    <strong>{dateStr}</strong> à <strong>{timeStr}</strong> ({slot.duration} min)
                                </label>
                            </div>
                        );
                    })}
                </div>
                
                <ButtonComponent label="Soumettre réservation" type="submit" />
            </form>
        </div>
    )
}