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
    { nivel: 0, label: '', color: 'bg-outline-variant' },
    { nivel: 1, label: 'Fraca',    color: 'bg-error' },
    { nivel: 2, label: 'Média',    color: 'bg-amber-400' },
    { nivel: 3, label: 'Boa',      color: 'bg-primary' },
    { nivel: 4, label: 'Forte',    color: 'bg-emerald-500' },
  ][p];
}

const inputCls = 'w-full px-md py-sm rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-body-md';

export default function Perfil() {
  const [aba, setAba] = useState('conta');
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [loja, setLoja] = useState(null);
  const [carregandoLoja, setCarregandoLoja] = useState(true);
  const [editandoLoja, setEditandoLoja] = useState(false);
  const [salvandoLoja, setSalvandoLoja] = useState(false);
  const [formLoja, setFormLoja] = useState({ razaoSocial: '', cnpj: '', IE: '', endereco: '' });
  const { theme, toggleTheme } = useTheme();
  const login = localStorage.getItem('login') || 'Admin';

  useEffect(() => {
    (async () => {
      try { setPerfil(await funcionarioService.buscarPerfil()); } catch { setPerfil(null); } finally { setCarregando(false); }
    })();
    (async () => {
      try { const d = await funcionarioService.buscarLoja(); setLoja(d); setFormLoja({ razaoSocial: d.razaoSocial || '', cnpj: d.cnpj || '', IE: d.IE || '', endereco: d.endereco || '' }); } catch { setLoja(null); } finally { setCarregandoLoja(false); }
    })();
  }, []);

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirma) { showAlert('Preencha todos os campos', 'error'); return; }
    if (novaSenha !== confirma) { showAlert('As senhas não coincidem', 'error'); return; }
    if (forcaSenha(novaSenha).nivel < 3) { showAlert('Senha muito fraca. Use letras maiúsculas, números e símbolos.', 'error'); return; }
    setSalvandoSenha(true);
    try { await funcionarioService.alterarSenha(senhaAtual, novaSenha); showAlert('Senha alterada com sucesso!', 'success'); setSenhaAtual(''); setNovaSenha(''); setConfirma(''); }
    catch (err) { showAlert(err.displayMessage || 'Erro ao alterar senha', 'error'); }
    finally { setSalvandoSenha(false); }
  };

  const handleSalvarLoja = async () => {
    setSalvandoLoja(true);
    try { const d = await funcionarioService.editarLoja(formLoja); setLoja(d); setEditandoLoja(false); showAlert('Dados da loja atualizados!', 'success'); }
    catch (err) { showAlert(err.displayMessage || 'Erro ao salvar', 'error'); }
    finally { setSalvandoLoja(false); }
  };

  const forca = forcaSenha(novaSenha);
  const initials = login.slice(0, 2).toUpperCase();

  const abas = [
    { id: 'conta', icon: 'person', label: 'Minha Conta' },
    { id: 'loja', icon: 'store', label: 'Loja' },
    { id: 'aparencia', icon: 'palette', label: 'Aparência' },
  ];

  return (
    <div className="p-xl max-w-[1440px] mx-auto">
      <div className="mb-lg">
        <h2 className="text-headline-lg font-semibold text-on-background">Configurações</h2>
        <p className="text-body-md text-on-surface-variant">Gerencie suas informações pessoais, dados da loja e aparência do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Sidebar nav */}
        <div className="lg:col-span-3 bg-surface border border-outline-variant rounded-xl p-sm space-y-xs">
          {abas.map(a => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={`w-full flex items-center gap-sm px-md py-sm rounded-lg text-label-md font-semibold transition-all ${aba === a.id ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-9 space-y-lg">

          {/* ── Minha Conta ── */}
          {aba === 'conta' && (
            <>
              {/* Identity card */}
              <div className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row items-center md:items-start gap-lg shadow-sm">
                <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-2xl border-2 border-primary">
                  {initials}
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
                    <div>
                      <h3 className="text-headline-md font-semibold text-on-surface">{carregando ? '—' : perfil?.nomeVendedor || login}</h3>
                      <p className="text-body-md text-on-surface-variant">@{login}</p>
                    </div>
                    <span className="px-sm py-1 rounded-full bg-emerald-100 text-emerald-800 text-label-md flex items-center gap-xs self-start">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ativo
                    </span>
                  </div>
                  <div className="mt-md grid grid-cols-1 md:grid-cols-2 gap-sm">
                    <div className="p-sm bg-surface-container-low rounded-lg border border-outline-variant/30">
                      <span className="text-[12px] font-bold text-on-surface-variant block">Login</span>
                      <span className="text-body-md font-semibold">{login}</span>
                    </div>
                    <div className="p-sm bg-surface-container-low rounded-lg border border-outline-variant/30">
                      <span className="text-[12px] font-bold text-on-surface-variant block">Perfil</span>
                      <span className="text-body-md font-semibold">{perfil?.perfil || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change password */}
              <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
                <div className="flex items-center gap-sm mb-md">
                  <span className="material-symbols-outlined text-primary">lock_reset</span>
                  <h4 className="text-headline-md font-semibold">Alterar Senha</h4>
                </div>
                <form className="space-y-md max-w-md" onSubmit={e => { e.preventDefault(); handleAlterarSenha(); }}>
                  {[
                    { label: 'Senha Atual', value: senhaAtual, set: setSenhaAtual },
                  ].map(({ label, value, set }) => (
                    <div key={label}>
                      <label className="block text-label-md font-semibold mb-xs">{label}</label>
                      <input type="password" value={value} onChange={e => set(e.target.value)} placeholder="••••••••" className={inputCls} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-label-md font-semibold mb-xs">Nova Senha</label>
                    <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="••••••••" className={inputCls} />
                    {novaSenha && (
                      <div className="mt-sm space-y-xs">
                        <div className="flex gap-xs h-1">
                          {[1,2,3,4].map(n => (
                            <div key={n} className={`flex-1 rounded-full transition-all ${n <= forca.nivel ? forca.color : 'bg-outline-variant'}`} />
                          ))}
                        </div>
                        <span className="text-[12px] text-on-surface-variant">Força: {forca.label || 'Digite uma senha'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-label-md font-semibold mb-xs">Confirmar Nova Senha</label>
                    <input type="password" value={confirma} onChange={e => setConfirma(e.target.value)} placeholder="••••••••" className={inputCls} />
                    {confirma && novaSenha && confirma !== novaSenha && (
                      <p className="text-body-sm text-error mt-xs">As senhas não coincidem</p>
                    )}
                  </div>
                  <button type="submit" disabled={salvandoSenha} className="bg-primary text-on-primary px-lg py-sm rounded-lg text-label-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50">
                    {salvandoSenha ? 'Salvando...' : 'Atualizar Senha'}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ── Loja ── */}
          {aba === 'loja' && (
            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-lg bg-surface-container-high flex justify-between items-center">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">store</span>
                  <h4 className="text-headline-md font-semibold">Dados da Unidade</h4>
                </div>
                {!editandoLoja && loja && (
                  <button onClick={() => setEditandoLoja(true)} className="flex items-center gap-xs px-md py-sm bg-surface border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container transition-all">
                    <span className="material-symbols-outlined text-[18px]">edit</span> Editar Dados
                  </button>
                )}
              </div>
              <div className="p-lg">
                {carregandoLoja ? (
                  <div className="flex justify-center py-xl"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : !loja ? (
                  <div className="text-center py-xl text-on-surface-variant">
                    <span className="material-symbols-outlined text-6xl opacity-20 mb-md">store</span>
                    <p>Não foi possível carregar os dados da loja.</p>
                  </div>
                ) : !editandoLoja ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                    <div className="space-y-md">
                      {[['Nome Fantasia', loja.razaoSocial], ['CNPJ', loja.cnpj], ['Inscrição Estadual (IE)', loja.IE]].map(([l, v]) => (
                        <div key={l}><span className="block text-label-md font-semibold text-on-surface-variant">{l}</span><span className="block text-body-lg font-semibold">{v || '—'}</span></div>
                      ))}
                    </div>
                    <div className="space-y-md">
                      {[['Endereço', loja.endereco]].map(([l, v]) => (
                        <div key={l}><span className="block text-label-md font-semibold text-on-surface-variant">{l}</span><span className="block text-body-md">{v || '—'}</span></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form className="space-y-md max-w-lg" onSubmit={e => { e.preventDefault(); handleSalvarLoja(); }}>
                    {[
                      { key: 'razaoSocial', label: 'Razão Social' },
                      { key: 'cnpj', label: 'CNPJ', mono: true },
                      { key: 'IE', label: 'Inscrição Estadual (IE)', mono: true },
                      { key: 'endereco', label: 'Endereço' },
                    ].map(({ key, label, mono }) => (
                      <div key={key}>
                        <label className="block text-label-md font-semibold mb-xs">{label}</label>
                        <input type="text" value={formLoja[key]} onChange={e => setFormLoja(f => ({...f, [key]: e.target.value}))} className={inputCls + (mono ? ' font-geist-mono' : '')} />
                      </div>
                    ))}
                    <div className="flex gap-md pt-sm">
                      <button type="button" onClick={() => setEditandoLoja(false)} className="px-lg py-sm border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container transition-all">Cancelar</button>
                      <button type="submit" disabled={salvandoLoja} className="px-xl py-sm bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50">
                        {salvandoLoja ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <div className="p-lg border-t border-outline-variant bg-surface-container-low">
                <div className="flex items-start gap-md">
                  <span className="material-symbols-outlined text-tertiary">info</span>
                  <p className="text-body-sm text-on-surface-variant">Estes dados são utilizados para a emissão de Notas Fiscais e documentos oficiais da loja.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Aparência ── */}
          {aba === 'aparencia' && (
            <>
              <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
                <div className="mb-lg">
                  <h4 className="text-headline-md font-semibold mb-xs">Tema do Sistema</h4>
                  <p className="text-body-md text-on-surface-variant">Personalize a experiência visual do SmartPDV conforme sua preferência.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {[
                    { id: 'light', label: 'Tema Claro (Padrão)', desc: 'Melhor para ambientes iluminados', bg: 'bg-[#F8FAFC]', cardBg: 'bg-white', border: 'border-slate-200', btnBg: 'bg-indigo-600' },
                    { id: 'dark',  label: 'Modo Escuro', desc: 'Ideal para ambientes com pouca luz', bg: 'bg-[#0F172A]', cardBg: 'bg-slate-800', border: 'border-slate-700', btnBg: 'bg-indigo-500' },
                  ].map(({ id, label, desc, bg, cardBg, border, btnBg }) => (
                    <label key={id} className="relative cursor-pointer">
                      <input type="radio" name="theme" value={id} checked={theme === id} onChange={() => { if (theme !== id) toggleTheme(); }} className="sr-only" />
                      <div className={`border-2 rounded-xl p-md transition-all ${theme === id ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}>
                        <div className={`${bg} border h-32 rounded-lg mb-md flex flex-col gap-2 p-sm overflow-hidden ${border}`}>
                          <div className="w-1/2 h-2 bg-slate-300 rounded" />
                          <div className="flex gap-2">
                            <div className={`flex-1 h-12 ${cardBg} border ${border} rounded shadow-sm`} />
                            <div className={`flex-1 h-12 ${cardBg} border ${border} rounded shadow-sm`} />
                          </div>
                          <div className={`w-full h-8 ${btnBg} rounded`} />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-label-md font-semibold block">{label}</span>
                            <span className="text-body-sm text-on-surface-variant">{desc}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === id ? 'border-primary' : 'border-outline-variant'}`}>
                            {theme === id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
                <h4 className="text-label-md font-bold mb-md">Densidade da Interface</h4>
                <div className="flex gap-md">
                  <button className="flex-1 px-md py-sm rounded-lg border border-primary bg-primary-container text-on-primary-container text-label-md font-semibold">Compacto (POS)</button>
                  <button className="flex-1 px-md py-sm rounded-lg border border-outline-variant hover:bg-surface-container text-label-md font-semibold">Espaçado (Gestão)</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
