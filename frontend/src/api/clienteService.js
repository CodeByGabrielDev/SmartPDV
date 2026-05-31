import api from './axios';

export const clienteService = {
  cadastrarCliente: async (clienteRequest) => {
    const response = await api.post('/api-smartpdv/costumer/', clienteRequest);
    return response.data;
  },

  listarClientes: async () => {
    const response = await api.get('/api-smartpdv/costumer/');
    return response.data;
  },
};