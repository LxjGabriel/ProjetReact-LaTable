import Logout from "../views/auth/Logout";
import { axiosInstance } from "./AxiosInstance";
import localStorageHelper from "./localStorageHelper";

const API_URL = '/opening_slot';

const OpeningSlotsService = {
    async GetOpeningSlots() {
        const response = await axiosInstance.get(`${API_URL}/available`); 
        if (response.status !== 200) {
            throw new Error('Failed to fetch menus');
        }
        return response.data;
    }
}

export default OpeningSlotsService;