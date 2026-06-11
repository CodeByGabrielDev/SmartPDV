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

const inputCls = 'w-full min-h-[44px] px-md bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:border-primary input-focus-ring transition-all outline-none';

export default function Cliente() {
  const [clientes, setClientes]     = useState([]);
  const [form, setForm]             = useState(FORM_INICIAL);
  const [busca, setBusca]           = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [loading, setLoading]       = useState(true);
  const [salvando, setSalvando]     = useState(false);
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
  const avatarColors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-emerald-500', 'bg-indigo-500'];
  const getAvatarColor = id => avatarColors[(id || 0) % avatarColors.length];

  return (
    <>
      <div className="p-xl space-y-xl max-w-7xl mx-auto w-full">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline-md font-bold text-on-surface">Clientes</h1>
            <p className="text-body-sm text-on-surface-variant mt-xs">
              {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} cadastrado{clientes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => { setMostrarForm(v => !v); setForm(FORM_INICIAL); }}
            className={`flex items-center gap-sm px-lg py-md rounded-xl text-label-md font-bold shadow-sm active:scale-[0.98] transition-all min-h-[44px] ${mostrarForm ? 'bg-surface-container border border-outline-variant text-on-surface-variant' : 'bg-primary text-on-primary hover:opacity-90'}`}
          >
            <span className="material-symbols-outlined">{mostrarForm ? 'close' : 'person_add'}</span>
            {mostrarForm ? 'Cancelar' : 'Novo Cliente'}
          </button>
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-md">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Pesquisar por nome, CPF ou CNPJ..."
              className="w-full min-h-[44px] pl-12 pr-md bg-surface border border-outline-variant rounded-xl text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="min-h-[44px] px-md py-sm bg-surface border border-outline-variant rounded-xl text-label-md font-semibold text-on-surface focus:border-primary outline-none transition-all"
          >
            <option value="">Todos os tipos</option>
            <option value="PESSOA_FISICA">Pessoa Física</option>
            <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
          </select>
        </div>

        {/* Registration Form */}
        {mostrarForm && (
          <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-card">
            <div className="flex items-center gap-sm mb-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person_add</span>
              </div>
              <div>
                <h2 className="text-headline-md font-bold text-on-surface">Novo Cliente</h2>
                <p className="text-body-sm text-on-surface-variant">Preencha os dados para cadastrar</p>
              </div>
            </div>
            <form onSubmit={handleCadastrar} className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs md:col-span-2">
                <label className="text-label-md font-semibold text-on-surface-variant">Nome Completo *</label>
                <input type="text" value={form.nome_cliente} onChange={e => setForm(f => ({...f, nome_cliente: e.target.value}))} placeholder="Ex: João da Silva" className={inputCls} required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant">CPF / CNPJ *</label>
                <input type="text" value={form.cpf_cnpj} onChange={e => setForm(f => ({...f, cpf_cnpj: e.target.value}))} className={inputCls + ' font-geist-mono'} placeholder="000.000.000-00" required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant">E-mail</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={inputCls} placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant">Telefone</label>
                <input type="text" value={form.telefone} onChange={e => setForm(f => ({...f, telefone: e.target.value}))} className={inputCls} placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant">CEP *</label>
                <input type="text" value={form.cep} onChange={e => setForm(f => ({...f, cep: e.target.value}))} className={inputCls + ' font-geist-mono'} placeholder="00000-000" required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant">Tipo de Pessoa</label>
                <select value={form.tipo} onChange={e => setForm(f => ({...f, tipo: e.target.value}))} className={inputCls + ' appearance-none'}>
                  <option value="PESSOA_FISICA">Pessoa Física</option>
                  <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-md pt-sm">
                <button type="button" onClick={() => setMostrarForm(false)} className="px-lg min-h-[44px] border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="px-xl min-h-[44px] bg-primary text-on-primary text-label-md font-bold rounded-xl shadow-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-sm">
                  <span className="material-symbols-outlined text-sm">check</span>
                  {salvando ? 'Salvando...' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-card">
          {/* Table header */}
          <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">group</span>
              <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Lista de Clientes</h2>
            </div>
            <span className="text-body-sm text-on-surface-variant">
              {filtrados.length} de {clientes.length}
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Cliente', 'Tipo', 'Documento', 'Contato', 'Localidade', 'Ações'].map(h => (
                    <th key={h} className="px-lg py-md text-[11px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-lg py-2xl text-center">
                      <div className="flex items-center justify-center gap-md text-on-surface-variant">
                        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Carregando clientes...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-lg py-2xl text-center">
                      <div className="flex flex-col items-center justify-center gap-lg">
                        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-50">groups</span>
                        </div>
                        <div>
                          <p className="text-label-md font-semibold text-on-surface">
                            {busca || filtroTipo ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                          </p>
                          <p className="text-body-sm text-on-surface-variant mt-xs">
                            {busca || filtroTipo ? 'Tente ajustar os filtros' : 'Clique em "Novo Cliente" para começar'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filtrados.map((c, i) => (
                  <tr
                    key={c.cpf_cnpj ?? i}
                    className={`hover:bg-surface-container/50 transition-colors border-b border-outline-variant/30 last:border-0 group ${i % 2 !== 0 ? 'bg-surface-container-low/20' : ''}`}
                  >
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className={`w-10 h-10 rounded-xl ${getAvatarColor(c.id)} flex items-center justify-center text-on-primary font-bold text-sm flex-shrink-0`}>
                          {getInitials(c.nome_cliente)}
                        </div>
                        <div>
                          <p className="text-label-md font-semibold text-on-surface">{c.nome_cliente}</p>
                          <p className="text-[11px] text-on-surface-variant">ID #{c.id || i + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full text-[11px] font-bold border ${c.tipo === 'PESSOA_JURIDICA' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                        {c.tipo === 'PESSOA_JURIDICA' ? 'PJ' : 'PF'}
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <span className="font-geist-mono text-mono-label text-on-surface">{fmtCpfCnpj(c.cpf_cnpj)}</span>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex flex-col gap-xs">
                        <span className="text-body-sm text-on-surface">{c.email || '—'}</span>
                        <span className="text-[11px] text-on-surface-variant font-geist-mono">{fmtTel(c.telefone)}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      {c.localidade && c.uf ? (
                        <div className="flex items-center gap-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          <span className="text-body-sm">{c.localidade} / {c.uf}</span>
                        </div>
                      ) : (
                        <span className="text-body-sm text-on-surface-variant">—</span>
                      )}
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setClienteModal(c); setModoEdicao(false); }}
                          className="p-sm rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary-container transition-all"
                          title="Ver detalhes"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => {
                            setClienteModal(c);
                            setFormEdicao({ nome_cliente: c.nome_cliente ?? '', cpf_cnpj: c.cpf_cnpj ?? '', email: c.email ?? '', telefone: c.telefone ?? '', cep: c.cep ?? '', tipo: c.tipo ?? 'PESSOA_FISICA' });
                            setModoEdicao(true);
                          }}
                          className="p-sm rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary-container transition-all"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-xl py-md border-t border-outline-variant bg-surface-container-low">
            <p className="text-body-sm text-on-surface-variant">
              Exibindo <strong className="text-on-surface">{filtrados.length}</strong> de <strong className="text-on-surface">{clientes.length}</strong> clientes
            </p>
          </div>
        </div>
      </div>

      {/* Modal detalhes / edição */}
      {clienteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-md"
          onClick={() => { setClienteModal(null); setModoEdicao(false); }}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-md p-lg border-b border-outline-variant bg-surface-container-low">
              <div className={`w-14 h-14 rounded-xl ${getAvatarColor(clienteModal.id)} flex items-center justify-center text-on-primary font-bold text-lg flex-shrink-0`}>
                {getInitials(clienteModal.nome_cliente)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-headline-md font-bold text-on-surface truncate">{clienteModal.nome_cliente}</h2>
                <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full text-[11px] font-bold border mt-xs ${clienteModal.tipo === 'PESSOA_JURIDICA' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                  {clienteModal.tipo === 'PESSOA_JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </span>
              </div>
              <button
                onClick={() => { setClienteModal(null); setModoEdicao(false); }}
                className="p-sm hover:bg-surface-container rounded-xl transition-colors text-on-surface-variant flex-shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-lg">
              {!modoEdicao ? (
                <div className="grid grid-cols-2 gap-md">
                  {[
                    { label: 'CPF / CNPJ', value: fmtCpfCnpj(clienteModal.cpf_cnpj), mono: true },
                    { label: 'E-mail', value: clienteModal.email || '—' },
                    { label: 'Telefone', value: fmtTel(clienteModal.telefone), mono: true },
                    { label: 'CEP', value: clienteModal.cep || '—', mono: true },
                    { label: 'Cidade / UF', value: clienteModal.localidade ? `${clienteModal.localidade} / ${clienteModal.uf}` : '—' },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="p-md bg-surface-container-low rounded-xl border border-outline-variant/30">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">{label}</span>
                      <span className={`text-body-md font-semibold text-on-surface ${mono ? 'font-geist-mono' : ''}`}>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleAtualizar} className="grid grid-cols-2 gap-md">
                  {[
                    { key: 'nome_cliente', label: 'Nome', type: 'text', col2: true },
                    { key: 'cpf_cnpj',    label: 'CPF/CNPJ', type: 'text', mono: true },
                    { key: 'email',       label: 'E-mail', type: 'email' },
                    { key: 'telefone',    label: 'Telefone', type: 'text' },
                    { key: 'cep',         label: 'CEP', type: 'text', mono: true },
                  ].map(({ key, label, type, col2, mono }) => (
                    <div key={key} className={`space-y-xs ${col2 ? 'col-span-2' : ''}`}>
                      <label className="text-label-md font-semibold text-on-surface-variant">{label}</label>
                      <input
                        type={type}
                        value={formEdicao[key] || ''}
                        onChange={e => setFormEdicao(f => ({...f, [key]: e.target.value}))}
                        className={inputCls + (mono ? ' font-geist-mono' : '')}
                      />
                    </div>
                  ))}
                  <div className="col-span-2 flex justify-end gap-md pt-sm">
                    <button type="button" onClick={() => setModoEdicao(false)} className="px-lg min-h-[44px] border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all">
                      Cancelar
                    </button>
                    <button type="submit" disabled={atualizando} className="px-xl min-h-[44px] bg-primary text-on-primary text-label-md font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                      {atualizando ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            {!modoEdicao && (
              <div className="p-lg border-t border-outline-variant flex justify-between items-center">
                <button
                  onClick={() => {
                    setFormEdicao({ nome_cliente: clienteModal.nome_cliente ?? '', cpf_cnpj: clienteModal.cpf_cnpj ?? '', email: clienteModal.email ?? '', telefone: clienteModal.telefone ?? '', cep: clienteModal.cep ?? '', tipo: clienteModal.tipo ?? 'PESSOA_FISICA' });
                    setModoEdicao(true);
                  }}
                  className="flex items-center gap-xs px-lg min-h-[44px] bg-surface-container border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container-high transition-all"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Editar
                </button>
                <button
                  onClick={() => { setClienteModal(null); setModoEdicao(false); }}
                  className="px-lg min-h-[44px] border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all"
                >
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
