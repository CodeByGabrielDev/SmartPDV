import { useState } from 'react';
import { authService } from '../api/authService';
import { lojaService } from '../api/lojaService';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../components/Alert';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const [view, setView] = useState('login'); // 'login' | 'employee' | 'store'
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeVendedor, setNomeVendedor] = useState('');
  const [perfil, setPerfil] = useState(3);
  const [idLoja, setIdLoja] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [ie, setIe] = useState('');
  const [endereco, setEndereco] = useState('');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const perfis = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Gerente' },
    { value: 3, label: 'Funcionário' },
    { value: 4, label: 'Contabilidade' },
    { value: 5, label: 'Matriz' },
  ];

  const switchView = (v) => setView(v);

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
      showAlert(error.displayMessage || error.message || 'Erro ao conectar com o servidor', 'error');
    }
  };

  const handleRegisterEmployee = async (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) { showAlert('As senhas não coincidem', 'error'); return; }
    if (!idLoja) { showAlert('Informe o ID da loja', 'error'); return; }
    try {
      await authService.registerEmployee(
        { login, email, cpf, nome_vendedor: nomeVendedor, perfil: parseInt(perfil), senha },
        parseInt(idLoja)
      );
      showAlert('Funcionário cadastrado com sucesso! Faça login.', 'success');
      switchView('login');
    } catch (error) {
      showAlert(error.displayMessage || error.message || 'Erro ao cadastrar funcionário', 'error');
    }
  };

  const handleRegisterStore = async (e) => {
    e.preventDefault();
    try {
      await lojaService.registrarLoja({ razaoSocial, cnpj, IE: ie, endereco });
      showAlert('Loja cadastrada com sucesso!', 'success');
      switchView('login');
    } catch (error) {
      showAlert(error.displayMessage || error.message || 'Erro ao cadastrar loja', 'error');
    }
  };

  const inputCls = 'w-full h-11 px-md bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:border-primary input-focus-ring transition-all';
  const selectCls = inputCls + ' appearance-none';

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col overflow-x-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 geometric-pattern" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-container/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 flex justify-between items-center px-xl py-lg md:px-2xl">
        <span className="text-headline-md font-black text-primary tracking-tight">SmartPDV</span>
        <button
          onClick={toggleTheme}
          className="p-sm rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors text-on-surface-variant"
          title="Alternar Tema"
        >
          <span className="material-symbols-outlined">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
        </button>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-md relative z-10">
        <div
          className={`w-full frosted-panel shadow-card-lg rounded-2xl border border-outline-variant/20 overflow-hidden transition-all duration-300 ${
            view === 'employee' ? 'max-w-[640px]' : view === 'store' ? 'max-w-[520px]' : 'max-w-[480px]'
          }`}
        >
          <div className="p-lg md:p-xl">
            {/* Title */}
            <div className="mb-xl text-center">
              <h1 className="text-headline-lg font-semibold text-on-surface mb-xs">
                {view === 'login' ? 'Bem-vindo' : view === 'employee' ? 'Novo Funcionário' : 'Configurar Loja'}
              </h1>
              <p className="text-body-md text-on-surface-variant">
                {view === 'login'
                  ? 'Acesse sua conta para gerenciar seu negócio.'
                  : view === 'employee'
                  ? 'Preencha os dados técnicos para o novo acesso.'
                  : 'Registre os dados fiscais da sua empresa.'}
              </p>
            </div>

            {/* ── LOGIN VIEW ── */}
            {view === 'login' && (
              <div className="space-y-lg">
                <form className="space-y-md" onSubmit={handleLogin}>
                  <div className="space-y-xs">
                    <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Login</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-md text-on-surface-variant" style={{ fontSize: 20 }}>person</span>
                      <input
                        type="text"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                        placeholder="Seu usuário"
                        className="w-full h-12 pl-11 pr-md bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:border-primary input-focus-ring transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-xs">
                    <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Senha</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-md text-on-surface-variant" style={{ fontSize: 20 }}>lock</span>
                      <input
                        type="password"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-md bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:border-primary input-focus-ring transition-all"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 bg-primary text-on-primary text-label-md font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Entrar
                  </button>
                </form>

                <div className="relative py-sm">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant" /></div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface-container-lowest px-md text-body-sm text-on-surface-variant">Novos acessos</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <button
                    onClick={() => switchView('store')}
                    className="w-full py-sm border border-outline-variant hover:bg-surface-container-low rounded-lg text-label-md font-semibold text-on-surface-variant transition-colors"
                  >
                    Cadastrar Loja
                  </button>
                  <button
                    onClick={() => switchView('employee')}
                    className="w-full py-sm border border-outline-variant hover:bg-surface-container-low rounded-lg text-label-md font-semibold text-on-surface-variant transition-colors"
                  >
                    Cadastrar Equipe
                  </button>
                </div>
              </div>
            )}

            {/* ── EMPLOYEE VIEW ── */}
            {view === 'employee' && (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-md" onSubmit={handleRegisterEmployee}>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Nome Completo</label>
                  <input type="text" value={nomeVendedor} onChange={e => setNomeVendedor(e.target.value)} className={inputCls} required />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} required />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">CPF</label>
                  <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" className={inputCls} required />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Login</label>
                  <input type="text" value={login} onChange={e => setLogin(e.target.value)} className={inputCls} required />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Perfil</label>
                  <select value={perfil} onChange={e => setPerfil(e.target.value)} className={selectCls}>
                    {perfis.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">ID da Loja</label>
                  <input type="number" value={idLoja} onChange={e => setIdLoja(e.target.value)} placeholder="Ex: 1" className={inputCls} required />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Senha</label>
                  <input type="password" value={senha} onChange={e => setSenha(e.target.value)} className={inputCls} required />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Confirmar Senha</label>
                  <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} className={inputCls} required />
                </div>
                <div className="md:col-span-2 pt-md space-y-sm">
                  <button type="submit" className="w-full h-12 bg-primary text-on-primary text-label-md font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all">
                    Cadastrar Funcionário
                  </button>
                  <button type="button" onClick={() => switchView('login')} className="w-full py-sm text-center text-label-md font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    Voltar para o Login
                  </button>
                </div>
              </form>
            )}

            {/* ── STORE VIEW ── */}
            {view === 'store' && (
              <form className="space-y-md" onSubmit={handleRegisterStore}>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Razão Social</label>
                  <input type="text" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} className={inputCls} required />
                </div>
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="text-label-md font-semibold text-on-surface-variant ml-xs">CNPJ</label>
                    <input type="text" value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" className={inputCls} required />
                  </div>
                  <div className="space-y-xs">
                    <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Inscrição Estadual (IE)</label>
                    <input type="text" value={ie} onChange={e => setIe(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Endereço Completo</label>
                  <textarea
                    value={endereco}
                    onChange={e => setEndereco(e.target.value)}
                    rows={3}
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    className="w-full p-md bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:border-primary input-focus-ring transition-all resize-none"
                    required
                  />
                </div>
                <div className="pt-md space-y-sm">
                  <button type="submit" className="w-full h-12 bg-primary text-on-primary text-label-md font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all">
                    Registrar Minha Loja
                  </button>
                  <button type="button" onClick={() => switchView('login')} className="w-full py-sm text-center text-label-md font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    Voltar para o Login
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Card footer */}
          <div className="px-xl py-md bg-surface-container-low/50 border-t border-outline-variant/20 flex justify-center">
            <p className="text-body-sm text-on-surface-variant">© 2024 SmartPDV. Tecnologia para crescer.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-lg px-xl flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex items-center gap-md">
          <a href="#" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Suporte</a>
          <span className="w-1 h-1 bg-outline-variant rounded-full hidden md:block" />
          <a href="#" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Documentação</a>
        </div>
        <p className="text-label-md font-semibold text-on-surface-variant opacity-70">v1.2.4 Production</p>
      </footer>
    </div>
  );
}
