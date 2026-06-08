import api from './axios';

export const funcionarioService = {
  alterarSenha: async (senhaDoUsuario, senhaQueDesejaUtilizar) => {
    const response = await api.put(
      `/api-smartpdv/my-profile/password/?senhaDoUsuario=${senhaDoUsuario}&senhaQueDesejaUtilizar=${senhaQueDesejaUtilizar}`
    );
    return response.data;
  },

  buscarPerfil: async () => {
    const response = await api.get('/api-smartpdv/my-profile/me');
    return response.data;
  },

  buscarLoja: async () => {
    const response = await api.get('/api-smartpdv/my-profile/');
    return response.data;
  },

  editarLoja: async (lojaRequest) => {
    const response = await api.put('/api-smartpdv/my-profile/my-shop/', lojaRequest);
    return response.data;
  },
};