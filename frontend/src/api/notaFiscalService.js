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

  inutilizarNota: async (idnota) => {
    await api.put('/api-smartpdv/v1/invoice/reverse', null, { params: { idnota } });
  },

  cancelarNota: async (idnota, motivoCancelamento) => {
    await api.put('/api-smartpdv/v1/invoice/cancel-invoice', null, { params: { idnota, motivoCancelamento } });
  },
};