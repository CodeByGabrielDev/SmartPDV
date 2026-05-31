import api from './axios';

export const produtoService = {
  listarProdutos: async () => {
    const response = await api.get('/api-smartpdv/v1/product');
    return response.data;
  },

  criarProduto: async (produto) => {
    const response = await api.post('/api-smartpdv/v1/product', produto);
    return response.data;
  },

  inativarProduto: async (id) => {
    const response = await api.put(`/api-smartpdv/v1/product?idLong=${id}`);
    return response.data;
  },
};
