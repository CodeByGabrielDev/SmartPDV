import api from './axios';

export const lojaService = {
  listarLojasAtivas: async () => {
    const response = await api.get('/api-smartpdv/shop');
    return response.data;
  },

  registrarLoja: async (loja) => {
    const response = await api.post('/api-smartpdv/auth/register-shop', loja);
    return response.data;
  },
};
