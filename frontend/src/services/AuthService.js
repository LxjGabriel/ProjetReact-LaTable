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
    return response.data;
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
};

export { AuthService };