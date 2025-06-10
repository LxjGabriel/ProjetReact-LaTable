import { axiosInstance } from '../utils/axiosInstance';
import localStorageHelper from './localStorageHelper';

const API_URL = '/user';

const AuthService = {
  Login: async (email, password) => {
    response = await axiosInstance.post(`/login`, {
      params: {
        email: email,
        password: password,
      },
    });
    if(response.status !== 200) {
      throw new Error('Login failed');
    }
    else {
      localStorageHelper.storeData('token', response.data);
    }
  },

  Signup: async (email, password, fname, lname, phone, role) => {
    response = await axiosInstance.post(`/signup`, {
      params: {
        email: email,
        password: password,
        fname: fname,
        lname: lname,
        phone: phone,
        role: role,
      },
    });
    if(response.status == 409){
      throw new Error('Email already exists');
    } else if(response.status !== 201) {
      throw new Error('Signup failed');
    }
  },
};

export { AuthService };