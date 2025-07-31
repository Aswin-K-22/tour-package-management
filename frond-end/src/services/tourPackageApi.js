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
  const response = await apiClient.put(`/${id}`, packageData);
  return response.data.data;
};

export const deleteTourPackage = async (id) => {
  const response = await apiClient.delete(`/delete/${id}`);
  return response.data.data;
};