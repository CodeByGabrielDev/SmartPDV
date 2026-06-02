import { useState, useEffect } from 'react';
import { excecaoImpostoService } from '../api/excecaoImpostoService';
import { showAlert } from '../components/Alert';

/* ─── constantes ──────────────────────────────────────────── */
// value = ordinal do enum Java (0-based): ICMS=0, PIS=1, COFINS=2, IPI=3, IBS=4, CBS=5
const TIPOS_IMPOSTO = [
  { value: 0, label: 'ICMS',   cor: 'exc-tipo-icms'   },
  { value: 1, label: 'PIS',    cor: 'exc-tipo-pis'    },
  { value: 2, label: 'COFINS', cor: 'exc-tipo-cofins' },
  { value: 3, label: 'IPI',    cor: 'exc-tipo-ipi'    },
  { value: 4, label: 'IBS',    cor: 'exc-tipo-ibs'    },
  { value: 5, label: 'CBS',    cor: 'exc-tipo-cbs'    },
];

const FORM_INICIAL = { naturezao_operacao: '', descricao: '' };
const ITEM_INICIAL = { tipo: 0, aliquota: '', reducao_Base: '' };

function tipoLabel(val) {
  // val pode ser número (ordinal, usado no form) ou string com nome do enum (vindo da API)
  if (typeof val === 'string') {
    const found = TIPOS_IMPOSTO.find((t) => t.label === val);
    return found?.label ?? val;
  }
  return TIPOS_IMPOSTO.find((t) => t.value === parseInt(val))?.label ?? val;
}
function tipoCor(val) {
  if (typeof val === 'string') {
    const found = TIPOS_IMPOSTO.find((t) => t.label === val);
    return found?.cor ?? '';
  }
  return TIPOS_IMPOSTO.find((t) => t.value === parseInt(val))?.cor ?? '';
}

/* ─── componente ───────────────────────────────────────────── */
export default function ExcecaoImposto() {
  const [excecoes, setExcecoes]         = useState([]);
  const [loadingLista, setLoadingLista] = useState(true);
  const [salvando, setSalvando]         = useState(false);
  const [mostrarForm, setMostrarForm]   = useState(false);
  const [expandido, setExpandido]       = useState(null); // id da exceção expandida
  const [busca, setBusca]               = useState('');

  // form
  const [form, setForm]   = useState(FORM_INICIAL);
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState(ITEM_INICIAL);

  useEffect(() => { carregar(); }, []);

  /* ── carregar lista ── */
  const carregar = async () => {
    setLoadingLista(true);
    try {
      const data = await excecaoImpostoService.listarExcecoes();
      setExcecoes(data || []);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao carregar exceções', 'error');
    } finally {
      setLoadingLista(false);
    }
  };

  /* ── form helpers ── */
  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarItem = () => {
    if (!novoItem.aliquota) {
      showAlert('Informe a alíquota', 'error');
      return;
    }
    // impede duplicar o mesmo tipo
    if (itens.some((i) => parseInt(i.tipo) === parseInt(novoItem.tipo))) {
      showAlert(`Já existe um item do tipo ${tipoLabel(novoItem.tipo)} nessa exceção`, 'error');
      return;
    }
    setItens((prev) => [...prev, { ...novoItem }]);
    setNovoItem(ITEM_INICIAL);
  };

  const removerItem = (idx) => setItens((prev) => prev.filter((_, i) => i !== idx));

  /* ── criar exceção ── */
  const criarExcecao = async (e) => {
    e.preventDefault();
    if (!form.naturezao_operacao) { showAlert('Informe o CFOP', 'error'); return; }
    if (!form.descricao.trim())   { showAlert('Informe a descrição', 'error'); return; }
    if (itens.length === 0)       { showAlert('Adicione pelo menos um item de imposto', 'error'); return; }

    setSalvando(true);
    try {
      await excecaoImpostoService.criarExcecaoImposto({
        naturezao_operacao: parseInt(form.naturezao_operacao),
        descricao: form.descricao.trim(),
        itens: itens.map((i) => ({
          tipo:        parseInt(i.tipo),
          aliquota:    parseFloat(i.aliquota),
          reducao_Base: parseFloat(i.reducao_Base) || 0,
        })),
      });
      showAlert('Exceção criada com sucesso!', 'success');
      setForm(FORM_INICIAL);
      setItens([]);
      setMostrarForm(false);
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao criar exceção', 'error');
    } finally {
      setSalvando(false);
    }
  };

  /* ── lista filtrada ── */
  const excecoesFiltradas = excecoes.filter((e) => {
    const q = busca.toLowerCase();
    return (
      String(e.naturezao_operacao).includes(q) ||
      e.descricao?.toLowerCase().includes(q) ||
      e.loja?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="exc-wrapper">

      {/* ══ Cabeçalho ══════════════════════════════════════════ */}
      <div className="exc-page-header">
        <div>
          <h1 className="exc-page-title"><span>📊</span> Exceções de Imposto</h1>
          <p className="exc-page-sub">Regras de tributação por natureza de operação (CFOP)</p>
        </div>
        <button
          className={`exc-btn-nova ${mostrarForm ? 'cancelar' : ''}`}
          onClick={() => { setMostrarForm((v) => !v); setItens([]); setForm(FORM_INICIAL); }}
        >
          {mostrarForm ? '✕ Cancelar' : '+ Nova Exceção'}
        </button>
      </div>

      {/* ══ Formulário de criação ═══════════════════════════════ */}
      {mostrarForm && (
        <div className="exc-form-card">
          <h2 className="exc-section-title">Nova Exceção de Imposto</h2>

          <form onSubmit={criarExcecao}>
            {/* Dados principais */}
            <div className="exc-form-grid">
              <div className="exc-field">
                <label>CFOP <span className="exc-required">*</span></label>
                <input
                  name="naturezao_operacao"
                  type="number"
                  value={form.naturezao_operacao}
                  onChange={handleForm}
                  placeholder="Ex: 5101"
                  disabled={salvando}
                />
              </div>
              <div className="exc-field exc-field-wide">
                <label>Descrição <span className="exc-required">*</span></label>
                <input
                  name="descricao"
                  type="text"
                  value={form.descricao}
                  onChange={handleForm}
                  placeholder="Ex: Venda de mercadoria industrializada"
                  disabled={salvando}
                />
              </div>
            </div>

            {/* Adicionador de itens */}
            <div className="exc-itens-section">
              <h3 className="exc-itens-title">Itens de Imposto</h3>

              <div className="exc-item-add-row">
                <div className="exc-field">
                  <label>Tipo</label>
                  <select
                    value={novoItem.tipo}
                    onChange={(e) => setNovoItem((p) => ({ ...p, tipo: parseInt(e.target.value) }))}
                    disabled={salvando}
                  >
                    {TIPOS_IMPOSTO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="exc-field">
                  <label>Alíquota (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={novoItem.aliquota}
                    onChange={(e) => setNovoItem((p) => ({ ...p, aliquota: e.target.value }))}
                    placeholder="Ex: 18"
                    disabled={salvando}
                  />
                </div>
                <div className="exc-field">
                  <label>Redução Base (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={novoItem.reducao_Base}
                    onChange={(e) => setNovoItem((p) => ({ ...p, reducao_Base: e.target.value }))}
                    placeholder="Ex: 0"
                    disabled={salvando}
                  />
                </div>
                <button
                  type="button"
                  className="exc-btn-add-item"
                  onClick={adicionarItem}
                  disabled={salvando}
                >
                  ➕ Adicionar
                </button>
              </div>

              {/* Tabela de itens adicionados */}
              {itens.length > 0 && (
                <div className="exc-itens-preview">
                  {itens.map((item, idx) => (
                    <div key={idx} className="exc-item-chip">
                      <span className={`exc-tipo-badge ${tipoCor(item.tipo)}`}>
                        {tipoLabel(item.tipo)}
                      </span>
                      <span className="exc-item-aliq">{item.aliquota}%</span>
                      {parseFloat(item.reducao_Base) > 0 && (
                        <span className="exc-item-red">Red. {item.reducao_Base}%</span>
                      )}
                      <button
                        type="button"
                        className="exc-item-remove"
                        onClick={() => removerItem(idx)}
                        disabled={salvando}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              {itens.length === 0 && (
                <p className="exc-itens-empty">Nenhum item adicionado. Selecione o tipo e alíquota acima.</p>
              )}
            </div>

            {/* Ações */}
            <div className="exc-form-actions">
              <button type="submit" className="exc-btn-salvar" disabled={salvando || itens.length === 0}>
                {salvando
                  ? <><span className="exc-spinner" /> Salvando...</>
                  : '✓ Criar Exceção'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ══ Lista de exceções ═══════════════════════════════════ */}
      <div className="exc-lista-card">
        <div className="exc-lista-header">
          <div className="exc-lista-info">
            <h2 className="exc-section-title">Exceções cadastradas</h2>
            <span className="exc-count">{excecoes.length} exceção{excecoes.length !== 1 ? 'ões' : ''}</span>
          </div>
          <div className="exc-search-wrap">
            <span className="exc-search-icon">🔍</span>
            <input
              className="exc-search"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por CFOP, descrição ou loja..."
            />
            {busca && (
              <button className="exc-clear-btn" onClick={() => setBusca('')}>✕</button>
            )}
          </div>
        </div>

        {/* Conteúdo da lista */}
        {loadingLista ? (
          <div className="exc-loading">
            <div className="loading-spinner" />
            <p>Carregando exceções...</p>
          </div>
        ) : excecoesFiltradas.length === 0 ? (
          <div className="exc-empty">
            <span className="exc-empty-icon">📭</span>
            <p className="exc-empty-title">
              {busca ? 'Nenhuma exceção encontrada' : 'Nenhuma exceção cadastrada'}
            </p>
            <p className="exc-empty-sub">
              {busca
                ? 'Tente ajustar o termo de busca'
                : 'Clique em "+ Nova Exceção" para criar a primeira regra'}
            </p>
          </div>
        ) : (
          <div className="exc-list">
            {excecoesFiltradas.map((exc) => {
              const aberto = expandido === exc.id;
              return (
                <div key={exc.id} className={`exc-row ${aberto ? 'aberto' : ''}`}>
                  {/* Linha principal — clicável para expandir */}
                  <button
                    className="exc-row-header"
                    onClick={() => setExpandido(aberto ? null : exc.id)}
                  >
                    <div className="exc-row-left">
                      <span className="exc-cfop-badge">CFOP {exc.naturezao_operacao}</span>
                      <div className="exc-row-info">
                        <span className="exc-row-desc">{exc.descricao}</span>
                        <span className="exc-row-loja">🏪 {exc.loja}</span>
                      </div>
                    </div>
                    <div className="exc-row-right">
                      <div className="exc-tipos-mini">
                        {(exc.excecaoImpostoItem ?? []).map((item, i) => (
                          <span key={i} className={`exc-tipo-badge ${tipoCor(item.tipo)}`}>
                            {tipoLabel(item.tipo)}
                          </span>
                        ))}
                      </div>
                      <span className={`exc-chevron ${aberto ? 'up' : ''}`}>›</span>
                    </div>
                  </button>

                  {/* Detalhes expandidos */}
                  {aberto && (
                    <div className="exc-row-detail">
                      <div className="exc-detail-grid">
                        <div className="exc-detail-item">
                          <span className="exc-detail-label">ID</span>
                          <span className="exc-detail-val exc-mono">#{exc.id}</span>
                        </div>
                        <div className="exc-detail-item">
                          <span className="exc-detail-label">CFOP</span>
                          <span className="exc-detail-val">{exc.naturezao_operacao}</span>
                        </div>
                        <div className="exc-detail-item">
                          <span className="exc-detail-label">Descrição</span>
                          <span className="exc-detail-val">{exc.descricao}</span>
                        </div>
                        <div className="exc-detail-item">
                          <span className="exc-detail-label">Loja</span>
                          <span className="exc-detail-val">{exc.loja}</span>
                        </div>
                      </div>

                      {/* Tabela de itens */}
                      {(exc.excecaoImpostoItem ?? []).length > 0 ? (
                        <div className="exc-detail-table-wrap">
                          <table className="exc-detail-table">
                            <thead>
                              <tr>
                                <th>Imposto</th>
                                <th>Alíquota</th>
                                <th>Redução Base</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exc.excecaoImpostoItem.map((item, i) => (
                                <tr key={i}>
                                  <td>
                                    <span className={`exc-tipo-badge ${tipoCor(item.tipo)}`}>
                                      {tipoLabel(item.tipo)}
                                    </span>
                                  </td>
                                  <td>
                                    <strong>{item.aliquota}%</strong>
                                  </td>
                                  <td>
                                    {item.reducaoBase > 0
                                      ? <span className="exc-red-val">{item.reducaoBase}%</span>
                                      : <span className="exc-zero">—</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="exc-detail-no-items">Sem itens de imposto cadastrados.</p>
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
