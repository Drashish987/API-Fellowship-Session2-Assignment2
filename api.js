import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getTasks = () => axios.get(`${API_BASE_URL}/tasks`);

export const createTask = (task) => axios.post(`${API_BASE_URL}/tasks`, task);

export const updateTask = (id, updatedFields) =>
  axios.put(`${API_BASE_URL}/tasks/${id}`, updatedFields);

export const deleteTask = (id) => axios.delete(`${API_BASE_URL}/tasks/${id}`);
