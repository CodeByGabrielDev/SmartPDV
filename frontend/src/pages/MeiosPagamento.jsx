import { useState, useEffect } from 'react';
import { pagamentoService } from '../api/pagamentoService';
import { showAlert } from '../components/Alert';

// Espelho exato do enum FormaPagamento do backend
const ENUM_FORMAS = [
  { value: 'DINHEIRO',       label: 'Dinheiro',          icone: '💵' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito', icone: '💳' },
  { value: 'CARTAO_DEBITO',  label: 'Cartão de Débito',  icone: '🏧' },
  { value: 'PIX',            label: 'Pix',               icone: '📱' },
  { value: 'CREDIARIO',      label: 'Crediário',         icone: '🔁' },
  { value: 'CHEQUE',         label: 'Cheque',            icone: '🧾' },
];

// Resolve ícone pelo valor do enum vindo do backend
const resolveIcone = (enumVal) =>
  ENUM_FORMAS.find((f) => f.value === enumVal)?.icone ?? '💰';

// Resolve label legível pelo enum
const resolveLabel = (enumVal) =>
  ENUM_FORMAS.find((f) => f.value === enumVal)?.label ?? enumVal ?? '—';

export default function MeiosPagamento() {
  const [formas, setFormas]           = useState([]);
  const [descricao, setDescricao]     = useState('');
  const [enumSelecionado, setEnum]    = useState(ENUM_FORMAS[0].value);
  const [loading, setLoading]         = useState(true);
  const [salvando, setSalvando]       = useState(false);
  const [deletando, setDeletando]     = useState(false);
  const [modalDelete, setModalDelete] = useState(null); // { id, nome }

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await pagamentoService.listarFormasPagamento();
      console.log('FormaPgtoResponse recebido:', JSON.stringify(data?.[0]));
      setFormas(data || []);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao carregar meios de pagamento', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCriar = async (e) => {
    e.preventDefault();
    if (!descricao.trim()) {
      showAlert('Informe uma descrição', 'error');
      return;
    }
    setSalvando(true);
    try {
      await pagamentoService.criarFormaPagamento(descricao.trim(), enumSelecionado);
      showAlert(`"${descricao.trim()}" cadastrado com sucesso!`, 'success');
      setDescricao('');
      setEnum(ENUM_FORMAS[0].value);
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao cadastrar meio de pagamento', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async () => {
    if (!modalDelete?.id) {
      showAlert('ID não encontrado. Verifique se o backend está retornando o campo "id" na listagem.', 'error');
      setModalDelete(null);
      return;
    }
    setDeletando(true);
    try {
      await pagamentoService.deletarFormaPagamento(modalDelete.id);
      showAlert(`"${modalDelete.nome}" removido com sucesso.`, 'success');
      setModalDelete(null);
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao remover meio de pagamento', 'error');
    } finally {
      setDeletando(false);
    }
  };

  // Ícone do enum selecionado no select (preview em tempo real)
  const iconePreview = resolveIcone(enumSelecionado);

  return (
    <div className="mp-container">

      <div className="mp-header">
        <div>
          <h1 className="mp-title">💳 Meios de Pagamento</h1>
          <p className="mp-subtitle">Gerencie as formas de pagamento aceitas no PDV</p>
        </div>
      </div>

      <div className="mp-body">

        {/* ── Formulário ── */}
        <div className="mp-form-card">
          <h2 className="mp-form-title">Novo Meio de Pagamento</h2>
          <form className="mp-form" onSubmit={handleCriar}>
            <div className="mp-form-grid">

              <div className="mp-field">
                <label className="mp-field-label">Tipo de Pagamento</label>
                <div className="mp-select-wrapper">
                  <span className="mp-select-icone">{iconePreview}</span>
                  <select
                    value={enumSelecionado}
                    onChange={(e) => setEnum(e.target.value)}
                    className="mp-select mp-select-with-icon"
                    disabled={salvando}
                  >
                    {ENUM_FORMAS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mp-field-hint">Selecione o tipo correspondente</p>
              </div>

              <div className="mp-field">
                <label className="mp-field-label">Descrição exibida no PDV</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Pix — Transferência Instantânea"
                  className="mp-input"
                  maxLength={60}
                  disabled={salvando}
                />
                <p className="mp-field-hint">Nome que aparecerá para o operador</p>
              </div>

            </div>
            <div className="mp-form-actions">
              <button
                type="submit"
                className="mp-btn-criar"
                disabled={salvando || !descricao.trim()}
              >
                {salvando ? '⏳ Salvando...' : '+ Adicionar'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Lista ── */}
        <div className="mp-list-card">
          <div className="mp-list-header">
            <h2 className="mp-form-title">Meios Cadastrados</h2>
            <span className="mp-count">{formas.length} cadastrado{formas.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="mp-loading">
              <div className="loading-spinner" />
              <p>Carregando...</p>
            </div>
          ) : formas.length === 0 ? (
            <div className="mp-empty">
              <span>💳</span>
              <p>Nenhum meio de pagamento cadastrado</p>
              <p className="mp-empty-sub">Adicione o primeiro usando o formulário acima</p>
            </div>
          ) : (
            <div className="mp-grid">
              {formas.map((forma, idx) => (
                <div key={forma.id ?? idx} className="mp-card">
                  {/* Ícone resolvido pelo enum vindo do backend */}
                  <div className="mp-card-icon">
                    {resolveIcone(forma.forma_pagamento)}
                  </div>
                  <div className="mp-card-info">
                    <span className="mp-card-name">{forma.desc_forma_pagamento}</span>
                    <span className="mp-card-type">{resolveLabel(forma.forma_pagamento)}</span>
                  </div>
                  <button
                    className="mp-btn-delete"
                    onClick={() => setModalDelete({ id: forma.id, nome: forma.desc_forma_pagamento })}
                    title="Remover"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Modal de confirmação ── */}
      {modalDelete && (
        <div className="mp-modal-overlay" onClick={() => !deletando && setModalDelete(null)}>
          <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mp-modal-icon">🗑️</div>
            <h2 className="mp-modal-title">Remover meio de pagamento</h2>
            <p className="mp-modal-msg">
              Tem certeza que deseja remover <strong>"{modalDelete.nome}"</strong>?
              <br />
              <span className="mp-modal-warn">Esta ação não pode ser desfeita.</span>
            </p>
            <div className="mp-modal-actions">
              <button
                className="mp-modal-btn-cancel"
                onClick={() => setModalDelete(null)}
                disabled={deletando}
              >
                Cancelar
              </button>
              <button
                className="mp-modal-btn-confirm"
                onClick={handleDeletar}
                disabled={deletando}
              >
                {deletando ? '⏳ Removendo...' : 'Sim, remover'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
