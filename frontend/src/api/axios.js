import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const url = config.url || '';
  if (!url.includes('/auth/login')) {
    let rawToken = localStorage.getItem('token');
    let token = rawToken;
    if (token) {
      token = token.trim();
      if (token.startsWith('Token: ')) {
        token = token.substring(7);
      }
      const parts = token.split('.');
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    
    let displayMsg = null;
    
    if (data?.mensagem) {
      displayMsg = data.mensagem;
    } else if (data?.reason) {
      displayMsg = data.reason;
    } else if (data?.message) {
      displayMsg = data.message;
    } else if (data?.error) {
      displayMsg = data.error;
    } else if (!data) {
      if (status === 403) displayMsg = 'Acesso proibido';
      else if (status === 401) displayMsg = 'Não autorizado';
      else if (status === 404) displayMsg = 'Não encontrado';
      else if (status === 400) displayMsg = 'Dados inválidos';
      else if (status >= 500) displayMsg = 'Erro no servidor';
    }
    
    error.displayMessage = displayMsg || 'Erro inesperado';
    return Promise.reject(error);
  }
);

export default api;