import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/schedule',
  withCredentials: true,
});

export const addSchedule = async (scheduleData) => {
  const response = await apiClient.post('/create', scheduleData);
  return response.data.data;
};

export const getSchedules = async (page, limit) => {
  const response = await apiClient.get('/all', {
    params: { page, limit }
  });
  return response.data.data; // { schedules: [], totalPages: number, totalCount: number }
};

export const editSchedule = async (id, scheduleData) => {
  const response = await apiClient.put(`/update/${id}`, scheduleData);
  return response.data.data;
};

export const deleteSchedule = async (id) => {
  const response = await apiClient.delete(`/delete/${id}`);
  return response.data.data;
};

export const getScheduleById = async (id) => {
  try {
    const response = await apiClient.get(`/get/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching schedule by ID:", error);
    throw error;
  }
};
