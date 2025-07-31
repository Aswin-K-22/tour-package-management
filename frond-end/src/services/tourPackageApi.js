import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/tour-package',
  withCredentials: true,
  //headers: { 'Content-Type': 'application/json' },
});

export const addTourPackage = async (packageData) => {
  const response = await apiClient.post('/create', packageData);
  return response.data.data;
};

export const getTourPackages = async (page, limit) => {
  const response = await apiClient.get('/packages', {
    params: { page, limit }
  });
  return response.data.data; // { packages: [], totalPages: number, totalCount: number }
};

export const editTourPackage = async (id, packageData) => {
  const response = await apiClient.put(`/update/${id}`, packageData);
  return response.data.data;
};

export const deleteTourPackage = async (id) => {
  const response = await apiClient.delete(`/delete/${id}`);
  return response.data.data;
};


export const getAllTourPackages = async () => {
  const response = await apiClient.get('/all');
  return response.data.data.data;
};


export const getPackageById = async (id) => {
  try {
    const response = await apiClient.get(`/get/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching schedule by ID:", error);
    throw error;
  }
};