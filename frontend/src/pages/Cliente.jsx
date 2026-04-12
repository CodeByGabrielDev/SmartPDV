import { useState } from 'react';
import { clienteService } from '../api/clienteService';
import { showAlert } from '../components/Alert';

export default function Cliente() {
  const [nomeCliente, setNomeCliente] = useState('');
  const [cep, setCep] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('PESSOA_FISICA');
  const [mensagem, setMensagem] = useState('');

  const cadastrarCliente = async (e) => {
    e.preventDefault();
    try {
      const clienteRequest = {
        nome_cliente: nomeCliente,
        cep,
        cpf_cnpj: cpfCnpj,
        email,
        telefone,
        tipo,
      };
      await clienteService.cadastrarCliente(clienteRequest);
      setMensagem('Cliente cadastrado com sucesso!');
      setNomeCliente('');
      setCep('');
      setCpfCnpj('');
      setEmail('');
      setTelefone('');
    } catch (error) {
      const erroMsg = error.displayMessage || error.message || 'Erro ao cadastrar cliente';
      showAlert(erroMsg, 'error');
      setMensagem('Erro ao cadastrar cliente');
    }
  };

  return (
    <div className="page-container">
      <h1>Cadastro de Cliente</h1>
      <form onSubmit={cadastrarCliente}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>CPF/CNPJ:</label>
          <input
            type="text"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Telefone:</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>CEP:</label>
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Tipo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="PESSOA_FISICA">Pessoa Física</option>
            <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
          </select>
        </div>
        <button type="submit">Cadastrar Cliente</button>
      </form>
      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
}