const API_BASE_URL = 'http://localhost:8080/api-smartpdv';

export const ClienteService = {
  createCliente: async (clienteData) => {
    const response = await fetch(`${API_BASE_URL}/costumer/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar cliente');
    }

    return response.json();
  },
};