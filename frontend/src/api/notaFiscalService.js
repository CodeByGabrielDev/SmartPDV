import api from './axios';

export const notaFiscalService = {
  emitirNotaAvulsa: async (notaRequest) => {
    const response = await api.post('/api-smartpdv/v1/invoice', notaRequest);
    return response.data;
  },

  listarNotas: async () => {
    const response = await api.get('/api-smartpdv/v1/invoice');
    return response.data;
  },
};