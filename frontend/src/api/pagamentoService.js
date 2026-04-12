import api from './axios';

export const pagamentoService = {
  realizarPagamento: async (idVenda, formaPgto, qtdParcelas) => {
    const response = await api.post(
      `/api-smartpdv/payment/${idVenda}/?formaPgto=${formaPgto}&qtdParcelas=${qtdParcelas}`
    );
    return response.data;
  },

  listarFormasPagamento: async () => {
    const response = await api.get('/api-smartpdv/payment-method');
    return response.data;
  },
};