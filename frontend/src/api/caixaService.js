import api from './axios';

export const caixaService = {
  abrirCaixa: async () => {
    const response = await api.post('/api-smartpdv/v1/cashiers/open');
    return response.data;
  },

  buscarCaixaAberto: async () => {
    try {
      const response = await api.get('/api-smartpdv/v1/cashiers/status');
      return response.data; // null se não houver caixa aberto
    } catch {
      return null;
    }
  },

  fecharCaixa: async (id) => {
    const response = await api.put(`/api-smartpdv/v1/cashiers/${id}/close`);
    return response.data;
  },
};