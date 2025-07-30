// File: src/api/tourApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/country',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const addCountry = async (name) => {
  const response = await apiClient.post('/create', { name });
  return response.data.data;
};

export const getCountries = async (page, limit) => {
  const response = await apiClient.get('/countries', {
    params: { page, limit }
  });
  return response.data.data; // { countries: [], totalPages: number, totalCount: number }
};

export const editCountry = async (id, name) => {
  const response = await apiClient.put(`/${id}`, { name });
  return response.data.data;
};

export const deleteCountry = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data.data;
};