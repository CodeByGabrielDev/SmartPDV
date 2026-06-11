import { useState, useEffect, useMemo } from 'react';
import { estoqueService } from '../api/estoqueService';
import { showAlert } from '../components/Alert';

function nivelInfo(qtd) {
  if (qtd <= 5)  return { label: 'Crítico', color: 'text-error bg-error-container/30 border-error/30', bar: 'bg-error', badge: 'bg-error text-white' };
  if (qtd <= 20) return { label: 'Baixo',   color: 'text-yellow-700 bg-yellow-50 border-yellow-300', bar: 'bg-yellow-500', badge: 'bg-yellow-500 text-white' };
  if (qtd <= 100)return { label: 'Normal',  color: 'text-emerald-700 bg-emerald-50 border-emerald-300', bar: 'bg-emerald-500', badge: 'bg-emerald-500 text-white' };
  return { label: 'Alto', color: 'text-primary bg-primary-container/20 border-primary/20', bar: 'bg-primary', badge: 'bg-primary text-on-primary' };
}

const FILTROS = ['Todos', 'Crítico', 'Baixo', 'Normal', 'Alto'];

export default function Estoque() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [visualizacao, setVisualizacao] = useState('cards');

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await estoqueService.listarEstoque();
      setItens(data || []);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao carregar estoque', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtrados = useMemo(() => {
    let lista = [...itens];
    if (busca.trim()) {
      const b = busca.toLowerCase();
      lista = lista.filter(i => i.nome_produto?.toLowerCase().includes(b) || i.codigo_barra?.toLowerCase().includes(b) || String(i.id).includes(b));
    }
    if (filtro !== 'Todos') lista = lista.filter(i => nivelInfo(i.quantidade_atual ?? 0).label === filtro);
    return lista;
  }, [itens, busca, filtro]);

  const contadores = useMemo(() => {
    const m = { Todos: itens.length, Crítico: 0, Baixo: 0, Normal: 0, Alto: 0 };
    itens.forEach(i => { m[nivelInfo(i.quantidade_atual ?? 0).label]++; });
    return m;
  }, [itens]);

  const totalUnidades = itens.reduce((s, i) => s + (i.quantidade_atual ?? 0), 0);

  return (
    <section className="p-xl space-y-xl max-w-7xl mx-auto w-full">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">Estoque</h1>
          <p className="text-body-sm text-on-surface-variant mt-xs">
            {itens.length} produto{itens.length !== 1 ? 's' : ''} · {totalUnidades.toLocaleString('pt-BR')} unidades totais
          </p>
        </div>
        <button onClick={carregar} className="flex items-center gap-sm px-md py-sm bg-surface-container border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container-high transition-all min-h-[44px]">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Atualizar
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {[
          { icon: 'inventory_2', label: 'Total de Produtos', value: itens.length, sub: 'MENSAL', iconCls: 'text-primary' },
          { icon: 'warehouse',   label: 'Estoque Total',     value: totalUnidades.toLocaleString('pt-BR'), sub: 'UNIDADES', iconCls: 'text-secondary' },
          { icon: 'warning',     label: 'Estoque Baixo',     value: contadores['Baixo'], sub: 'AVISO', iconCls: 'text-yellow-600', border: 'border-l-4 border-yellow-500' },
          { icon: 'error',       label: 'Estoque Crítico',   value: contadores['Crítico'], sub: 'URGENTE', iconCls: 'text-error', border: 'border-l-4 border-error', pulse: true },
        ].map(({ icon, label, value, sub, iconCls, border, pulse }) => (
          <div key={label} className={`glass-card rounded-xl p-lg flex flex-col gap-xs hover:shadow-lg transition-shadow ${border || ''} ${pulse && contadores['Crítico'] > 0 ? 'animate-pulse' : ''}`}>
            <div className="flex justify-between items-start">
              <span className="p-sm bg-surface-container rounded-lg">
                <span className={`material-symbols-outlined ${iconCls}`}>{icon}</span>
              </span>
              <span className="text-mono-label font-geist-mono text-on-surface-variant">{sub}</span>
            </div>
            <span className="text-headline-lg font-semibold text-on-surface">{value}</span>
            <span className="text-label-md font-semibold text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-lg justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-sm items-center">
          <div className="relative w-full md:w-80 group">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome, SKU ou ID..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-12 pr-md py-sm text-body-md focus:border-primary transition-all outline-none"
            />
          </div>
          <div className="h-8 w-px bg-outline-variant mx-sm hidden md:block" />
          {FILTROS.map(f => {
            const active = filtro === f;
            const colors = {
              Crítico: active ? 'bg-error text-white' : 'bg-error/10 text-error border-error/20',
              Baixo:   active ? 'bg-yellow-500 text-white' : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
              Normal:  active ? 'bg-primary text-on-primary' : 'bg-primary-container/10 text-primary border-primary/20',
              Alto:    active ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700 border-emerald-200',
              Todos:   active ? 'bg-secondary text-on-secondary' : 'bg-secondary-container/50 text-secondary border-outline-variant',
            };
            return (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-md py-sm rounded-full text-label-md font-semibold border transition-colors ${colors[f]}`}
              >
                {f} <span className="ml-xs opacity-70">({contadores[f] ?? 0})</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-sm bg-surface-container-low p-1 rounded-xl border border-outline-variant">
          <button
            onClick={() => setVisualizacao('cards')}
            className={`p-sm rounded-lg transition-all ${visualizacao === 'cards' ? 'bg-surface-container-highest shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            title="Ver como Grade"
          >
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button
            onClick={() => setVisualizacao('tabela')}
            className={`p-sm rounded-lg transition-all ${visualizacao === 'tabela' ? 'bg-surface-container-highest shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            title="Ver como Tabela"
          >
            <span className="material-symbols-outlined">format_list_bulleted</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-2xl">
          <div className="flex flex-col items-center gap-md text-on-surface-variant">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-body-md">Carregando estoque...</p>
          </div>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-2xl gap-lg">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-50">inventory_2</span>
          </div>
          <div className="text-center">
            <p className="text-label-md font-semibold text-on-surface">Nenhum produto encontrado</p>
            <p className="text-body-sm text-on-surface-variant mt-xs">Tente ajustar os filtros ou a busca</p>
          </div>
        </div>
      ) : visualizacao === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {filtrados.map(item => {
            const nivel = nivelInfo(item.quantidade_atual ?? 0);
            const pct = Math.min((item.quantidade_atual ?? 0) / 100 * 100, 100);
            return (
              <div key={item.id} className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-outline opacity-20">inventory_2</span>
                  <div className="absolute top-md right-md">
                    <span className={`text-[10px] font-bold px-sm py-xs rounded-full uppercase tracking-widest shadow-lg ${nivel.badge}`}>
                      {nivel.label}
                    </span>
                  </div>
                </div>
                <div className="p-md space-y-md">
                  <div>
                    <h3 className="text-label-md font-semibold text-on-surface truncate">{item.nome_produto}</h3>
                    <p className="text-[12px] text-on-surface-variant font-geist-mono">{item.codigo_barra || `ID: ${item.id}`}</p>
                  </div>
                  <div className="space-y-xs">
                    <div className="flex justify-between items-end">
                      <span className="text-body-sm text-on-surface-variant">
                        Qtd: <strong className={nivel.color.split(' ')[0]}>{item.quantidade_atual ?? 0}</strong>
                      </span>
                      <span className={`text-[12px] font-geist-mono ${nivel.color.split(' ')[0]}`}>{Math.round(pct)}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className={`stock-progress-bar h-full ${nivel.bar}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-xs">
                    <span className="text-body-sm text-on-surface-variant">🏪 {item.nome_loja}</span>
                    <button className="p-sm bg-primary-container/10 text-primary rounded-lg hover:bg-primary-container hover:text-white transition-colors">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  {['#', 'Produto', 'Código de Barras', 'Loja', 'Quantidade', 'Nível'].map(h => (
                    <th key={h} className="px-md py-lg text-[14px] font-bold text-on-surface-variant tracking-wider uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filtrados.map(item => {
                  const nivel = nivelInfo(item.quantidade_atual ?? 0);
                  const pct = Math.min((item.quantidade_atual ?? 0) / 100 * 100, 100);
                  return (
                    <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-md py-md text-mono-label font-geist-mono text-on-surface-variant">#{item.id}</td>
                      <td className="px-md py-md text-label-md font-semibold text-on-surface">{item.nome_produto}</td>
                      <td className="px-md py-md font-geist-mono text-mono-label text-on-surface-variant">{item.codigo_barra || '—'}</td>
                      <td className="px-md py-md text-body-sm text-on-surface-variant">{item.nome_loja}</td>
                      <td className="px-md py-md">
                        <div className="flex items-center gap-sm">
                          <span className={`font-semibold ${nivel.color.split(' ')[0]}`}>{item.quantidade_atual ?? 0}</span>
                          <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden min-w-[60px]">
                            <div className={`stock-progress-bar h-full ${nivel.bar}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-md py-md">
                        <span className={`px-sm py-xs rounded-full text-[11px] font-bold ${nivel.badge}`}>{nivel.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAB */}
      <button className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined">add</span>
        <span className="absolute right-16 bg-on-surface text-white px-md py-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-label-md font-semibold">
          Novo Produto
        </span>
      </button>
    </section>
  );
}
