import api from './axios';

const hoje = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  // formato: 2026-05-28T00:00:00
  const fmt = (d) => d.toISOString().slice(0, 19);
  return { dataInicial: fmt(start), dataFinal: fmt(end) };
};

export const dashboardService = {
  vendasHoje: async () => {
    const { dataInicial, dataFinal } = hoje();
    const response = await api.get('/api-smartpdv/point-of-sale/sales-report', {
      params: { dataInicial, dataFinal },
    });
    return response.data;
  },

  notasFiscais: async () => {
    const response = await api.get('/api-smartpdv/v1/invoice');
    return response.data;
  },

  notasPendentes: async () => {
    const response = await api.get('/api-smartpdv/goods-receipt/');
    return response.data;
  },
};
