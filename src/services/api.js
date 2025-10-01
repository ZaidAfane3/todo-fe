import axios from 'axios';

// Create axios instances for different services
const authApi = axios.create({
  baseURL: process.env.REACT_APP_AUTH_BASE_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const todoApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3002',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API functions
export const authService = {
  login: async (username, password) => {
    const response = await authApi.post('/login', { username, password });
    return response.data;
  },

  logout: async () => {
    const response = await authApi.post('/logout');
    return response.data;
  },

  checkAuth: async () => {
    const response = await authApi.get('/is-logged-in');
    return response.data;
  },

  healthCheck: async () => {
    const response = await authApi.get('/health');
    return response.data;
  },
};

// Todo API functions
export const todoService = {
  getTodos: async () => {
    const response = await todoApi.get('/to-do');
    return response.data;
  },

  getTodo: async (id) => {
    const response = await todoApi.get(`/to-do/${id}`);
    return response.data;
  },

  createTodo: async (todo) => {
    const response = await todoApi.post('/to-do', todo);
    return response.data;
  },

  updateTodo: async (id, updates) => {
    const response = await todoApi.put(`/to-do/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await todoApi.delete(`/to-do/${id}`);
    return response.data;
  },

  getUser: async () => {
    const response = await todoApi.get('/user');
    return response.data;
  },

  healthCheck: async () => {
    const response = await todoApi.get('/health');
    return response.data;
  },
};

export { authApi, todoApi };
