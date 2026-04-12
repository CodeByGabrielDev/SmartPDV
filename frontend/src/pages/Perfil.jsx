import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { funcionarioService } from '../api/funcionarioService';
import { showAlert } from '../components/Alert';

export default function Perfil() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const alterarSenha = async () => {
    try {
      await funcionarioService.alterarSenha(senhaAtual, novaSenha);
      setMensagem('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
    } catch (error) {
      const erroMsg = error.displayMessage || error.message || 'Erro ao alterar senha';
      showAlert(erroMsg, 'error');
      setMensagem('Erro ao alterar senha');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    navigate('/');
  };

  const login = localStorage.getItem('login');

  return (
    <div className="page-container">
      <h1>Meu Perfil</h1>
      <p>Usuário: {login}</p>
      <div className="form-group">
        <label>Senha Atual:</label>
        <input
          type="password"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Nova Senha:</label>
        <input
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
      </div>
      <button onClick={alterarSenha}>Alterar Senha</button>
      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
}