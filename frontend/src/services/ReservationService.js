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

    getAllReservations: async() => {
        const token = localStorageHelper.getData('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        return await axiosInstance.get(API_URL, config);
    },

    confirmReservation: async(reservationId) => {
        const token = localStorageHelper.getData('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        return await axiosInstance.put(API_URL + `/${reservationId}/confirm`, {}, config);
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