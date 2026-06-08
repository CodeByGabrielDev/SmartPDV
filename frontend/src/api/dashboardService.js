import api from './axios';

const hoje = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  // formato local: 2026-06-04T00:00:00 (sem conversão UTC)
  const fmt = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  };
  return { dataInicial: fmt(start), dataFinal: fmt(end) };
};

export const dashboardService = {
  vendasHoje: async () => {
    const { dataInicial, dataFinal } = hoje();
    console.log('🔍 Dashboard buscando vendas:', { dataInicial, dataFinal });
    const response = await api.get('/api-smartpdv/point-of-sale/sales-report', {
      params: { dataInicial, dataFinal },
    });
    console.log('📊 Vendas retornadas:', response.data);
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
