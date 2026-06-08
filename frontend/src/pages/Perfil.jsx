import { useState, useEffect } from 'react';
import { funcionarioService } from '../api/funcionarioService';
import { showAlert } from '../components/Alert';
import { useTheme } from '../contexts/ThemeContext';

// ── Força de senha ────────────────────────────────────────────────────────────
function forcaSenha(senha) {
  if (!senha) return { nivel: 0, label: '', color: '' };
  let pontos = 0;
  if (senha.length >= 8)           pontos++;
  if (/[A-Z]/.test(senha))         pontos++;
  if (/[0-9]/.test(senha))         pontos++;
  if (/[^A-Za-z0-9]/.test(senha))  pontos++;
  const niveis = [
    { nivel: 0, label: '',         color: '' },
    { nivel: 1, label: 'Fraca',    color: '#ef4444' },
    { nivel: 2, label: 'Média',    color: '#f59e0b' },
    { nivel: 3, label: 'Boa',      color: '#3b82f6' },
    { nivel: 4, label: 'Forte',    color: '#16a34a' },
  ];
  return niveis[pontos];
}

// ── Aba: Minha Conta ──────────────────────────────────────────────────────────
function AbaConta({ perfil, carregando }) {
  const [senhaAtual,  setSenhaAtual]  = useState('');
  const [novaSenha,   setNovaSenha]   = useState('');
  const [confirma,    setConfirma]    = useState('');
  const [salvando,    setSalvando]    = useState(false);
  const [showAtual,   setShowAtual]   = useState(false);
  const [showNova,    setShowNova]    = useState(false);
  const [showConfirma,setShowConfirma]= useState(false);

  const forca = forcaSenha(novaSenha);
  const login = localStorage.getItem('login') || '—';

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirma) {
      showAlert('Preencha todos os campos de senha.', 'error');
      return;
    }
    if (novaSenha !== confirma) {
      showAlert('A nova senha e a confirmação não coincidem.', 'error');
      return;
    }
    if (forca.nivel < 3) {
      showAlert('A senha precisa ser mais forte. Use letras, números e caracteres especiais.', 'error');
      return;
    }
    setSalvando(true);
    try {
      await funcionarioService.alterarSenha(senhaAtual, novaSenha);
      showAlert('Senha alterada com sucesso! 🔐', 'success');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirma('');
    } catch (err) {
      showAlert(err.displayMessage || err.message || 'Erro ao alterar senha.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const inicialAvatar = login.charAt(0).toUpperCase();

  return (
    <div className="cfg-section-body">

      {/* Card de identidade */}
      <div className="cfg-identity-card">
        <div className="cfg-avatar">{inicialAvatar}</div>
        <div className="cfg-identity-info">
          {carregando ? (
            <div className="cfg-skeleton-lines">
              <div className="cfg-skeleton cfg-sk-name" />
              <div className="cfg-skeleton cfg-sk-sub" />
              <div className="cfg-skeleton cfg-sk-badge" />
            </div>
          ) : (
            <>
              <p className="cfg-identity-nome">{perfil?.nomeVendedor || login}</p>
              <p className="cfg-identity-login">@{login}</p>
              <span className="cfg-perfil-badge">{perfil?.perfil || '—'}</span>
            </>
          )}
        </div>
      </div>

      {/* Alterar senha */}
      <div className="cfg-card">
        <div className="cfg-card-header">
          <span className="cfg-card-icon">🔑</span>
          <div>
            <h3 className="cfg-card-title">Alterar Senha</h3>
            <p className="cfg-card-desc">Use letras maiúsculas, números e caracteres especiais</p>
          </div>
        </div>

        <div className="cfg-form">
          <div className="cfg-field">
            <label>Senha atual</label>
            <div className="cfg-input-wrap">
              <input
                type={showAtual ? 'text' : 'password'}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="Digite sua senha atual"
              />
              <button className="cfg-eye-btn" onClick={() => setShowAtual(v => !v)} type="button">
                {showAtual ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="cfg-field">
            <label>Nova senha</label>
            <div className="cfg-input-wrap">
              <input
                type={showNova ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Crie uma senha forte"
              />
              <button className="cfg-eye-btn" onClick={() => setShowNova(v => !v)} type="button">
                {showNova ? '🙈' : '👁️'}
              </button>
            </div>
            {novaSenha && (
              <div className="cfg-forca-wrap">
                <div className="cfg-forca-bar">
                  {[1,2,3,4].map(n => (
                    <div
                      key={n}
                      className="cfg-forca-seg"
                      style={{ background: n <= forca.nivel ? forca.color : 'var(--border)' }}
                    />
                  ))}
                </div>
                <span className="cfg-forca-label" style={{ color: forca.color }}>{forca.label}</span>
              </div>
            )}
          </div>

          <div className="cfg-field">
            <label>Confirmar nova senha</label>
            <div className="cfg-input-wrap">
              <input
                type={showConfirma ? 'text' : 'password'}
                value={confirma}
                onChange={(e) => setConfirma(e.target.value)}
                placeholder="Repita a nova senha"
              />
              <button className="cfg-eye-btn" onClick={() => setShowConfirma(v => !v)} type="button">
                {showConfirma ? '🙈' : '👁️'}
              </button>
            </div>
            {confirma && novaSenha && confirma !== novaSenha && (
              <p className="cfg-field-error">As senhas não coincidem</p>
            )}
          </div>

          <button
            className="cfg-btn-salvar"
            onClick={alterarSenha}
            disabled={salvando}
          >
            {salvando ? '⏳ Salvando...' : '🔐 Alterar Senha'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Aba: Loja ─────────────────────────────────────────────────────────────────
function AbaLoja() {
  const [loja, setLoja]           = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando]   = useState(false);
  const [salvando, setSalvando]   = useState(false);
  const [form, setForm]           = useState({ razaoSocial: '', cnpj: '', IE: '', endereco: '' });

  useEffect(() => {
    const buscar = async () => {
      try {
        const data = await funcionarioService.buscarLoja();
        setLoja(data);
        setForm({
          razaoSocial: data.razaoSocial || '',
          cnpj:        data.cnpj        || '',
          IE:          data.IE          || '',
          endereco:    data.endereco    || '',
        });
      } catch {
        setLoja(null);
      } finally {
        setCarregando(false);
      }
    };
    buscar();
  }, []);

  const salvar = async () => {
    setSalvando(true);
    try {
      const atualizado = await funcionarioService.editarLoja(form);
      setLoja(atualizado);
      setEditando(false);
      showAlert('Dados da loja atualizados com sucesso!', 'success');
    } catch (err) {
      showAlert(err.displayMessage || err.message || 'Erro ao salvar dados da loja.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const cancelar = () => {
    setForm({
      razaoSocial: loja?.razaoSocial || '',
      cnpj:        loja?.cnpj        || '',
      IE:          loja?.IE          || '',
      endereco:    loja?.endereco    || '',
    });
    setEditando(false);
  };

  if (carregando) {
    return (
      <div className="cfg-section-body">
        <div className="cfg-card">
          <div className="cfg-skeleton-block" />
        </div>
      </div>
    );
  }

  if (!loja) {
    return (
      <div className="cfg-section-body">
        <div className="cfg-empty-state">
          <span>🏪</span>
          <p>Não foi possível carregar os dados da loja.</p>
          <p className="cfg-empty-sub">Verifique se o backend está rodando corretamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cfg-section-body">
      <div className="cfg-card">
        <div className="cfg-card-header">
          <span className="cfg-card-icon">🏪</span>
          <div style={{ flex: 1 }}>
            <h3 className="cfg-card-title">{loja.razaoSocial}</h3>
            <p className="cfg-card-desc">Dados da loja vinculada ao seu perfil</p>
          </div>
          {!editando && (
            <button className="cfg-btn-editar" onClick={() => setEditando(true)}>
              ✏️ Editar
            </button>
          )}
        </div>

        {!editando ? (
          <div className="cfg-loja-grid">
            {[
              { label: 'Razão Social',           valor: loja.razaoSocial },
              { label: 'CNPJ',                    valor: loja.cnpj },
              { label: 'Inscrição Estadual (IE)', valor: loja.IE },
              { label: 'Endereço',                valor: loja.endereco },
            ].map(({ label, valor }) => (
              <div key={label} className="cfg-loja-item">
                <span className="cfg-loja-label">{label}</span>
                <span className="cfg-loja-valor">{valor || '—'}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="cfg-form">
            {[
              { key: 'razaoSocial', label: 'Razão Social',           placeholder: 'Ex: Empresa LTDA' },
              { key: 'cnpj',        label: 'CNPJ',                    placeholder: '00.000.000/0001-00' },
              { key: 'IE',          label: 'Inscrição Estadual (IE)', placeholder: '000000000' },
              { key: 'endereco',    label: 'Endereço',                placeholder: 'Rua X, 123 - Cidade' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="cfg-field">
                <label>{label}</label>
                <div className="cfg-input-wrap">
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ paddingRight: '1rem' }}
                  />
                </div>
              </div>
            ))}
            <div className="cfg-form-actions">
              <button className="cfg-btn-cancelar" onClick={cancelar} disabled={salvando}>
                Cancelar
              </button>
              <button className="cfg-btn-salvar" onClick={salvar} disabled={salvando}>
                {salvando ? '⏳ Salvando...' : '💾 Salvar Alterações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Aba: Aparência ────────────────────────────────────────────────────────────
function AbaAparencia() {
  const { theme, toggleTheme } = useTheme();

  const temas = [
    { id: 'dark',  label: 'Escuro',  icon: '🌙', desc: 'Ideal para ambientes com pouca luz' },
    { id: 'light', label: 'Claro',   icon: '☀️', desc: 'Melhor para ambientes iluminados'  },
  ];

  return (
    <div className="cfg-section-body">
      <div className="cfg-card">
        <div className="cfg-card-header">
          <span className="cfg-card-icon">🎨</span>
          <div>
            <h3 className="cfg-card-title">Tema da Interface</h3>
            <p className="cfg-card-desc">Escolha a aparência do sistema</p>
          </div>
        </div>
        <div className="cfg-tema-grid">
          {temas.map(t => (
            <button
              key={t.id}
              className={`cfg-tema-btn ${theme === t.id ? 'active' : ''}`}
              onClick={() => { if (theme !== t.id) toggleTheme(); }}
            >
              <span className="cfg-tema-icon">{t.icon}</span>
              <span className="cfg-tema-label">{t.label}</span>
              <span className="cfg-tema-desc">{t.desc}</span>
              {theme === t.id && <span className="cfg-tema-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Perfil() {
  const [aba, setAba]         = useState('conta');
  const [perfil, setPerfil]   = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        const data = await funcionarioService.buscarPerfil();
        setPerfil(data);
      } catch {
        // endpoint ainda não criado — continua sem dados
        setPerfil(null);
      } finally {
        setCarregando(false);
      }
    };
    buscarPerfil();
  }, []);

  const abas = [
    { id: 'conta',    label: 'Minha Conta',  icon: '👤' },
    { id: 'loja',     label: 'Loja',         icon: '🏪' },
    { id: 'aparencia',label: 'Aparência',    icon: '🎨' },
  ];

  return (
    <div className="cfg-wrapper">

      {/* Cabeçalho */}
      <div className="cfg-page-header">
        <div>
          <h1 className="cfg-page-title">⚙️ Configurações</h1>
          <p className="cfg-page-sub">Gerencie seu perfil, loja e preferências</p>
        </div>
      </div>

      <div className="cfg-layout">

        {/* Sidebar de abas */}
        <nav className="cfg-sidebar">
          {abas.map(a => (
            <button
              key={a.id}
              className={`cfg-nav-item ${aba === a.id ? 'active' : ''}`}
              onClick={() => setAba(a.id)}
            >
              <span className="cfg-nav-icon">{a.icon}</span>
              <span className="cfg-nav-label">{a.label}</span>
            </button>
          ))}
        </nav>

        {/* Conteúdo */}
        <div className="cfg-content">
          {aba === 'conta'     && <AbaConta     perfil={perfil} carregando={carregando} />}
          {aba === 'loja'      && <AbaLoja      />}
          {aba === 'aparencia' && <AbaAparencia />}
        </div>

      </div>
    </div>
  );
}
