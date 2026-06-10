import { useState, useEffect } from 'react';
import { produtoService } from '../api/produtoService';
import { showAlert } from '../components/Alert';
import { temPerfil } from '../api/authUtils';

const FORM_INICIAL = { descricao: '', codigoBarra: '', sku: '', precoVenda: '', custo: '' };
const fmt = v => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const margem = (venda, custo) => { if (!custo || custo === 0) return null; return (((venda - custo) / custo) * 100).toFixed(1); };

const inputCls = 'w-full h-11 px-md bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:border-primary input-focus-ring transition-all outline-none';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [modalInativar, setModalInativar] = useState(null);
  const [inativando, setInativando] = useState(false);
  const podeCadastrar = temPerfil('GERENTE', 'ADMIN', 'MATRIZ');

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try { setProdutos((await produtoService.listarProdutos()) || []); }
    catch (err) { showAlert(err.displayMessage || 'Erro ao carregar produtos', 'error'); }
    finally { setLoading(false); }
  };

  const handleCriar = async (e) => {
    e.preventDefault(); setSalvando(true);
    try {
      await produtoService.criarProduto({ descricao: form.descricao, codigoBarra: form.codigoBarra, sku: form.sku, precoVenda: parseFloat(form.precoVenda), custo: parseFloat(form.custo) });
      showAlert(`"${form.descricao}" cadastrado!`, 'success');
      setForm(FORM_INICIAL); setMostrarForm(false); carregar();
    } catch (err) { showAlert(err.displayMessage || 'Erro ao cadastrar', 'error'); }
    finally { setSalvando(false); }
  };

  const handleInativar = async () => {
    if (!modalInativar?.id) return;
    setInativando(true);
    try {
      await produtoService.inativarProduto(modalInativar.id);
      setProdutos(prev => prev.map(p => p.id === modalInativar.id ? { ...p, inativo: true } : p));
      showAlert(`"${modalInativar.descricao}" inativado.`, 'success');
      setModalInativar(null);
    } catch (err) { showAlert(err.displayMessage || 'Erro ao inativar', 'error'); }
    finally { setInativando(false); }
  };

  const filtrados = produtos.filter(p =>
    p.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo_barra?.toLowerCase().includes(busca.toLowerCase()) ||
    p.sku?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <div className="p-xl space-y-xl max-w-7xl mx-auto w-full">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row gap-md items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md group">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome, código ou SKU..." className="w-full bg-white border border-outline-variant rounded-xl pl-12 pr-md py-sm text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
          </div>
          {podeCadastrar && (
            <button onClick={() => setMostrarForm(v => !v)} className={`flex items-center gap-sm px-xl py-md rounded-xl text-label-md font-bold shadow-sm active:scale-95 transition-all ${mostrarForm ? 'bg-surface-container border border-outline-variant text-on-surface-variant' : 'bg-primary text-on-primary hover:opacity-90'}`}>
              <span className="material-symbols-outlined">{mostrarForm ? 'close' : 'add'}</span>
              {mostrarForm ? 'Cancelar' : 'Novo Produto'}
            </button>
          )}
        </div>

        {/* Form */}
        {mostrarForm && podeCadastrar && (
          <div className="bg-surface border border-outline-variant rounded-xl p-xl shadow-sm">
            <h2 className="text-headline-md font-semibold text-on-surface mb-lg">Cadastrar Produto</h2>
            <form onSubmit={handleCriar} className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs md:col-span-2">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Descrição *</label>
                <input type="text" value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))} placeholder="Ex: Camiseta Básica Branca M" className={inputCls} required />
              </div>
              {[
                { key: 'codigoBarra', label: 'Código de Barras *', placeholder: '7891234567890', mono: true },
                { key: 'sku',         label: 'SKU *', placeholder: 'CAM-BR-M-001', mono: true },
                { key: 'precoVenda',  label: 'Preço de Venda (R$) *', placeholder: '0,00', type: 'number', step: '0.01', min: '0.01' },
                { key: 'custo',       label: 'Custo (R$) *', placeholder: '0,00', type: 'number', step: '0.01', min: '0.01' },
              ].map(({ key, label, placeholder, mono, type, step, min }) => (
                <div key={key} className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">{label}</label>
                  <input type={type || 'text'} step={step} min={min} value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} placeholder={placeholder} className={inputCls + (mono ? ' font-geist-mono' : '')} required />
                </div>
              ))}
              {form.precoVenda && form.custo && (
                <div className="md:col-span-2 flex items-center gap-sm p-sm bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="material-symbols-outlined text-emerald-600">trending_up</span>
                  <span className="text-body-sm text-emerald-700">Margem estimada: <strong>{margem(form.precoVenda, form.custo)}%</strong></span>
                </div>
              )}
              <div className="md:col-span-2 pt-sm">
                <button type="submit" disabled={salvando} className="h-12 px-xl bg-primary text-on-primary text-label-md font-bold rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50">
                  {salvando ? 'Salvando...' : '✓ Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="glass-card border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center gap-sm">
              <h2 className="text-headline-md font-semibold text-on-surface">Catálogo</h2>
              <span className="px-sm py-xs rounded-full bg-surface-container text-on-surface-variant text-label-md font-semibold border border-outline-variant/30">
                {produtos.length} produtos
              </span>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  {['Produto', 'Código de Barras', 'SKU', 'Custo', 'Preço Venda', 'Margem', 'Status', ...(podeCadastrar ? ['Ação'] : [])].map(h => (
                    <th key={h} className="px-md py-lg text-[14px] font-bold text-on-surface-variant tracking-wider uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {loading ? (
                  <tr><td colSpan={8} className="px-md py-2xl text-center text-on-surface-variant">
                    <div className="flex items-center justify-center gap-md"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />Carregando...</div>
                  </td></tr>
                ) : filtrados.length === 0 ? (
                  <tr><td colSpan={8} className="px-md py-2xl text-center">
                    <div className="flex flex-col items-center gap-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-6xl opacity-20">inventory_2</span>
                      <p className="text-body-md">{busca ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}</p>
                    </div>
                  </td></tr>
                ) : filtrados.map((p, i) => {
                  const mg = margem(p.preco_venda, p.custo);
                  const ativo = p.inativo !== true;
                  return (
                    <tr key={p.id ?? i} className={`hover:bg-primary/5 transition-colors ${!ativo ? 'opacity-50' : ''}`}>
                      <td className="px-md py-md text-label-md font-semibold text-on-surface">{p.descricao}</td>
                      <td className="px-md py-md font-geist-mono text-mono-label text-on-surface-variant">{p.codigo_barra || '—'}</td>
                      <td className="px-md py-md font-geist-mono text-mono-label text-on-surface-variant">{p.sku || '—'}</td>
                      <td className="px-md py-md text-body-sm text-on-surface-variant">{fmt(p.custo)}</td>
                      <td className="px-md py-md text-label-md font-semibold text-on-surface">{fmt(p.preco_venda)}</td>
                      <td className="px-md py-md">
                        {mg !== null ? (
                          <span className={`px-sm py-xs rounded-full text-[11px] font-bold border ${parseFloat(mg) >= 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-error-container text-on-error-container border-error/20'}`}>
                            {mg}%
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-md py-md">
                        <span className={`px-sm py-xs rounded-full text-[11px] font-bold border ${ativo ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-surface-container text-on-surface-variant border-outline-variant'}`}>
                          {ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      {podeCadastrar && (
                        <td className="px-md py-md">
                          {ativo ? (
                            <button onClick={() => setModalInativar({ id: p.id, descricao: p.descricao })} className="px-md py-xs border border-error/30 text-error rounded-lg text-label-md font-semibold hover:bg-error/10 transition-all text-[12px]">
                              Inativar
                            </button>
                          ) : <span className="text-on-surface-variant text-body-sm">—</span>}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inactivate modal */}
      {modalInativar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !inativando && setModalInativar(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-md p-xl border border-outline-variant" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center gap-md">
              <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-3xl">block</span>
              </div>
              <h2 className="text-headline-md font-semibold">Inativar produto</h2>
              <p className="text-body-md text-on-surface-variant">Tem certeza que deseja inativar <strong>"{modalInativar.descricao}"</strong>? O produto não estará mais disponível para venda.</p>
              <div className="flex gap-md w-full">
                <button onClick={() => setModalInativar(null)} disabled={inativando} className="flex-1 py-sm border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container transition-all">Cancelar</button>
                <button onClick={handleInativar} disabled={inativando} className="flex-1 py-sm bg-error text-on-error rounded-lg text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50">
                  {inativando ? 'Inativando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
