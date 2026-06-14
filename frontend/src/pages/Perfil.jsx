import { useState, useEffect } from 'react';
import { funcionarioService } from '../api/funcionarioService';
import { showAlert } from '../components/Alert';
import { useTheme } from '../contexts/ThemeContext';

function forcaSenha(senha) {
  if (!senha) return { nivel: 0, label: '', color: 'bg-outline-variant' };
  let p = 0;
  if (senha.length >= 8) p++;
  if (/[A-Z]/.test(senha)) p++;
  if (/[0-9]/.test(senha)) p++;
  if (/[^A-Za-z0-9]/.test(senha)) p++;
  return [
    { nivel: 0, label: '',      color: 'bg-outline-variant' },
    { nivel: 1, label: 'Fraca', color: 'bg-error' },
    { nivel: 2, label: 'Média', color: 'bg-amber-400' },
    { nivel: 3, label: 'Boa',   color: 'bg-primary' },
    { nivel: 4, label: 'Forte', color: 'bg-emerald-500' },
  ][p];
}

const inputCls = 'w-full min-h-[44px] px-md bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:border-primary input-focus-ring transition-all outline-none';

export default function Perfil() {
  const [aba, setAba]                   = useState('conta');
  const [perfil, setPerfil]             = useState(null);
  const [carregando, setCarregando]     = useState(true);
  const [senhaAtual, setSenhaAtual]     = useState('');
  const [novaSenha, setNovaSenha]       = useState('');
  const [confirma, setConfirma]         = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [loja, setLoja]                 = useState(null);
  const [carregandoLoja, setCarregandoLoja] = useState(true);
  const [editandoLoja, setEditandoLoja] = useState(false);
  const [salvandoLoja, setSalvandoLoja] = useState(false);
  const [formLoja, setFormLoja]         = useState({ razaoSocial: '', cnpj: '', IE: '', endereco: '' });
  const { theme, toggleTheme }          = useTheme();
  const login = localStorage.getItem('login') || 'Admin';

  useEffect(() => {
    (async () => {
      try { setPerfil(await funcionarioService.buscarPerfil()); } catch { setPerfil(null); } finally { setCarregando(false); }
    })();
    (async () => {
      try {
        const d = await funcionarioService.buscarLoja();
        setLoja(d);
        setFormLoja({ razaoSocial: d.razaoSocial || '', cnpj: d.cnpj || '', IE: d.IE || '', endereco: d.endereco || '' });
      } catch { setLoja(null); } finally { setCarregandoLoja(false); }
    })();
  }, []);

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirma) { showAlert('Preencha todos os campos', 'error'); return; }
    if (novaSenha !== confirma) { showAlert('As senhas não coincidem', 'error'); return; }
    if (forcaSenha(novaSenha).nivel < 3) { showAlert('Senha fraca. Use letras maiúsculas, números e símbolos.', 'error'); return; }
    setSalvandoSenha(true);
    try {
      await funcionarioService.alterarSenha(senhaAtual, novaSenha);
      showAlert('Senha alterada com sucesso!', 'success');
      setSenhaAtual(''); setNovaSenha(''); setConfirma('');
    } catch (err) { showAlert(err.displayMessage || 'Erro ao alterar senha', 'error'); }
    finally { setSalvandoSenha(false); }
  };

  const handleSalvarLoja = async () => {
    setSalvandoLoja(true);
    try {
      const d = await funcionarioService.editarLoja(formLoja);
      setLoja(d); setEditandoLoja(false);
      showAlert('Dados da loja atualizados!', 'success');
    } catch (err) { showAlert(err.displayMessage || 'Erro ao salvar', 'error'); }
    finally { setSalvandoLoja(false); }
  };

  const forca = forcaSenha(novaSenha);
  const initials = login.slice(0, 2).toUpperCase();

  const abas = [
    { id: 'conta',     icon: 'person',  label: 'Minha Conta' },
    { id: 'loja',      icon: 'store',   label: 'Loja' },
    { id: 'aparencia', icon: 'palette', label: 'Aparência' },
  ];

  return (
    <div className="p-xl max-w-[1200px] mx-auto space-y-xl">

      {/* Page Header */}
      <div>
        <h1 className="text-headline-md font-bold text-on-surface">Configurações</h1>
        <p className="text-body-sm text-on-surface-variant mt-xs">Gerencie sua conta, dados da loja e aparência do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">

        {/* ── Side Nav ── */}
        <div className="lg:col-span-3">
          <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-card">
            {/* User mini card */}
            <div className="p-lg border-b border-outline-variant bg-surface-container-low flex items-center gap-md">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-lg flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-label-md font-bold text-on-surface truncate">{carregando ? '...' : perfil?.nomeVendedor || login}</p>
                <p className="text-[11px] text-on-surface-variant">@{login}</p>
              </div>
            </div>

            {/* Nav items */}
            <div className="p-sm space-y-xs">
              {abas.map(a => (
                <button
                  key={a.id}
                  onClick={() => setAba(a.id)}
                  className={`w-full flex items-center gap-md px-md py-sm rounded-xl text-label-md font-semibold transition-all min-h-[44px] ${
                    aba === a.id
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
                  {a.label}
                  {aba === a.id && <span className="material-symbols-outlined text-[16px] ml-auto">chevron_right</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="lg:col-span-9 space-y-lg">

          {/* ────── Minha Conta ────── */}
          {aba === 'conta' && (
            <>
              {/* Identity card */}
              <div className="bg-surface border border-outline-variant rounded-2xl shadow-card">
                {/* Banner */}
                <div className="h-20 bg-primary rounded-t-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                </div>
                <div className="px-xl pb-xl">
                  {/* Avatar — sai do banner com margem negativa, z-index garante visibilidade */}
                  <div className="flex items-end justify-between" style={{ marginTop: '-2.5rem' }}>
                    <div className="w-20 h-20 rounded-2xl bg-primary border-4 border-surface flex items-center justify-center text-on-primary font-bold text-2xl shadow-lg flex-shrink-0" style={{ zIndex: 1, position: 'relative' }}>
                      {initials}
                    </div>
                    <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold mb-2 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Ativo
                    </span>
                  </div>

                  <div className="mt-md">
                    <h3 className="text-headline-md font-bold text-on-surface">{carregando ? '—' : perfil?.nomeVendedor || login}</h3>
                    <p className="text-body-sm text-on-surface-variant mt-xs">@{login}</p>
                  </div>

                  <div className="mt-lg grid grid-cols-2 gap-md">
                    {[
                      { label: 'Login', value: login },
                      { label: 'Perfil / Cargo', value: perfil?.perfil || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-md bg-surface-container-low rounded-xl border border-outline-variant/30">
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-xs">{label}</p>
                        <p className="text-body-md font-semibold text-on-surface">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Change password */}
              <div className="bg-surface border border-outline-variant rounded-2xl shadow-card overflow-hidden">
                <div className="px-xl py-lg border-b border-outline-variant bg-surface-container-low flex items-center gap-sm">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
                  </div>
                  <div>
                    <h4 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Alterar Senha</h4>
                    <p className="text-[11px] text-on-surface-variant">Mantenha sua conta segura</p>
                  </div>
                </div>
                <form className="p-xl space-y-md max-w-md" onSubmit={e => { e.preventDefault(); handleAlterarSenha(); }}>
                  <div className="space-y-xs">
                    <label className="text-label-md font-semibold text-on-surface-variant">Senha Atual</label>
                    <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="••••••••" className={inputCls} />
                  </div>
                  <div className="space-y-xs">
                    <label className="text-label-md font-semibold text-on-surface-variant">Nova Senha</label>
                    <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="••••••••" className={inputCls} />
                    {novaSenha && (
                      <div className="space-y-xs mt-sm">
                        <div className="flex gap-xs h-1.5">
                          {[1,2,3,4].map(n => (
                            <div key={n} className={`flex-1 rounded-full transition-all duration-300 ${n <= forca.nivel ? forca.color : 'bg-outline-variant'}`} />
                          ))}
                        </div>
                        <span className="text-[11px] text-on-surface-variant">Força: <strong>{forca.label || 'Digite uma senha'}</strong></span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-xs">
                    <label className="text-label-md font-semibold text-on-surface-variant">Confirmar Nova Senha</label>
                    <input type="password" value={confirma} onChange={e => setConfirma(e.target.value)} placeholder="••••••••" className={inputCls} />
                    {confirma && novaSenha && confirma !== novaSenha && (
                      <p className="text-[11px] text-error mt-xs flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        As senhas não coincidem
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={salvandoSenha}
                    className="min-h-[44px] px-xl bg-primary text-on-primary text-label-md font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">{salvandoSenha ? 'sync' : 'lock_reset'}</span>
                    {salvandoSenha ? 'Salvando...' : 'Atualizar Senha'}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ────── Loja ────── */}
          {aba === 'loja' && (
            <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-card">
              <div className="px-xl py-lg border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">store</span>
                  </div>
                  <div>
                    <h4 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Dados da Unidade</h4>
                    <p className="text-[11px] text-on-surface-variant">Informações fiscais da loja</p>
                  </div>
                </div>
                {!editandoLoja && loja && (
                  <button
                    onClick={() => setEditandoLoja(true)}
                    className="flex items-center gap-xs px-md min-h-[40px] bg-surface border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Editar
                  </button>
                )}
              </div>

              <div className="p-xl">
                {carregandoLoja ? (
                  <div className="flex justify-center py-xl">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : !loja ? (
                  <div className="flex flex-col items-center justify-center py-xl gap-md text-center">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-50">store_off</span>
                    </div>
                    <div>
                      <p className="text-label-md font-semibold text-on-surface">Dados não encontrados</p>
                      <p className="text-body-sm text-on-surface-variant mt-xs">Não foi possível carregar os dados da loja</p>
                    </div>
                  </div>
                ) : !editandoLoja ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    {[
                      { label: 'Razão Social', value: loja.razaoSocial },
                      { label: 'CNPJ', value: loja.cnpj, mono: true },
                      { label: 'Inscrição Estadual (IE)', value: loja.IE, mono: true },
                      { label: 'Endereço Completo', value: loja.endereco, full: true },
                    ].map(({ label, value, mono, full }) => (
                      <div key={label} className={`p-md bg-surface-container-low rounded-xl border border-outline-variant/30 ${full ? 'md:col-span-2' : ''}`}>
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-xs">{label}</p>
                        <p className={`text-body-md font-semibold text-on-surface ${mono ? 'font-geist-mono' : ''}`}>{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form className="space-y-md max-w-lg" onSubmit={e => { e.preventDefault(); handleSalvarLoja(); }}>
                    {[
                      { key: 'razaoSocial', label: 'Razão Social' },
                      { key: 'cnpj',        label: 'CNPJ', mono: true },
                      { key: 'IE',          label: 'Inscrição Estadual (IE)', mono: true },
                      { key: 'endereco',    label: 'Endereço' },
                    ].map(({ key, label, mono }) => (
                      <div key={key} className="space-y-xs">
                        <label className="text-label-md font-semibold text-on-surface-variant">{label}</label>
                        <input
                          type="text"
                          value={formLoja[key]}
                          onChange={e => setFormLoja(f => ({...f, [key]: e.target.value}))}
                          className={inputCls + (mono ? ' font-geist-mono' : '')}
                        />
                      </div>
                    ))}
                    <div className="flex gap-md pt-sm">
                      <button type="button" onClick={() => setEditandoLoja(false)} className="px-lg min-h-[44px] border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all">
                        Cancelar
                      </button>
                      <button type="submit" disabled={salvandoLoja} className="px-xl min-h-[44px] bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-sm">
                        <span className="material-symbols-outlined text-[18px]">{salvandoLoja ? 'sync' : 'save'}</span>
                        {salvandoLoja ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="px-xl py-md border-t border-outline-variant bg-surface-container-low flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                <p className="text-body-sm text-on-surface-variant">
                  Estes dados são usados na emissão de Notas Fiscais e documentos oficiais.
                </p>
              </div>
            </div>
          )}

          {/* ────── Aparência ────── */}
          {aba === 'aparencia' && (
            <>
              {/* Theme selector */}
              <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-card">
                <div className="px-xl py-lg border-b border-outline-variant bg-surface-container-low flex items-center gap-sm">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">palette</span>
                  </div>
                  <div>
                    <h4 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Tema do Sistema</h4>
                    <p className="text-[11px] text-on-surface-variant">Escolha o visual do SmartPDV</p>
                  </div>
                </div>

                <div className="p-xl grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {[
                    {
                      id: 'light', label: 'Tema Claro', desc: 'Melhor para ambientes bem iluminados',
                      bg: 'bg-[#F8FAFC]', cardBg: 'bg-[#ffffff]', border: 'border-[#e2e8f0]', btnBg: 'bg-[#3525cd]',
                    },
                    {
                      id: 'dark', label: 'Modo Escuro', desc: 'Ideal para ambientes com pouca luz',
                      bg: 'bg-[#0F1117]', cardBg: 'bg-[#161b27]', border: 'border-[#2e3347]', btnBg: 'bg-[#c3c0ff]',
                    },
                  ].map(({ id, label, desc, bg, cardBg, border, btnBg }) => (
                    <label key={id} className="relative cursor-pointer group">
                      <input
                        type="radio" name="theme" value={id}
                        checked={theme === id}
                        onChange={() => { if (theme !== id) toggleTheme(); }}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-2xl p-md transition-all duration-200 ${theme === id ? 'border-primary shadow-card-lg' : 'border-outline-variant group-hover:border-primary/40'}`}>
                        {/* Preview */}
                        <div className={`${bg} border ${border} h-36 rounded-xl mb-md overflow-hidden p-sm flex flex-col gap-1.5`}>
                          {/* Topbar mockup */}
                          <div className={`flex items-center justify-between ${bg} border-b ${border} pb-1`}>
                            <div className={`w-16 h-2 rounded ${btnBg} opacity-80`} />
                            <div className="flex gap-1">
                              <div className={`w-4 h-4 rounded-full ${cardBg} border ${border}`} />
                              <div className={`w-4 h-4 rounded-full ${cardBg} border ${border}`} />
                            </div>
                          </div>
                          {/* Cards mockup */}
                          <div className="flex gap-1 flex-1">
                            <div className={`flex-1 ${cardBg} border ${border} rounded-lg`} />
                            <div className={`flex-1 ${cardBg} border ${border} rounded-lg`} />
                            <div className={`flex-1 ${cardBg} border ${border} rounded-lg`} />
                          </div>
                          {/* Button mockup */}
                          <div className={`w-full h-5 ${btnBg} rounded-lg opacity-90`} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-label-md font-bold text-on-surface block">{label}</span>
                            <span className="text-body-sm text-on-surface-variant">{desc}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${theme === id ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                            {theme === id && <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick toggle */}
              <div className="bg-surface border border-outline-variant rounded-2xl p-lg shadow-card flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant">
                      {theme === 'light' ? 'dark_mode' : 'light_mode'}
                    </span>
                  </div>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">
                      {theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Tema Claro'}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">Alternar rapidamente o tema atual</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-sm px-lg min-h-[44px] bg-surface-container border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container-high transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                  Alternar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
