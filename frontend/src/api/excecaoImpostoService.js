import api from './axios';

export const excecaoImpostoService = {
  criarExcecaoImposto: async (excecaoRequest) => {
    const response = await api.post('/api-smartpdv/v1/tax-exception', excecaoRequest);
    return response.data;
  },

  listarExcecoes: async () => {
    const response = await api.get('/api-smartpdv/v1/tax-exception');
    return response.data;
  },
};
