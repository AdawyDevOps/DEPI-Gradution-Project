import api from './api';

export const foodEntriesService = {
  getAll: (userId) => {
    return api.get(`/food-entries?userId=${userId}`);
  },

  getById: (id) => {
    return api.get(`/food-entries/${id}`);
  },

  create: (entryData) => {
    return api.post('/food-entries', entryData);
  },

  update: (id, entryData) => {
    return api.put(`/food-entries/${id}`, entryData);
  },

  delete: (id) => {
    return api.delete(`/food-entries/${id}`);
  },

  search: (userId, query) => {
    return api.get(`/food-entries/search?userId=${userId}&query=${query}`);
  },

  getStats: (userId) => {
    return api.get(`/users/stats?userId=${userId}`);
  }
};