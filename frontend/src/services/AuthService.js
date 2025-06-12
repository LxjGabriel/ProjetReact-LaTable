import Logout from "../views/auth/Logout";
import ChangePassword from "../views/profile/ChangePassword";
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

  Logout: () => {
    localStorageHelper.removeData('token');
  },

  GetUser: () => {
    const user = localStorageHelper.getData('user');
    return user ? user : null;
  },

  GetMe: async () => {
    const response = await axiosInstance.get(`/me`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch user data');
    }
    return response.data;
  },

  ChangePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    const response = await axiosInstance.post(`/change-password`, {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    });
  },

  UpdateProfile: async (email, fname, lname, phone) => {
    const response = await axiosInstance.put(`/update-profile`, {
      email: email,
      fname: fname,
      lname: lname,
      phone: phone,
    });
  },
};

export { AuthService };