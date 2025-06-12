import { useState, useEffect } from 'react';
import ButtonComponent from '../../components/form/ButtonComponent';
import InputComponent from '../../components/form/InputComponent';
import {ReservationService} from '../../services/ReservationService';
import { AuthService } from '../../services/AuthService';
import localStorageHelper from '../../services/localStorageHelper';
import OpeningSlotsService from '../../services/OpeningSlotsService';
import ToastContainer, { showToast } from '../../components/ToastContainer';

export default function NewReservation() {
    
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
            showToast('Réservation créée avec succès!', "success", 3000);
            setFormData({
                number_of_people: '',
                opening_slot_id: ''
            });
            await reloadSlots();
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Une erreur s'est produite";
            showToast(errorMessage, "danger", 3000);
        }
    }
    
    return (
        <div className="container">
            <ToastContainer />
            <h1>Faire une nouvelle réservation</h1>
            <form onSubmit={handleSubmit}>
                
                <InputComponent label="Nombre de personnes" id="number_of_people" required value={formData.number_of_people} onChange={handleChange} />
                
                {/* Affichage simple des créneaux disponibles */}
                <div>
                    <label>Créneaux disponibles :</label>
                    {slots_available.map((slot) => (
                        <div key={slot.id}>
                            <input 
                                type="radio" 
                                id={`slot_${slot.id}`}
                                name="opening_slot_id"
                                value={slot.id}
                                onChange={(e) => setFormData({...formData, opening_slot_id: e.target.value})}
                            />
                            <label htmlFor={`slot_${slot.id}`}>
                                {new Date(slot.date_time).toLocaleString()} - {slot.duration} min
                            </label>
                        </div>
                    ))}
                </div>
                
                <ButtonComponent label="Soumettre réservation" type="submit" />
            </form>
        </div>
    )
}