import { useState } from 'react';
import { ClienteService } from '../services/clienteService';
import './ClienteForm.css';

function ClienteForm() {
  const [formData, setFormData] = useState({
    nome_cliente: '',
    cep: '',
    cpf_cnpj: '',
    email: '',
    telefone: '',
    tipo: 'PESSOA_FISICA',
  });

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await ClienteService.createCliente(formData);
      setMessage({ type: 'success', text: `Cliente ${response.nome_cliente} criado com sucesso!` });
      setFormData({
        nome_cliente: '',
        cep: '',
        cpf_cnpj: '',
        email: '',
        telefone: '',
        tipo: 'PESSOA_FISICA',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cliente-form-container">
      <h2>Cadastro de Cliente</h2>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome_cliente">Nome do Cliente</label>
          <input
            type="text"
            id="nome_cliente"
            name="nome_cliente"
            value={formData.nome_cliente}
            onChange={handleChange}
            required
            placeholder="Digite o nome completo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
          <input
            type="text"
            id="cpf_cnpj"
            name="cpf_cnpj"
            value={formData.cpf_cnpj}
            onChange={handleChange}
            required
            placeholder="Digite CPF ou CNPJ"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Digite o e-mail"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            placeholder="Digite o telefone"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cep">CEP</label>
          <input
            type="text"
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            required
            placeholder="Digite o CEP"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo de Cliente</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="PESSOA_FISICA">Pessoa Física</option>
            <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
        </button>
      </form>
    </div>
  );
}

export default ClienteForm;