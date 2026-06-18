import api from './axios';

export const vendaService = {
  realizarVenda: async (itens, cpfOrCnpj) => {
    const url = cpfOrCnpj
      ? `/api-smartpdv/point-of-sale?cpfOrCnpj=${cpfOrCnpj}`
      : `/api-smartpdv/point-of-sale`;
    const response = await api.post(url, itens);
    return response.data;
  },

  cancelarVenda: async (idVenda, motivoCancelamento) => {
    await api.delete(`/api-smartpdv/point-of-sale/cancelar/${idVenda}`, {
      params: { motivoCancelamento },
    });
  },

  relatorioVendas: async (dataInicial, dataFinal) => {
    const response = await api.get('/api-smartpdv/point-of-sale/sales-report', {
      params: { dataInicial, dataFinal },
    });
    return response.data;
  },
};