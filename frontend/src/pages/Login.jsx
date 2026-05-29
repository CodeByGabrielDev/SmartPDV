import { useState } from 'react';
import { authService } from '../api/authService';
import { lojaService } from '../api/lojaService';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../components/Alert';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'registerFuncionario' | 'registerLoja'
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeVendedor, setNomeVendedor] = useState('');
  const [perfil, setPerfil] = useState(3);
  const [idLoja, setIdLoja] = useState('');
  const { theme, toggleTheme } = useTheme();

  // Campos loja
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [ie, setIe] = useState('');
  const [endereco, setEndereco] = useState('');

  const navigate = useNavigate();

  const resetFuncionario = () => {
    setLogin(''); setSenha(''); setConfirmarSenha('');
    setEmail(''); setCpf(''); setNomeVendedor('');
    setPerfil(3); setIdLoja('');
  };

  const resetLoja = () => {
    setRazaoSocial(''); setCnpj(''); setIe(''); setEndereco('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    try {
      let token = await authService.login(login, senha);
      token = String(token).trim().replace(/^"|"$/g, '');
      if (token.startsWith('Token: ')) token = token.substring(7);
      localStorage.setItem('token', token);
      localStorage.setItem('login', login);
      window.location.href = '/splash';
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
        login, email, cpf,
        nome_vendedor: nomeVendedor,
        perfil: parseInt(perfil),
        senha
      };
      await authService.registerEmployee(funcionario, parseInt(idLoja));
      showAlert('Funcionário cadastrado com sucesso! Faça login.', 'success');
      resetFuncionario();
      setMode('login');
    } catch (error) {
      const msg = error.displayMessage || error.message || 'Erro ao cadastrar funcionário';
      showAlert(msg, 'error');
    }
  };

  const handleRegisterLoja = async (e) => {
    e.preventDefault();
    try {
      await lojaService.registrarLoja({ razaoSocial, cnpj, ie, endereco });
      showAlert('Loja cadastrada com sucesso!', 'success');
      resetLoja();
      setMode('login');
    } catch (error) {
      const msg = error.displayMessage || error.message || 'Erro ao cadastrar loja';
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
      <button className="login-theme-toggle" onClick={toggleTheme} title="Alternar tema">
        {theme === 'light' ? '🌙' : '☀️'}
        <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
      </button>

      {mode === 'login' && (
        <form className="login-form" onSubmit={handleLogin}>
          <h1>SmartPDV - Login</h1>
          <div className="form-group">
            <label>Login:</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <button type="submit">Entrar</button>
          <p className="switch-mode">
            Não tem conta?{' '}
            <button type="button" onClick={() => setMode('registerFuncionario')}>
              Cadastre-se
            </button>
          </p>
          <p className="switch-mode">
            Deseja cadastrar uma loja nova?{' '}
            <button type="button" onClick={() => setMode('registerLoja')}>
              Cadastrar Loja
            </button>
          </p>
        </form>
      )}

      {mode === 'registerFuncionario' && (
        <form className="login-form" onSubmit={handleRegister}>
          <h1>Cadastrar Funcionário</h1>
          <div className="form-group">
            <label>Login:</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>CPF:</label>
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Nome:</label>
            <input type="text" value={nomeVendedor} onChange={(e) => setNomeVendedor(e.target.value)} required />
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
            <input type="number" value={idLoja} onChange={(e) => setIdLoja(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Confirmar Senha:</label>
            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
          </div>
          <button type="submit">Cadastrar</button>
          <p className="switch-mode">
            Já tem conta?{' '}
            <button type="button" onClick={() => { resetFuncionario(); setMode('login'); }}>
              Faça login
            </button>
          </p>
          <p className="switch-mode">
            Deseja cadastrar uma loja nova?{' '}
            <button type="button" onClick={() => { resetFuncionario(); setMode('registerLoja'); }}>
              Cadastrar Loja
            </button>
          </p>
        </form>
      )}

      {mode === 'registerLoja' && (
        <form className="login-form" onSubmit={handleRegisterLoja}>
          <h1>Cadastrar Loja</h1>
          <div className="form-group">
            <label>Razão Social:</label>
            <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>CNPJ:</label>
            <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Inscrição Estadual (IE):</label>
            <input type="text" value={ie} onChange={(e) => setIe(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Endereço:</label>
            <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
          </div>
          <button type="submit">Cadastrar Loja</button>
          <p className="switch-mode">
            Já tem conta?{' '}
            <button type="button" onClick={() => { resetLoja(); setMode('login'); }}>
              Faça login
            </button>
          </p>
          <p className="switch-mode">
            Quer cadastrar um funcionário?{' '}
            <button type="button" onClick={() => { resetLoja(); setMode('registerFuncionario'); }}>
              Cadastrar Funcionário
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
