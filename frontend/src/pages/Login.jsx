import { useState } from 'react';
import { authService } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../components/Alert';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeVendedor, setNomeVendedor] = useState('');
  const [perfil, setPerfil] = useState(3);
  const [idLoja, setIdLoja] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    try {
      let token = await authService.login(login, senha);
      if (token && token.startsWith('Token: ')) {
        token = token.substring(7);
      }
      localStorage.setItem('token', token);
      localStorage.setItem('login', login);
      window.location.href = '/dashboard';
    } catch (error) {
      const msg = error.displayMessage || error.message || 'Erro ao conectar com o servidor';
      showAlert(msg, 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (senha !== confirmarSenha) {
      showAlert('As senhas não coincidem', 'error');
      return;
    }

    if (!idLoja) {
      showAlert('Informe o ID da loja', 'error');
      return;
    }

    try {
      const funcionario = {
        login,
        email,
        cpf,
        nome_vendedor: nomeVendedor,
        perfil: parseInt(perfil),
        senha
      };
      
      await authService.registerEmployee(funcionario, parseInt(idLoja));
      showAlert('Funcionário cadastrado com sucesso! Faça login.', 'success');
      setIsRegister(false);
      setLogin('');
      setSenha('');
      setConfirmarSenha('');
      setEmail('');
      setCpf('');
      setNomeVendedor('');
      setPerfil(3);
      setIdLoja('');
    } catch (error) {
      const msg = error.displayMessage || error.message || 'Erro ao cadastrar funcionário';
      showAlert(msg, 'error');
    }
  };

  const perfis = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Gerente' },
    { value: 3, label: 'Funcionário' },
    { value: 4, label: 'Contabilidade' },
    { value: 5, label: 'Matriz' }
  ];

  return (
    <div className="login-container">
      {!isRegister ? (
        <form className="login-form" onSubmit={handleLogin}>
          <h1>SmartPDV - Login</h1>
          <div className="form-group">
            <label>Login:</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit">Entrar</button>
          <p className="switch-mode">
            Não tem conta?{' '}
            <button type="button" onClick={() => setIsRegister(true)}>
              Cadastre-se
            </button>
          </p>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleRegister}>
          <h1>Cadastrar Funcionário</h1>
          <div className="form-group">
            <label>Login:</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>CPF:</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={nomeVendedor}
              onChange={(e) => setNomeVendedor(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Perfil:</label>
            <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
              {perfis.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>ID da Loja:</label>
            <input
              type="number"
              value={idLoja}
              onChange={(e) => setIdLoja(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Senha:</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit">Cadastrar</button>
          <p className="switch-mode">
            Já tem conta?{' '}
            <button type="button" onClick={() => setIsRegister(false)}>
              Faça login
            </button>
          </p>
        </form>
      )}
    </div>
  );
}