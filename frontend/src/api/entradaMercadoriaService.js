import api from './axios';

export const entradaMercadoriaService = {
  listarNotasTransito: async () => {
    const response = await api.get('/api-smartpdv/goods%20receipt/');
    return response.data;
  },

  entradaDeMercadoria: async (idNota, obs) => {
    const response = await api.put(
      `/api-smartpdv/goods%20receipt/${idNota}/?obs=${obs}`
    );
    return response.data;
  },
};