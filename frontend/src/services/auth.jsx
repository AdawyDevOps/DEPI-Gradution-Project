import api from './api'; // ⬅️ أضف هذا السطر المهم!

export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  getProfile: () => {
    return api.get('/auth/profile');
  },

  updateProfile: (userData) => {
    return api.put('/auth/profile', userData);
  }
};
