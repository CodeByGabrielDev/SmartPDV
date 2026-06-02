import api from './axios';

export const estoqueService = {
  listarEstoque: async () => {
    const response = await api.get('/api-smartpdv/v1/stock-product');
    return response.data;
  },
};
