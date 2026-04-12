import api from './axios';

export const authService = {
  login: async (login, senha) => {
    const params = new URLSearchParams();
    params.append('login', login);
    params.append('senha', senha);
    const response = await api.get('/api-smartpdv/auth/login/employee', {
      params: { login, senha },
    });
    return response.data;
  },

  registerEmployee: async (funcionario, idLoja) => {
    const response = await api.post(
      `/api-smartpdv/auth/register/employee?idLoja=${idLoja}`,
      funcionario
    );
    return response.data;
  },
};