import { useState, useEffect } from 'react';
import { pagamentoService } from '../api/pagamentoService';
import { showAlert } from '../components/Alert';

const ICONES = ['💳', '💵', '🏦', '📱', '🔁', '🎫', '💰', '🧾'];

export default function MeiosPagamento() {
  const [formas, setFormas]       = useState([]);
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading]     = useState(true);
  const [salvando, setSalvando]   = useState(false);
  const [deletando, setDeletando] = useState(null);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await pagamentoService.listarFormasPagamento();
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
      showAlert('Informe a descrição do meio de pagamento', 'error');
      return;
    }
    setSalvando(true);
    try {
      await pagamentoService.criarFormaPagamento(descricao.trim());
      showAlert(`"${descricao.trim()}" criado com sucesso!`, 'success');
      setDescricao('');
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao criar meio de pagamento', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (forma) => {
    if (!forma.id) {
      showAlert('Este item não possui ID — atualize o backend para incluir o ID na resposta.', 'error');
      return;
    }
    setDeletando(forma.id);
    try {
      await pagamentoService.deletarFormaPagamento(forma.id);
      showAlert(`"${forma.desc_forma_pagamento}" removido.`, 'success');
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao remover meio de pagamento', 'error');
    } finally {
      setDeletando(null);
    }
  };

  // Ícone baseado no índice (rotativo)
  const icone = (idx) => ICONES[idx % ICONES.length];

  return (
    <div className="mp-container">

      {/* Cabeçalho */}
      <div className="mp-header">
        <div>
          <h1 className="mp-title">💳 Meios de Pagamento</h1>
          <p className="mp-subtitle">Gerencie as formas de pagamento aceitas no PDV</p>
        </div>
      </div>

      <div className="mp-body">

        {/* Formulário de criação */}
        <div className="mp-form-card">
          <h2 className="mp-form-title">Novo Meio de Pagamento</h2>
          <form className="mp-form" onSubmit={handleCriar}>
            <div className="mp-form-row">
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Pix, Cartão de Crédito, Dinheiro..."
                className="mp-input"
                maxLength={60}
                disabled={salvando}
              />
              <button
                type="submit"
                className="mp-btn-criar"
                disabled={salvando || !descricao.trim()}
              >
                {salvando ? '⏳ Salvando...' : '+ Adicionar'}
              </button>
            </div>
            <p className="mp-form-hint">
              Exemplos: Dinheiro, Cartão de Crédito, Cartão de Débito, Pix, Boleto, Vale-Refeição
            </p>
          </form>
        </div>

        {/* Lista */}
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
                  <div className="mp-card-icon">{icone(idx)}</div>
                  <div className="mp-card-info">
                    <span className="mp-card-name">{forma.desc_forma_pagamento}</span>
                    {forma.id && (
                      <span className="mp-card-id">ID #{forma.id}</span>
                    )}
                  </div>
                  <button
                    className="mp-btn-delete"
                    onClick={() => handleDeletar(forma)}
                    disabled={deletando === forma.id}
                    title="Remover"
                  >
                    {deletando === forma.id ? '⏳' : '🗑'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
