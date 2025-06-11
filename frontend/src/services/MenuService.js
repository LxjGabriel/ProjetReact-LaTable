import { axiosInstance } from "./AxiosInstance";

const API_URL = '/menu';

const MenuService = {
    async GetAllMenu() {
        const response = await axiosInstance.get(`${API_URL}`);        
        if (response.status !== 200) {
            throw new Error('Failed to fetch menus');
        }
        return response.data;
    },

    async GetMenuById(id) {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch menu');
        }
        return response.data;
    },

    async GetAllMenuByCategory(category) {
        const response = await axiosInstance.get(`${API_URL}/category/${category}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch menus by category');
        }
        return response.data;
    },

    async CreateMenu(menuData) {
        const response = await axiosInstance.post(`${API_URL}`, menuData);
        if (response.status !== 201) {
            throw new Error('Failed to create menu');
        }
        return response.data;
    },
    
    async UpdateMenu(id, menuData) {
        const response = await axiosInstance.put(`${API_URL}/${id}`, menuData);
        if (response.status !== 200) {
            throw new Error('Failed to update menu');
        }
        return response.data;
    },

    async DeleteMenu(id) {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete menu');
        }
        return response.data;
    }
}

export { MenuService };