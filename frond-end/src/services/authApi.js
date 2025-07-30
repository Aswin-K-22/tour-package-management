// File: src/api/tourApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/tour',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Login API call
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return { user: response.data.data.user };
};

// Signup API call
export const signup = async (email, password) => {
  await apiClient.post('/auth/signup', { email, password });
};

// Add Country API call
export const addCountry = async (name, cities) => {
  const response = await apiClient.post('/countries', { name, cities });
  return response.data.data.country;
};

// Get Countries API call
export const getCountries = async () => {
  const response = await apiClient.get('/countries');
  return response.data.data.countries;
};

export const  getAdminData= async()=>{
    // const response = await apiClient.get('/auth/admin');
  return null;
}