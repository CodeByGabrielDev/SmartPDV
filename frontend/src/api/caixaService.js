import api from './axios';

export const caixaService = {
  abrirCaixa: async () => {
    const response = await api.post('/api-smartpdv/v1/cashiers/open');
    return response.data;
  },

  fecharCaixa: async (id) => {
    const response = await api.put(`/api-smartpdv/v1/cashiers/${id}/close`);
    return response.data;
  },
};