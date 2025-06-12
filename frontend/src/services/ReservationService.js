import { axiosInstance } from "./AxiosInstance";
import localStorageHelper from "./localStorageHelper";

const API_URL = '/reservation';

export const ReservationService = {
    getMyReservations: async() => {
        const token = localStorageHelper.getData('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        return await axiosInstance.get(API_URL + '/my', config);
    },

    MakeReservation: async (user_id, number_of_people, opening_slot_id) => {
    const response = await axiosInstance.post(`${API_URL}`, {
      user_id: user_id,
      number_of_people: number_of_people,
      opening_slot_id: opening_slot_id,
    });
    if(response.status == 404){
      throw new Error('Error in submitting');
    }
  },

    // Méthode pour annuler une réservation
    deleteReservation: async(reservationId) => {
        const token = localStorageHelper.getData('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        return await axiosInstance.delete(`${API_URL}/${reservationId}`, config);
    },

    // Nouvelle méthode pour mettre à jour une réservation
    updateReservation: async(reservationId, reservationData) => {
        const token = localStorageHelper.getData('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        return await axiosInstance.put(API_URL + `/${reservationId}`, reservationData, config);
    },
}