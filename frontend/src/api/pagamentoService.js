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

  criarFormaPagamento: async (descricao) => {
    const response = await api.post('/api-smartpdv/payment-method', {
      desc_forma_pagamento: descricao,
    });
    return response.data;
  },

  deletarFormaPagamento: async (id) => {
    const response = await api.delete(`/api-smartpdv/payment-method/${id}`);
    return response.data;
  },
};