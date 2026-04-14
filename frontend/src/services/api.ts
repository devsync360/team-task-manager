import axios from 'axios';
import type { Task, User } from '../types';

const API_URL = 'http://localhost:5000';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // --- AUTH ---
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data; // Returns { token, user }
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data; // Returns { token, user }
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/auth/users');
    return response.data;
  },

  // --- TASKS ---
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  createTask: async (task: Partial<Task>): Promise<Task> => {
    const response = await apiClient.post('/tasks', task);
    return response.data;
  },

  updateTask: async (id: number, updates: Partial<Task>): Promise<Task> => {
    const response = await apiClient.put(`/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  }
};