import { useState, useEffect } from 'react';
import { clienteService } from '../api/clienteService';
import { showAlert } from '../components/Alert';

const FORM_INICIAL = { nome_cliente: '', cpf_cnpj: '', email: '', telefone: '', cep: '', tipo: 'PESSOA_FISICA' };

function fmtCpfCnpj(v) {
  if (!v) return '—';
  const d = v.replace(/\D/g, '');
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  return v;
}
function fmtTel(v) {
  if (!v) return '—';
  const d = v.replace(/\D/g, '');
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return v;
}

const inputCls = 'w-full h-11 px-md bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:border-primary input-focus-ring transition-all outline-none';

export default function Cliente() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [clienteModal, setClienteModal] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formEdicao, setFormEdicao] = useState(FORM_INICIAL);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try { setClientes((await clienteService.listarClientes()) || []); }
    catch (err) { showAlert(err.displayMessage || 'Erro ao carregar clientes', 'error'); }
    finally { setLoading(false); }
  };

  const handleCadastrar = async (e) => {
    e.preventDefault(); setSalvando(true);
    try {
      await clienteService.cadastrarCliente(form);
      showAlert(`"${form.nome_cliente}" cadastrado!`, 'success');
      setForm(FORM_INICIAL); setMostrarForm(false); carregar();
    } catch (err) { showAlert(err.displayMessage || 'Erro ao cadastrar', 'error'); }
    finally { setSalvando(false); }
  };

  const handleAtualizar = async (e) => {
    e.preventDefault(); setAtualizando(true);
    try {
      await clienteService.atualizarCliente(clienteModal.id, formEdicao);
      showAlert('Cliente atualizado!', 'success');
      setClienteModal(null); setModoEdicao(false); carregar();
    } catch (err) { showAlert(err.displayMessage || 'Erro ao atualizar', 'error'); }
    finally { setAtualizando(false); }
  };

  const filtrados = clientes.filter(c => {
    const t = busca.toLowerCase();
    const ok = !t || c.nome_cliente?.toLowerCase().includes(t) || c.cpf_cnpj?.includes(t) || c.email?.toLowerCase().includes(t);
    return ok && (!filtroTipo || c.tipo === filtroTipo);
  });

  const getInitials = n => n ? n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : 'CL';

  return (
    <>
      <div className="p-xl space-y-xl max-w-7xl mx-auto w-full">
        {/* Top bar: search + new */}
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-8 glass-card p-lg rounded-xl border border-outline-variant flex gap-md items-center">
            <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Pesquisar por Nome, CPF ou CNPJ..."
                className="w-full pl-12 pr-md py-sm bg-surface-container-low border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
              />
            </div>
            <select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              className="px-md py-sm bg-surface-container-highest text-on-surface-variant rounded-lg text-label-md font-semibold border border-outline-variant"
            >
              <option value="">Todos os tipos</option>
              <option value="PESSOA_FISICA">Pessoa Física</option>
              <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
            </select>
          </div>
          <div className="col-span-4 glass-card p-lg rounded-xl border border-outline-variant flex items-center justify-end">
            <button
              onClick={() => { setMostrarForm(v => !v); setForm(FORM_INICIAL); }}
              className="flex items-center gap-sm bg-primary text-on-primary px-xl py-md rounded-xl text-label-md font-bold shadow-lg hover:bg-tertiary transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">{mostrarForm ? 'close' : 'person_add'}</span>
              {mostrarForm ? 'Cancelar' : 'NOVO CLIENTE'}
            </button>
          </div>
        </div>

        {/* Registration form */}
        {mostrarForm && (
          <div className="bg-surface border border-outline-variant rounded-xl p-xl shadow-sm">
            <h2 className="text-headline-md font-semibold text-on-surface mb-lg">Novo Cliente</h2>
            <form onSubmit={handleCadastrar} className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs md:col-span-2">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Nome Completo *</label>
                <input type="text" value={form.nome_cliente} onChange={e => setForm(f => ({...f, nome_cliente: e.target.value}))} className={inputCls} required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">CPF / CNPJ *</label>
                <input type="text" value={form.cpf_cnpj} onChange={e => setForm(f => ({...f, cpf_cnpj: e.target.value}))} className={inputCls + ' font-geist-mono'} placeholder="000.000.000-00" required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">E-mail</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={inputCls} />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Telefone</label>
                <input type="text" value={form.telefone} onChange={e => setForm(f => ({...f, telefone: e.target.value}))} className={inputCls} placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">CEP *</label>
                <input type="text" value={form.cep} onChange={e => setForm(f => ({...f, cep: e.target.value}))} className={inputCls + ' font-geist-mono'} placeholder="00000-000" required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Tipo</label>
                <select value={form.tipo} onChange={e => setForm(f => ({...f, tipo: e.target.value}))} className={inputCls + ' appearance-none'}>
                  <option value="PESSOA_FISICA">Pessoa Física</option>
                  <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                </select>
              </div>
              <div className="md:col-span-2 pt-sm">
                <button type="submit" disabled={salvando} className="h-12 px-xl bg-primary text-on-primary text-label-md font-bold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
                  {salvando ? 'Salvando...' : '✓ Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="glass-card border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  {['Cliente', 'Tipo', 'Documento', 'Contato', 'Localidade', 'Ações'].map(h => (
                    <th key={h} className="px-md py-lg text-[14px] font-bold text-on-surface-variant tracking-wider uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {loading ? (
                  <tr><td colSpan={6} className="px-md py-2xl text-center text-on-surface-variant">
                    <div className="flex items-center justify-center gap-md">
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      Carregando...
                    </div>
                  </td></tr>
                ) : filtrados.length === 0 ? (
                  <tr><td colSpan={6} className="px-md py-2xl text-center">
                    <div className="flex flex-col items-center gap-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-6xl opacity-20">groups</span>
                      <p className="text-body-md">{busca || filtroTipo ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}</p>
                    </div>
                  </td></tr>
                ) : filtrados.map((c, i) => (
                  <tr key={c.cpf_cnpj ?? i} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-md py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-sm">
                          {getInitials(c.nome_cliente)}
                        </div>
                        <div>
                          <p className="text-label-md font-semibold text-on-surface">{c.nome_cliente}</p>
                          <p className="text-xs text-on-surface-variant">#{c.id || i + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center">
                      <span className={`px-sm py-1 rounded-full text-[11px] font-bold border ${c.tipo === 'PESSOA_JURIDICA' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                        {c.tipo === 'PESSOA_JURIDICA' ? 'PJ' : 'PF'}
                      </span>
                    </td>
                    <td className="px-md py-md font-geist-mono text-mono-label">{fmtCpfCnpj(c.cpf_cnpj)}</td>
                    <td className="px-md py-md">
                      <div className="flex flex-col">
                        <span className="text-body-sm font-medium">{c.email || '—'}</span>
                        <span className="text-xs text-on-surface-variant">{fmtTel(c.telefone)}</span>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      <div className="flex items-center gap-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="text-body-sm">{c.localidade && c.uf ? `${c.localidade} / ${c.uf}` : '—'}</span>
                      </div>
                    </td>
                    <td className="px-md py-md text-right">
                      <div className="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setClienteModal(c); setModoEdicao(false); }} className="p-sm text-secondary hover:text-primary hover:bg-primary-container/10 rounded-lg transition-all" title="Detalhes">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button onClick={() => { setClienteModal(c); setFormEdicao({ nome_cliente: c.nome_cliente ?? '', cpf_cnpj: c.cpf_cnpj ?? '', email: c.email ?? '', telefone: c.telefone ?? '', cep: c.cep ?? '', tipo: c.tipo ?? 'PESSOA_FISICA' }); setModoEdicao(true); }} className="p-sm text-secondary hover:text-primary hover:bg-primary-container/10 rounded-lg transition-all" title="Editar">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-lg py-md border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
            <p className="text-body-sm text-on-surface-variant">
              Mostrando <span className="font-bold">{filtrados.length}</span> de <span className="font-bold">{clientes.length}</span> clientes
            </p>
          </div>
        </div>
      </div>

      {/* Modal detalhes/edição */}
      {clienteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setClienteModal(null); setModoEdicao(false); }}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-md overflow-hidden border border-outline-variant" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-md p-lg border-b border-outline-variant">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                {getInitials(clienteModal.nome_cliente)}
              </div>
              <div className="flex-1">
                <h2 className="text-headline-md font-semibold text-on-surface">{clienteModal.nome_cliente}</h2>
                <span className={`px-sm py-xs rounded-full text-[11px] font-bold ${clienteModal.tipo === 'PESSOA_JURIDICA' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {clienteModal.tipo === 'PESSOA_JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </span>
              </div>
              <button onClick={() => { setClienteModal(null); setModoEdicao(false); }} className="p-sm hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-lg">
              {!modoEdicao ? (
                <div className="grid grid-cols-2 gap-md">
                  {[
                    { label: 'CPF / CNPJ', value: fmtCpfCnpj(clienteModal.cpf_cnpj), mono: true },
                    { label: 'E-mail', value: clienteModal.email || '—' },
                    { label: 'Telefone', value: fmtTel(clienteModal.telefone), mono: true },
                    { label: 'CEP', value: clienteModal.cep || '—', mono: true },
                    { label: 'Cidade/UF', value: clienteModal.localidade ? `${clienteModal.localidade} / ${clienteModal.uf}` : '—' },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="p-sm bg-surface-container-low rounded-lg border border-outline-variant/30">
                      <span className="text-[12px] font-bold text-on-surface-variant block mb-xs">{label}</span>
                      <span className={`text-body-md font-semibold ${mono ? 'font-geist-mono' : ''}`}>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleAtualizar} className="grid grid-cols-2 gap-md">
                  {[
                    { key: 'nome_cliente', label: 'Nome', type: 'text', col2: true },
                    { key: 'cpf_cnpj', label: 'CPF/CNPJ', type: 'text', mono: true },
                    { key: 'email', label: 'E-mail', type: 'email' },
                    { key: 'telefone', label: 'Telefone', type: 'text' },
                    { key: 'cep', label: 'CEP', type: 'text', mono: true },
                  ].map(({ key, label, type, col2, mono }) => (
                    <div key={key} className={`space-y-xs ${col2 ? 'col-span-2' : ''}`}>
                      <label className="text-label-md font-semibold text-on-surface-variant ml-xs">{label}</label>
                      <input type={type} value={formEdicao[key] || ''} onChange={e => setFormEdicao(f => ({...f, [key]: e.target.value}))} className={inputCls + (mono ? ' font-geist-mono' : '')} />
                    </div>
                  ))}
                  <div className="col-span-2 flex justify-end gap-md pt-sm">
                    <button type="button" onClick={() => setModoEdicao(false)} className="px-lg py-sm border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container transition-all">Cancelar</button>
                    <button type="submit" disabled={atualizando} className="px-xl py-sm bg-primary text-on-primary text-label-md font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
                      {atualizando ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {!modoEdicao && (
              <div className="p-lg border-t border-outline-variant flex justify-between">
                <button onClick={() => { setFormEdicao({ nome_cliente: clienteModal.nome_cliente ?? '', cpf_cnpj: clienteModal.cpf_cnpj ?? '', email: clienteModal.email ?? '', telefone: clienteModal.telefone ?? '', cep: clienteModal.cep ?? '', tipo: clienteModal.tipo ?? 'PESSOA_FISICA' }); setModoEdicao(true); }} className="flex items-center gap-xs px-lg py-sm bg-surface-container border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container-high transition-all">
                  <span className="material-symbols-outlined text-sm">edit</span> Editar
                </button>
                <button onClick={() => { setClienteModal(null); setModoEdicao(false); }} className="px-lg py-sm border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container transition-all">
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
