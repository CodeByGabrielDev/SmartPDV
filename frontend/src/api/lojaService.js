import api from './axios';

export const lojaService = {
  listarLojasAtivas: async () => {
    const response = await api.get('/api-smartpdv/shop');
    return response.data;
  },
};