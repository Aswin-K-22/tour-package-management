// File: src/api/tourApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/country', // Fixed typo: removed extra slash
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Add Country API call
export const addCountry = async (name) => {
  const response = await apiClient.post('/create', { name });
  return response.data.data;
};

// Get Countries API call
export const getCountries = async () => {
  const response = await apiClient.get('/countries');
  return response.data.data;
};

// Edit Country API call
export const editCountry = async (id, name) => {
  const response = await apiClient.put(`/${id}`, { name });
  return response.data.data;
};

// Delete Country API call
export const deleteCountry = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data.data;
};