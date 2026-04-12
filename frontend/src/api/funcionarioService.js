import api from './axios';

export const funcionarioService = {
  alterarSenha: async (senhaDoUsuario, senhaQueDesejaUtilizar) => {
    const response = await api.put(
      `/api-smartpdv/my-profile/password/?senhaDoUsuario=${senhaDoUsuario}&senhaQueDesejaUtilizar=${senhaQueDesejaUtilizar}`
    );
    return response.data;
  },
};