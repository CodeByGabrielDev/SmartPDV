import api from './axios';

const fmtLocal = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const rangeParaDia = (offsetDias = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offsetDias, 0, 0, 0);
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offsetDias, 23, 59, 59);
  return { dataInicial: fmtLocal(start), dataFinal: fmtLocal(end) };
};

export const dashboardService = {
  vendasHoje: async () => {
    const { dataInicial, dataFinal } = rangeParaDia(0);
    const response = await api.get('/api-smartpdv/point-of-sale/sales-report', {
      params: { dataInicial, dataFinal },
    });
    return response.data;
  },

  vendasOntem: async () => {
    const { dataInicial, dataFinal } = rangeParaDia(1);
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
