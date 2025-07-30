// File: src/service/cityApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/city',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});


export const addCity = async (name, countryId) => {
  const response = await apiClient.post('/create', { name, countryId });
  return response.data.data;
};

export const getCities = async (page, limit) => {
  const response = await apiClient.get('/cities', {
    params: { page, limit }
  });
  return response.data.data; // { cities: [], totalPages: number, totalCount: number }
};

export const editCity = async (id, name, countryId) => {
  const response = await apiClient.put(`/${id}`, { name, countryId });
  return response.data.data;
};

export const deleteCity = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data.data;
};

export const getCitiesByCountryId = async (countryId) => {
  const response = await apiClient.get(`/by-country/${countryId}`);
  return response.data.data; // Returns array of cities
};