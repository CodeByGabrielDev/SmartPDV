import api from './axios';

export const notaFiscalService = {
  emitirNotaAvulsa: async (notaRequest) => {
    const response = await api.post('/api-smartpdv/v1/invoice', notaRequest);
    return response.data;
  },
};