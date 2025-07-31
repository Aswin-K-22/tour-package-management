// File: src/services/enquiryApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/enquiry',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Create a new enquiry
export const createEnquiry = async (enquiryData) => {
  try {
    const response = await apiClient.post('/create', enquiryData);
    console.log('Enquiry created successfully:', response.data.data); // Debug log
    return response.data.data;
  } catch (error) {
    console.error('Error creating enquiry:', error.response?.data || error.message); // Debug log
    throw error;
  }
};

// Get enquiries (e.g., for admin or user-specific enquiries)
export const getEnquiries = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/enquiries', {
      params: { page, limit },
    });
    console.log('Enquiries fetched successfully:', response.data.data); // Debug log
    return response.data; // { enquiries: [], totalPages: number, totalCount: number }
  } catch (error) {
    console.error('Error fetching enquiries:', error.response?.data || error.message); // Debug log
    throw error;
  }
};