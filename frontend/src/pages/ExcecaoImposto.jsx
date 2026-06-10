import { useState, useEffect } from 'react';
import { excecaoImpostoService } from '../api/excecaoImpostoService';
import { showAlert } from '../components/Alert';

const TIPOS = [
  { value: 0, label: 'ICMS',   color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 1, label: 'PIS',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 2, label: 'COFINS', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 3, label: 'IPI',    color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 4, label: 'IBS',    color: 'bg-primary-container/20 text-primary border-primary/20' },
  { value: 5, label: 'CBS',    color: 'bg-tertiary-container/30 text-tertiary border-tertiary/20' },
];
const tipoInfo = val => {
  const found = typeof val === 'string' ? TIPOS.find(t => t.label === val) : TIPOS.find(t => t.value === parseInt(val));
  return found || { label: val, color: 'bg-surface-container text-on-surface-variant border-outline-variant' };
};
const FORM_INICIAL = { naturezao_operacao: '', descricao: '' };
const ITEM_INICIAL = { tipo: 0, aliquota: '', reducao_Base: '' };

const inputCls = 'w-full h-11 px-md bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:border-primary input-focus-ring transition-all outline-none';

export default function ExcecaoImposto() {
  const [excecoes, setExcecoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [expandido, setExpandido] = useState(null);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(FORM_INICIAL);
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState(ITEM_INICIAL);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try { setExcecoes((await excecaoImpostoService.listarExcecoes()) || []); }
    catch (err) { showAlert(err.displayMessage || 'Erro ao carregar', 'error'); }
    finally { setLoading(false); }
  };

  const adicionarItem = () => {
    if (!novoItem.aliquota) { showAlert('Informe a alíquota', 'error'); return; }
    if (itens.some(i => parseInt(i.tipo) === parseInt(novoItem.tipo))) { showAlert(`Tipo ${tipoInfo(novoItem.tipo).label} já adicionado`, 'error'); return; }
    setItens(prev => [...prev, { ...novoItem }]);
    setNovoItem(ITEM_INICIAL);
  };

  const criarExcecao = async (e) => {
    e.preventDefault();
    if (!form.naturezao_operacao) { showAlert('Informe o CFOP', 'error'); return; }
    if (!form.descricao.trim()) { showAlert('Informe a descrição', 'error'); return; }
    if (itens.length === 0) { showAlert('Adicione ao menos um imposto', 'error'); return; }
    setSalvando(true);
    try {
      await excecaoImpostoService.criarExcecaoImposto({ naturezao_operacao: parseInt(form.naturezao_operacao), descricao: form.descricao.trim(), itens: itens.map(i => ({ tipo: parseInt(i.tipo), aliquota: parseFloat(i.aliquota), reducao_Base: parseFloat(i.reducao_Base) || 0 })) });
      showAlert('Exceção criada!', 'success');
      setForm(FORM_INICIAL); setItens([]); setMostrarForm(false); carregar();
    } catch (err) { showAlert(err.displayMessage || 'Erro ao criar', 'error'); }
    finally { setSalvando(false); }
  };

  const filtradas = excecoes.filter(e => { const q = busca.toLowerCase(); return String(e.naturezao_operacao).includes(q) || e.descricao?.toLowerCase().includes(q) || e.loja?.toLowerCase().includes(q); });

  return (
    <div className="p-xl space-y-xl max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-md justify-between items-start md:items-center">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por CFOP, descrição ou loja..." className="w-full bg-white border border-outline-variant rounded-xl pl-12 pr-md py-sm text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
        </div>
        <button onClick={() => { setMostrarForm(v => !v); setItens([]); setForm(FORM_INICIAL); }} className={`flex items-center gap-sm px-xl py-md rounded-xl text-label-md font-bold shadow-sm active:scale-95 transition-all ${mostrarForm ? 'bg-surface-container border border-outline-variant text-on-surface-variant' : 'bg-primary text-on-primary hover:opacity-90'}`}>
          <span className="material-symbols-outlined">{mostrarForm ? 'close' : 'add'}</span>
          {mostrarForm ? 'Cancelar' : 'Nova Exceção'}
        </button>
      </div>

      {/* Form */}
      {mostrarForm && (
        <div className="bg-surface border border-outline-variant rounded-xl p-xl shadow-sm space-y-xl">
          <h2 className="text-headline-md font-semibold text-on-surface">Nova Exceção de Imposto</h2>
          <form onSubmit={criarExcecao} className="space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">CFOP *</label>
                <input type="number" value={form.naturezao_operacao} onChange={e => setForm(f => ({...f, naturezao_operacao: e.target.value}))} placeholder="Ex: 5101" className={inputCls} required />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Descrição *</label>
                <input type="text" value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))} placeholder="Ex: Venda de mercadoria industrializada" className={inputCls} required />
              </div>
            </div>

            {/* Add tax item */}
            <div className="space-y-md">
              <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Itens de Imposto</h3>
              <div className="flex flex-wrap gap-md items-end">
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Tipo</label>
                  <select value={novoItem.tipo} onChange={e => setNovoItem(p => ({...p, tipo: parseInt(e.target.value)}))} className={inputCls + ' appearance-none w-40'}>
                    {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Alíquota (%)</label>
                  <input type="number" step="0.01" min="0" value={novoItem.aliquota} onChange={e => setNovoItem(p => ({...p, aliquota: e.target.value}))} placeholder="Ex: 18" className={inputCls + ' w-32'} />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant ml-xs">Redução Base (%)</label>
                  <input type="number" step="0.01" min="0" value={novoItem.reducao_Base} onChange={e => setNovoItem(p => ({...p, reducao_Base: e.target.value}))} placeholder="0" className={inputCls + ' w-32'} />
                </div>
                <button type="button" onClick={adicionarItem} className="h-11 px-md bg-secondary-container text-on-secondary-container rounded-lg text-label-md font-semibold hover:bg-secondary-fixed transition-all flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Adicionar
                </button>
              </div>

              {itens.length > 0 ? (
                <div className="flex flex-wrap gap-sm">
                  {itens.map((item, idx) => {
                    const info = tipoInfo(item.tipo);
                    return (
                      <div key={idx} className={`flex items-center gap-sm px-md py-sm rounded-full border text-label-md font-semibold ${info.color}`}>
                        <span>{info.label}</span>
                        <span className="opacity-70">{item.aliquota}%</span>
                        {parseFloat(item.reducao_Base) > 0 && <span className="opacity-70">Red.{item.reducao_Base}%</span>}
                        <button type="button" onClick={() => setItens(prev => prev.filter((_, i) => i !== idx))} className="hover:opacity-70 transition-opacity">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-body-sm text-on-surface-variant italic">Nenhum item adicionado.</p>
              )}
            </div>

            <button type="submit" disabled={salvando || itens.length === 0} className="h-12 px-xl bg-primary text-on-primary text-label-md font-bold rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50">
              {salvando ? 'Salvando...' : '✓ Criar Exceção'}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="glass-card border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <h2 className="text-headline-md font-semibold text-on-surface">Exceções Cadastradas</h2>
            <span className="px-sm py-xs rounded-full bg-surface-container text-on-surface-variant text-label-md font-semibold border border-outline-variant/30">
              {excecoes.length} {excecoes.length === 1 ? 'exceção' : 'exceções'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-2xl"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-2xl text-on-surface-variant">
            <span className="material-symbols-outlined text-7xl opacity-20 mb-md">receipt_long</span>
            <p className="text-body-md">{busca ? 'Nenhuma exceção encontrada' : 'Nenhuma exceção cadastrada'}</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/30">
            {filtradas.map(exc => {
              const aberto = expandido === exc.id;
              return (
                <div key={exc.id}>
                  <button onClick={() => setExpandido(aberto ? null : exc.id)} className="w-full flex items-center justify-between px-xl py-lg hover:bg-surface-container-low transition-colors text-left">
                    <div className="flex items-center gap-md">
                      <span className="px-md py-xs bg-primary-container/20 text-primary rounded-lg text-label-md font-bold font-geist-mono">CFOP {exc.naturezao_operacao}</span>
                      <div>
                        <p className="text-label-md font-semibold text-on-surface">{exc.descricao}</p>
                        <p className="text-body-sm text-on-surface-variant">🏪 {exc.loja}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-sm">
                      <div className="flex gap-xs">
                        {(exc.excecaoImpostoItem ?? []).map((item, i) => {
                          const info = tipoInfo(item.tipo);
                          return (
                            <span key={i} className={`px-sm py-xs rounded-full text-[11px] font-bold border ${info.color}`}>{info.label}</span>
                          );
                        })}
                      </div>
                      <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${aberto ? 'rotate-90' : ''}`}>chevron_right</span>
                    </div>
                  </button>

                  {aberto && (
                    <div className="px-xl pb-lg bg-surface-container-low border-t border-outline-variant">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-md pt-lg mb-lg">
                        {[['ID', `#${exc.id}`, true], ['CFOP', exc.naturezao_operacao, true], ['Descrição', exc.descricao], ['Loja', exc.loja]].map(([l, v, mono]) => (
                          <div key={l} className="p-sm bg-surface rounded-lg border border-outline-variant/30">
                            <span className="text-[12px] font-bold text-on-surface-variant block mb-xs">{l}</span>
                            <span className={`text-body-sm font-semibold ${mono ? 'font-geist-mono' : ''}`}>{v || '—'}</span>
                          </div>
                        ))}
                      </div>

                      {(exc.excecaoImpostoItem ?? []).length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-outline-variant">
                          <table className="w-full text-left">
                            <thead className="bg-surface-container-low border-b border-outline-variant">
                              <tr>{['Imposto', 'Alíquota', 'Redução Base'].map(h => <th key={h} className="px-md py-sm text-label-md font-bold text-on-surface-variant">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30">
                              {exc.excecaoImpostoItem.map((item, i) => {
                                const info = tipoInfo(item.tipo);
                                return (
                                  <tr key={i} className="hover:bg-surface-container-lowest transition-colors">
                                    <td className="px-md py-md"><span className={`px-sm py-xs rounded-full text-[11px] font-bold border ${info.color}`}>{info.label}</span></td>
                                    <td className="px-md py-md font-bold">{item.aliquota}%</td>
                                    <td className="px-md py-md">{item.reducaoBase > 0 ? <span className="text-error font-semibold">{item.reducaoBase}%</span> : <span className="text-on-surface-variant">—</span>}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-body-sm text-on-surface-variant italic">Sem itens de imposto.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
