import { useState, useEffect } from 'react';
import { produtoService } from '../api/produtoService';
import { showAlert } from '../components/Alert';
import { temPerfil } from '../api/authUtils';

const FORM_INICIAL = {
  descricao: '',
  codigoBarra: '',
  sku: '',
  precoVenda: '',
  custo: '',
};

export default function Produtos() {
  const [produtos, setProdutos]           = useState([]);
  const [form, setForm]                   = useState(FORM_INICIAL);
  const [loading, setLoading]             = useState(true);
  const [salvando, setSalvando]           = useState(false);
  const [busca, setBusca]                 = useState('');
  const [mostrarForm, setMostrarForm]     = useState(false);
  const [modalInativar, setModalInativar] = useState(null); // { id, descricao }
  const [inativando, setInativando]       = useState(false);

  const podeCadastrar = temPerfil('GERENTE', 'ADMIN', 'MATRIZ');

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await produtoService.listarProdutos();
      setProdutos(data || []);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCriar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await produtoService.criarProduto({
        descricao:   form.descricao,
        codigoBarra: form.codigoBarra,
        sku:         form.sku,
        precoVenda:  parseFloat(form.precoVenda),
        custo:       parseFloat(form.custo),
      });
      showAlert(`"${form.descricao}" cadastrado com sucesso!`, 'success');
      setForm(FORM_INICIAL);
      setMostrarForm(false);
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao cadastrar produto', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const handleInativar = async () => {
    if (!modalInativar?.id) return;
    setInativando(true);
    try {
      await produtoService.inativarProduto(modalInativar.id);
      // Atualiza o estado local imediatamente, sem depender do re-fetch
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === modalInativar.id ? { ...p, inativo: true } : p
        )
      );
      showAlert(`"${modalInativar.descricao}" inativado com sucesso.`, 'success');
      setModalInativar(null);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao inativar produto', 'error');
    } finally {
      setInativando(false);
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo_barra?.toLowerCase().includes(busca.toLowerCase()) ||
    p.sku?.toLowerCase().includes(busca.toLowerCase())
  );

  const fmt = (v) =>
    Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const margem = (venda, custo) => {
    if (!custo || custo === 0) return null;
    return (((venda - custo) / custo) * 100).toFixed(1);
  };

  return (
    <>
      <div className="prod-container">

        {/* ── Cabeçalho ── */}
        <div className="prod-header">
          <div>
            <h1 className="prod-title">🏷️ Produtos</h1>
            <p className="prod-subtitle">Catálogo de produtos disponíveis no PDV</p>
          </div>
          {podeCadastrar && (
            <button
              className="prod-btn-novo"
              onClick={() => setMostrarForm((v) => !v)}
            >
              {mostrarForm ? '✕ Cancelar' : '+ Novo Produto'}
            </button>
          )}
        </div>

        {/* ── Formulário de cadastro ── */}
        {mostrarForm && podeCadastrar && (
          <div className="prod-form-card">
            <h2 className="prod-section-title">Cadastrar Novo Produto</h2>
            <form onSubmit={handleCriar} className="prod-form">

              <div className="prod-form-grid">
                <div className="prod-field prod-field-wide">
                  <label>Descrição</label>
                  <input
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    placeholder="Ex: Camiseta Básica Branca M"
                    required
                    disabled={salvando}
                  />
                </div>

                <div className="prod-field">
                  <label>Código de Barras</label>
                  <input
                    name="codigoBarra"
                    value={form.codigoBarra}
                    onChange={handleChange}
                    placeholder="7891234567890"
                    required
                    disabled={salvando}
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div className="prod-field">
                  <label>SKU</label>
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="CAM-BR-M-001"
                    required
                    disabled={salvando}
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div className="prod-field">
                  <label>Preço de Venda (R$)</label>
                  <input
                    name="precoVenda"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.precoVenda}
                    onChange={handleChange}
                    placeholder="0,00"
                    required
                    disabled={salvando}
                  />
                </div>

                <div className="prod-field">
                  <label>Custo (R$)</label>
                  <input
                    name="custo"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.custo}
                    onChange={handleChange}
                    placeholder="0,00"
                    required
                    disabled={salvando}
                  />
                </div>
              </div>

              {/* Preview de margem */}
              {form.precoVenda && form.custo && (
                <div className="prod-margem-preview">
                  <span>Margem estimada:</span>
                  <strong style={{ color: margem(form.precoVenda, form.custo) > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {margem(form.precoVenda, form.custo)}%
                  </strong>
                </div>
              )}

              <div className="prod-form-actions">
                <button type="submit" className="prod-btn-salvar" disabled={salvando}>
                  {salvando ? '⏳ Salvando...' : '✓ Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Lista ── */}
        <div className="prod-list-card">
          <div className="prod-list-header">
            <div className="prod-list-info">
              <h2 className="prod-section-title">Catálogo</h2>
              <span className="prod-count">{produtos.length} produto{produtos.length !== 1 ? 's' : ''}</span>
            </div>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="🔍 Buscar por nome, código ou SKU..."
              className="prod-busca"
            />
          </div>

          {loading ? (
            <div className="prod-loading">
              <div className="loading-spinner" />
              <p>Carregando produtos...</p>
            </div>
          ) : produtosFiltrados.length === 0 ? (
            <div className="prod-empty">
              <span>🏷️</span>
              <p>{busca ? 'Nenhum produto encontrado para essa busca' : 'Nenhum produto cadastrado'}</p>
              {!busca && <p className="prod-empty-sub">Clique em "+ Novo Produto" para começar</p>}
            </div>
          ) : (
            <div className="prod-table-wrapper">
              <table className="prod-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Código de Barras</th>
                    <th>SKU</th>
                    <th>Custo</th>
                    <th>Preço Venda</th>
                    <th>Margem</th>
                    <th>Status</th>
                    {podeCadastrar && <th>Ação</th>}
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((p, idx) => {
                    const mg = margem(p.preco_venda, p.custo);
                    const ativo = p.inativo !== true;
                    return (
                      <tr key={p.id ?? idx} className={!ativo ? 'prod-row-inativa' : ''}>
                        <td>
                          <div className="prod-nome-cell">
                            <span className="prod-nome">{p.descricao}</span>
                          </div>
                        </td>
                        <td>
                          <span className="prod-mono">{p.codigo_barra}</span>
                        </td>
                        <td>
                          <span className="prod-mono prod-sku">{p.sku}</span>
                        </td>
                        <td>{fmt(p.custo)}</td>
                        <td><strong>{fmt(p.preco_venda)}</strong></td>
                        <td>
                          {mg !== null ? (
                            <span className={`prod-margem-badge ${parseFloat(mg) >= 0 ? 'positiva' : 'negativa'}`}>
                              {mg}%
                            </span>
                          ) : '—'}
                        </td>
                        <td>
                          <span className={`prod-status-badge ${ativo ? 'ativo' : 'inativo'}`}>
                            {ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        {podeCadastrar && (
                          <td>
                            {ativo ? (
                              <button
                                className="prod-btn-inativar"
                                onClick={() => setModalInativar({ id: p.id, descricao: p.descricao })}
                                title="Inativar produto"
                              >
                                Inativar
                              </button>
                            ) : (
                              <span className="prod-btn-disabled">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── Modal de confirmação de inativação ── */}
      {modalInativar && (
        <div className="mp-modal-overlay" onClick={() => !inativando && setModalInativar(null)}>
          <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mp-modal-icon">🚫</div>
            <h2 className="mp-modal-title">Inativar produto</h2>
            <p className="mp-modal-msg">
              Tem certeza que deseja inativar <strong>"{modalInativar.descricao}"</strong>?
              <br />
              <span className="mp-modal-warn">O produto não estará mais disponível para venda.</span>
            </p>
            <div className="mp-modal-actions">
              <button
                className="mp-modal-btn-cancel"
                onClick={() => setModalInativar(null)}
                disabled={inativando}
              >
                Cancelar
              </button>
              <button
                className="mp-modal-btn-confirm"
                onClick={handleInativar}
                disabled={inativando}
              >
                {inativando ? '⏳ Inativando...' : 'Sim, inativar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
