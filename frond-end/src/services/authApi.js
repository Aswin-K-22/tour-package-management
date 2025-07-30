// File: src/api/authApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Login API call
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
  }
};

// Signup API call
export const signup = async (name, email, password) => {
  try {
    const response = await apiClient.post('/create', { name, email, password });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed. Please try again.');
  }
};

// Logout API call
export const logout = async () => {
  try {
    const response = await apiClient.post('/logout');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed. Please try again.');
  }
};

// Get Auth API call
export const getAuth = async () => {
  try {
    const response = await apiClient.get('/get');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch auth data. Please try again.');
  }
};


