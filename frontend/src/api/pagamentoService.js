import api from './axios';

export const pagamentoService = {
  realizarPagamento: async (idVenda, formaPgto, qtdParcelas) => {
    const response = await api.post(
      `/api-smartpdv/payment/${idVenda}/`,
      null,
      { params: { formaPgto, qtdParcelas } }
    );
    return response.data;
  },

  listarFormasPagamento: async () => {
    const response = await api.get('/api-smartpdv/payment-method');
    return response.data;
  },

  // POST /api-smartpdv/payment-method/create?descricaoPagamento=X&formaPagamento=PIX
  criarFormaPagamento: async (descricaoPagamento, formaPagamento) => {
    const response = await api.post(
      '/api-smartpdv/payment-method/create',
      null,
      { params: { descricaoPagamento, formaPagamento } }
    );
    return response.data;
  },

  // DELETE /api-smartpdv/payment-method/{id}/delete
  deletarFormaPagamento: async (id) => {
    const response = await api.delete(`/api-smartpdv/payment-method/${id}/delete`);
    return response.data;
  },
};
