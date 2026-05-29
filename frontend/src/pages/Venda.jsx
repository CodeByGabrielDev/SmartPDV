import { useState, useRef, useEffect } from 'react';
import { vendaService } from '../api/vendaService';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../components/Alert';

export default function Venda() {
  const [codigoBarra, setCodigoBarra] = useState('');
  const [itens, setItens] = useState([]);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [carregando, setCarregando] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const adicionarItem = async () => {
    if (!codigoBarra.trim()) return;
    const novoItem = {
      id: Date.now(),
      codigo_barra: codigoBarra.trim().toUpperCase(),
      qtd_item: 1,
      desconto: 0,
      preco: 0,
    };
    setItens((prev) => [...prev, novoItem]);
    setCodigoBarra('');
    inputRef.current?.focus();
  };

  const removerItem = (id) => setItens((prev) => prev.filter((i) => i.id !== id));

  const atualizarQtd = (id, qtd) => {
    if (qtd < 1) return;
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, qtd_item: qtd } : i)));
  };

  const limparVenda = () => {
    setItens([]);
    setCpfCnpj('');
    setCodigoBarra('');
    inputRef.current?.focus();
  };

  const finalizarVenda = async () => {
    if (itens.length === 0) {
      showAlert('Adicione pelo menos um item', 'error');
      return;
    }
    if (!cpfCnpj.trim()) {
      showAlert('Informe o CPF ou CNPJ do cliente', 'error');
      return;
    }
    setCarregando(true);
    try {
      const vendaRequest = {
        itens_venda: itens.map((i) => ({
          codigo_barra: i.codigo_barra,
          qtd_item: i.qtd_item,
          desconto: i.desconto || 0,
        })),
      };
      const response = await vendaService.realizarVenda(vendaRequest, cpfCnpj);
      const idVenda = response?.ticket || response?.idVenda || response?.id;
      navigate(idVenda ? `/dashboard/pagamento?idVenda=${idVenda}` : '/dashboard/pagamento');
    } catch (error) {
      showAlert(error.displayMessage || error.message || 'Erro ao processar venda', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const total = itens.reduce((acc, i) => acc + i.qtd_item * (i.preco || 0), 0);
  const qtdItens = itens.reduce((acc, i) => acc + i.qtd_item, 0);

  return (
    <div className="pdv-container">

      {/* ── Cabeçalho ── */}
      <div className="pdv-header">
        <div className="pdv-header-left">
          <span className="pdv-header-icon">🛒</span>
          <div>
            <h1 className="pdv-title">PDV — Nova Venda</h1>
            <span className="pdv-subtitle">Ponto de Venda</span>
          </div>
        </div>
        <div className="pdv-header-right">
          <span className="pdv-badge">{qtdItens} item{qtdItens !== 1 ? 's' : ''}</span>
          <button className="pdv-btn-clear" onClick={limparVenda} disabled={itens.length === 0 && !cpfCnpj}>
            🗑 Limpar
          </button>
        </div>
      </div>

      {/* ── Corpo ── */}
      <div className="pdv-body">

        {/* Coluna esquerda */}
        <div className="pdv-left">

          {/* Bipador */}
          <div className="pdv-section">
            <div className="pdv-section-label">
              <span className="pdv-section-icon">📷</span>
              Código de Barras
            </div>
            <div className="pdv-bip-row">
              <input
                ref={inputRef}
                type="text"
                value={codigoBarra}
                onChange={(e) => setCodigoBarra(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && adicionarItem()}
                placeholder="Bipe ou digite o código..."
                className="pdv-bip-input"
                autoComplete="off"
              />
              <button className="pdv-btn-add" onClick={adicionarItem} title="Adicionar item (Enter)">
                +
              </button>
            </div>
            <p className="pdv-hint">Pressione <kbd>Enter</kbd> para adicionar</p>
          </div>

          {/* Cliente */}
          <div className="pdv-section">
            <div className="pdv-section-label">
              <span className="pdv-section-icon">👤</span>
              Identificação do Cliente
            </div>
            <input
              type="text"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
              className={`pdv-cliente-input${cpfCnpj ? ' filled' : ''}`}
              maxLength={18}
            />
            {cpfCnpj && (
              <p className="pdv-cliente-ok">✅ Cliente identificado</p>
            )}
          </div>

          {/* Resumo */}
          <div className="pdv-resumo">
            <div className="pdv-resumo-row">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="pdv-resumo-row">
              <span>Desconto</span>
              <span>R$ 0,00</span>
            </div>
            <div className="pdv-resumo-total">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="pdv-btn-finalizar"
            onClick={finalizarVenda}
            disabled={carregando || itens.length === 0}
          >
            {carregando ? (
              <span className="pdv-btn-loading">⏳ Processando...</span>
            ) : (
              <>✓ FINALIZAR VENDA</>
            )}
          </button>
        </div>

        {/* Coluna direita — lista de itens */}
        <div className="pdv-right">
          <div className="pdv-itens-header">
            <span>Itens da Venda</span>
            <span className="pdv-itens-count">{itens.length} produto{itens.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="pdv-itens-list">
            {itens.length === 0 ? (
              <div className="pdv-empty">
                <span className="pdv-empty-icon">📦</span>
                <p>Nenhum item adicionado</p>
                <p className="pdv-empty-sub">Bipe um produto para começar</p>
              </div>
            ) : (
              itens.map((item, idx) => (
                <div key={item.id} className="pdv-item">
                  <div className="pdv-item-num">{idx + 1}</div>
                  <div className="pdv-item-info">
                    <span className="pdv-item-codigo">{item.codigo_barra}</span>
                    <span className="pdv-item-preco">R$ {(item.preco || 0).toFixed(2)}</span>
                  </div>
                  <div className="pdv-item-qtd">
                    <button className="pdv-qtd-btn" onClick={() => atualizarQtd(item.id, item.qtd_item - 1)}>−</button>
                    <span className="pdv-qtd-val">{item.qtd_item}</span>
                    <button className="pdv-qtd-btn" onClick={() => atualizarQtd(item.id, item.qtd_item + 1)}>+</button>
                  </div>
                  <div className="pdv-item-subtotal">
                    R$ {(item.qtd_item * (item.preco || 0)).toFixed(2)}
                  </div>
                  <button className="pdv-item-remove" onClick={() => removerItem(item.id)} title="Remover">×</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
