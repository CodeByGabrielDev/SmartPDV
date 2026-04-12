import api from './axios';

export const vendaService = {
  realizarVenda: async (itens, cpfOrCnpj) => {
    const response = await api.post(
      `/api-smartpdv/point-of-sale?cpfOrCnpj=${cpfOrCnpj}`,
      itens
    );
    return response.data;
  },

  relatorioVendas: async (dataInicial, dataFinal) => {
    const response = await api.get('/api-smartpdv/point-of-sale/sales-report', {
      params: { dataInicial, dataFinal },
    });
    return response.data;
  },
};