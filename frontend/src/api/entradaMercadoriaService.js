import api from './axios';

export const entradaMercadoriaService = {
  listarNotasTransito: async () => {
    const response = await api.get('/api-smartpdv/goods-receipt/');
    return response.data;
  },

  entradaDeMercadoria: async (idNota, obs) => {
    const response = await api.put(
      `/api-smartpdv/goods-receipt/${idNota}/`,
      null,
      { params: { obs: obs ?? '' } }
    );
    return response.data;
  },
};