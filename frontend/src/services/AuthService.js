import Logout from "../views/auth/Logout";
import { axiosInstance } from "./AxiosInstance";
import localStorageHelper from "./localStorageHelper";

const API_URL = '/user';

const AuthService = {
  Login: async (email, password) => {
    const response = await axiosInstance.post(`/login`, {
      email: email,
      password: password,
    });
    if (response.status !== 200) {
      throw new Error('Login failed');
    }
    localStorageHelper.storeData('token', response.data.token);
    localStorageHelper.storeData('user', response.data.user);
  },

  Signup: async (email, password, fname, lname, phone, role) => {
    const response = await axiosInstance.post(`/signup`, {
      email: email,
      password: password,
      fname: fname,
      lname: lname,
      phone: phone,
      role: role,
    });
    if(response.status == 409){
      throw new Error('Email already exists');
    } else if(response.status !== 201) {
      throw new Error('Signup failed');
    }
  },

  IsConnected: () => {
    const token = localStorageHelper.getData('token');
    return token !== null && token !== undefined;
  },

  IsAdmin: () => {
    const user = localStorageHelper.getData('user');
    return user && user.role === 1; 
  },

  Logout: () => {
    localStorageHelper.removeData('token');
  },

  GetUser: () => {
    const user = localStorageHelper.getData('user');
    return user ? user : null;
  },

  GetUserById: async (userId) => {
    const token = localStorageHelper.getData('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.get(`${API_URL}/${userId}`, config);
    if (response.status !== 200) {
      throw new Error('Failed to fetch user');
    }
    return response.data;
  },
};

export { AuthService };