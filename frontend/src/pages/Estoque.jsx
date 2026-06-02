import { useState, useEffect, useMemo } from 'react';
import { estoqueService } from '../api/estoqueService';
import { showAlert } from '../components/Alert';

/* ─── helpers ─────────────────────────────────────────────── */
const NIVEL = {
  CRITICO:  { max: 5,   label: 'Crítico',  cls: 'est-nivel-critico'  },
  BAIXO:    { max: 20,  label: 'Baixo',    cls: 'est-nivel-baixo'    },
  NORMAL:   { max: 100, label: 'Normal',   cls: 'est-nivel-normal'   },
  ALTO:     { max: Infinity, label: 'Alto', cls: 'est-nivel-alto'   },
};

function nivelEstoque(qtd) {
  if (qtd <= NIVEL.CRITICO.max) return NIVEL.CRITICO;
  if (qtd <= NIVEL.BAIXO.max)   return NIVEL.BAIXO;
  if (qtd <= NIVEL.NORMAL.max)  return NIVEL.NORMAL;
  return NIVEL.ALTO;
}

const FILTROS_NIVEL = ['Todos', 'Crítico', 'Baixo', 'Normal', 'Alto'];
const ORDENACOES = [
  { value: 'nome_asc',  label: 'Nome A→Z' },
  { value: 'nome_desc', label: 'Nome Z→A' },
  { value: 'qtd_asc',   label: 'Qtd ↑' },
  { value: 'qtd_desc',  label: 'Qtd ↓' },
];

/* ─── componente ───────────────────────────────────────────── */
export default function Estoque() {
  const [itens, setItens]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [busca, setBusca]         = useState('');
  const [filtroNivel, setFiltroNivel] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('nome_asc');
  const [visualizacao, setVisualizacao] = useState('tabela'); // 'tabela' | 'cards'

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

  /* ── filtro + ordenação (memo para não recalcular a cada render) ── */
  const itensFiltrados = useMemo(() => {
    let lista = [...itens];

    // busca por nome, código de barra ou ID
    if (busca.trim()) {
      const b = busca.trim().toLowerCase();
      lista = lista.filter(
        (i) =>
          i.nome_produto?.toLowerCase().includes(b) ||
          i.codigo_barra?.toLowerCase().includes(b) ||
          String(i.id).includes(b),
      );
    }

    // filtro por nível
    if (filtroNivel !== 'Todos') {
      lista = lista.filter(
        (i) => nivelEstoque(i.quantidade_atual ?? 0).label === filtroNivel,
      );
    }

    // ordenação
    lista.sort((a, b) => {
      switch (ordenacao) {
        case 'nome_asc':  return (a.nome_produto ?? '').localeCompare(b.nome_produto ?? '');
        case 'nome_desc': return (b.nome_produto ?? '').localeCompare(a.nome_produto ?? '');
        case 'qtd_asc':   return (a.quantidade_atual ?? 0) - (b.quantidade_atual ?? 0);
        case 'qtd_desc':  return (b.quantidade_atual ?? 0) - (a.quantidade_atual ?? 0);
        default:          return 0;
      }
    });

    return lista;
  }, [itens, busca, filtroNivel, ordenacao]);

  /* ── contadores para os chips de nível ── */
  const contadores = useMemo(() => {
    const map = { Todos: itens.length, Crítico: 0, Baixo: 0, Normal: 0, Alto: 0 };
    itens.forEach((i) => {
      map[nivelEstoque(i.quantidade_atual ?? 0).label]++;
    });
    return map;
  }, [itens]);

  /* ── resumo do topo ── */
  const totalItens    = itens.length;
  const totalUnidades = itens.reduce((s, i) => s + (i.quantidade_atual ?? 0), 0);
  const itensCriticos = contadores['Crítico'];
  const itensBaixos   = contadores['Baixo'];

  return (
    <div className="est-wrapper">

      {/* ══ Cabeçalho ══════════════════════════════════════ */}
      <div className="est-page-header">
        <div>
          <h1 className="est-page-title">
            <span>📦</span> Estoque
          </h1>
          <p className="est-page-sub">Produtos disponíveis na sua loja</p>
        </div>
        <button className="est-btn-refresh" onClick={carregar} disabled={loading} title="Atualizar">
          <span className={loading ? 'est-spin' : ''}>🔄</span>
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      {/* ══ Cards de resumo ════════════════════════════════ */}
      <div className="est-summary-grid">
        <div className="est-summary-card est-sum-blue">
          <div className="est-sum-icon">🏷️</div>
          <div>
            <p className="est-sum-label">Produtos cadastrados</p>
            <p className="est-sum-val">{totalItens}</p>
          </div>
        </div>
        <div className="est-summary-card est-sum-green">
          <div className="est-sum-icon">📊</div>
          <div>
            <p className="est-sum-label">Total de unidades</p>
            <p className="est-sum-val">{totalUnidades.toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <div className="est-summary-card est-sum-orange">
          <div className="est-sum-icon">⚠️</div>
          <div>
            <p className="est-sum-label">Estoque baixo</p>
            <p className="est-sum-val">{itensBaixos}</p>
          </div>
        </div>
        <div className="est-summary-card est-sum-red">
          <div className="est-sum-icon">🚨</div>
          <div>
            <p className="est-sum-label">Estoque crítico</p>
            <p className="est-sum-val">{itensCriticos}</p>
          </div>
        </div>
      </div>

      {/* ══ Painel de filtros ══════════════════════════════ */}
      <div className="est-filters-panel">

        {/* Busca */}
        <div className="est-search-wrap">
          <span className="est-search-icon">🔍</span>
          <input
            className="est-search"
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, código de barras ou ID..."
          />
          {busca && (
            <button className="est-clear-btn" onClick={() => setBusca('')} title="Limpar busca">
              ✕
            </button>
          )}
        </div>

        {/* Controles secundários */}
        <div className="est-controls-row">
          {/* Chips de nível */}
          <div className="est-nivel-chips">
            {FILTROS_NIVEL.map((n) => (
              <button
                key={n}
                className={`est-chip ${filtroNivel === n ? 'ativo' : ''} est-chip-${n.toLowerCase()}`}
                onClick={() => setFiltroNivel(n)}
              >
                {n}
                <span className="est-chip-count">{contadores[n] ?? 0}</span>
              </button>
            ))}
          </div>

          {/* Ordenação + visualização */}
          <div className="est-right-controls">
            <select
              className="est-select"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              {ORDENACOES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div className="est-view-toggle">
              <button
                className={`est-view-btn ${visualizacao === 'tabela' ? 'ativo' : ''}`}
                onClick={() => setVisualizacao('tabela')}
                title="Visualização em tabela"
              >☰</button>
              <button
                className={`est-view-btn ${visualizacao === 'cards' ? 'ativo' : ''}`}
                onClick={() => setVisualizacao('cards')}
                title="Visualização em cards"
              >⊞</button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Resultado + contagem ═══════════════════════════ */}
      {!loading && (
        <div className="est-result-bar">
          <span>
            {itensFiltrados.length === itens.length
              ? `${itens.length} produto${itens.length !== 1 ? 's' : ''}`
              : `${itensFiltrados.length} de ${itens.length} produto${itens.length !== 1 ? 's' : ''}`}
          </span>
          {(busca || filtroNivel !== 'Todos') && (
            <button
              className="est-clear-filters"
              onClick={() => { setBusca(''); setFiltroNivel('Todos'); }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* ══ Conteúdo ═══════════════════════════════════════ */}
      {loading ? (
        <div className="est-loading">
          <div className="loading-spinner" />
          <p>Carregando estoque...</p>
        </div>
      ) : itensFiltrados.length === 0 ? (
        <div className="est-empty">
          <span className="est-empty-icon">📭</span>
          <p className="est-empty-title">
            {busca || filtroNivel !== 'Todos'
              ? 'Nenhum produto encontrado'
              : 'Estoque vazio'}
          </p>
          <p className="est-empty-sub">
            {busca || filtroNivel !== 'Todos'
              ? 'Tente ajustar os filtros de busca'
              : 'Nenhum item registrado no estoque ainda'}
          </p>
        </div>
      ) : visualizacao === 'tabela' ? (
        /* ── Tabela ── */
        <div className="est-table-wrap">
          <table className="est-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Produto</th>
                <th>Código de Barras</th>
                <th>Loja</th>
                <th>Quantidade</th>
                <th>Nível</th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => {
                const nivel = nivelEstoque(item.quantidade_atual ?? 0);
                return (
                  <tr key={item.id} className="est-tr">
                    <td className="est-td-id">{item.id}</td>
                    <td>
                      <span className="est-nome">{item.nome_produto}</span>
                    </td>
                    <td>
                      <span className="est-barcode">{item.codigo_barra ?? '—'}</span>
                    </td>
                    <td>
                      <span className="est-loja">{item.nome_loja}</span>
                    </td>
                    <td>
                      <div className="est-qtd-cell">
                        <span className="est-qtd-num">{item.quantidade_atual ?? 0}</span>
                        <div className="est-qtd-bar-bg">
                          <div
                            className={`est-qtd-bar-fill ${nivel.cls}`}
                            style={{ width: `${Math.min((item.quantidade_atual ?? 0) / 100 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`est-nivel-badge ${nivel.cls}`}>
                        {nivel.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── Cards ── */
        <div className="est-cards-grid">
          {itensFiltrados.map((item) => {
            const nivel = nivelEstoque(item.quantidade_atual ?? 0);
            const pct   = Math.min((item.quantidade_atual ?? 0) / 100 * 100, 100);
            return (
              <div key={item.id} className={`est-item-card ${nivel.cls}-card`}>
                <div className="est-item-card-top">
                  <span className="est-item-id">#{item.id}</span>
                  <span className={`est-nivel-badge ${nivel.cls}`}>{nivel.label}</span>
                </div>
                <p className="est-item-nome">{item.nome_produto}</p>
                <p className="est-item-loja">🏪 {item.nome_loja}</p>
                {item.codigo_barra && (
                  <p className="est-item-barcode">
                    <span className="est-barcode-icon">▌▌▌</span>
                    {item.codigo_barra}
                  </p>
                )}
                <div className="est-item-footer">
                  <div className="est-item-qtd-wrap">
                    <span className="est-item-qtd-num">{item.quantidade_atual ?? 0}</span>
                    <span className="est-item-qtd-label">unidades</span>
                  </div>
                  <div className="est-item-bar-bg">
                    <div
                      className={`est-item-bar-fill ${nivel.cls}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
