import { useState, useRef, useEffect } from 'react';
import { vendaService } from '../api/vendaService';
import { estoqueService } from '../api/estoqueService';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../components/Alert';

export default function Venda() {
  const [codigoBarra, setCodigoBarra] = useState('');
  const [itens, setItens] = useState([]);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [validando, setValidando] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const adicionarItem = async () => {
    const codigo = codigoBarra.trim().toUpperCase();
    if (!codigo) return;

    // Verifica se o item já está na lista
    const itemExistente = itens.find((i) => i.codigo_barra === codigo);
    if (itemExistente) {
      showAlert('Item já adicionado. Ajuste a quantidade diretamente na lista.', 'error');
      setCodigoBarra('');
      inputRef.current?.focus();
      return;
    }

    setValidando(true);
    try {
      // Valida no estoque antes de adicionar
      const estoque = await estoqueService.listarEstoque();
      const itemEstoque = estoque.find(
        (e) => e.codigo_barra?.toUpperCase() === codigo
      );

      if (!itemEstoque) {
        showAlert(`Produto "${codigo}" não encontrado no estoque.`, 'error');
        return;
      }

      if (itemEstoque.quantidade_atual < 1) {
        showAlert(`Produto "${codigo}" sem saldo no estoque.`, 'error');
        return;
      }

      setItens((prev) => [
        ...prev,
        {
          id: Date.now(),
          codigo_barra: codigo,
          qtd_item: 1,
          desconto: 0,
          preco: itemEstoque.preco_venda ?? 0,
          qtdDisponivel: itemEstoque.quantidade_atual,
          descricao: itemEstoque.nome_produto ?? codigo,
          validado: true,
        },
      ]);
      setCodigoBarra('');
    } catch (error) {
      showAlert('Erro ao validar produto no estoque.', 'error');
    } finally {
      setValidando(false);
      inputRef.current?.focus();
    }
  };

  const removerItem = (id) => setItens((prev) => prev.filter((i) => i.id !== id));

  const atualizarQtd = (id, qtd) => {
    if (qtd < 1) return;
    const item = itens.find((i) => i.id === id);
    if (item && qtd > item.qtdDisponivel) {
      showAlert(`Saldo disponível no estoque: ${item.qtdDisponivel} unidade(s).`, 'error');
      return;
    }
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, qtd_item: qtd } : i)));
  };

  const atualizarDesconto = (id, desconto) => {
    const valor = Math.min(100, Math.max(0, Number(desconto) || 0));
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, desconto: valor } : i)));
  };

  const calcularSubtotalItem = (item) => {
    const bruto = item.qtd_item * (item.preco || 0);
    const desconto = bruto * ((item.desconto || 0) / 100);
    return bruto - desconto;
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

    setCarregando(true);
    try {
      const vendaRequest = {
        itens_venda: itens.map((i) => ({
          codigo_barra: i.codigo_barra,
          qtd_item: i.qtd_item,
          desconto: i.desconto || 0,
        })),
      };
      // Remove pontuações do CPF/CNPJ antes de enviar. Se vazio, envia null (venda sem cliente)
      const cpfCnpjLimpo = cpfCnpj.trim()
        ? cpfCnpj.replace(/[.\-\/]/g, '').trim()
        : null;
      const response = await vendaService.realizarVenda(vendaRequest, cpfCnpjLimpo);
      const idVenda = response?.id || response?.id_banco || response?.idVenda;
      if (!idVenda) throw new Error('Resposta da venda sem ID. Contate o suporte.');
      navigate(`/dashboard/pagamento?idVenda=${idVenda}`);
    } catch (error) {
      showAlert(error.displayMessage || error.message || 'Erro ao processar venda', 'error');
    } finally {
      setCarregando(false);
    }
  };

  const totalBruto = itens.reduce((acc, i) => acc + i.qtd_item * (i.preco || 0), 0);
  const totalDesconto = itens.reduce((acc, i) => {
    const bruto = i.qtd_item * (i.preco || 0);
    return acc + bruto * ((i.desconto || 0) / 100);
  }, 0);
  const total = totalBruto - totalDesconto;
  const qtdItens = itens.reduce((acc, i) => acc + i.qtd_item, 0);
  const todosValidados = itens.length > 0 && itens.every((i) => i.validado);

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
                onKeyDown={(e) => e.key === 'Enter' && !validando && adicionarItem()}
                placeholder="Bipe ou digite o código..."
                className="pdv-bip-input"
                autoComplete="off"
                disabled={validando}
              />
              <button
                className="pdv-btn-add"
                onClick={adicionarItem}
                title="Adicionar item (Enter)"
                disabled={validando}
              >
                {validando ? '⏳' : '+'}
              </button>
            </div>
            <p className="pdv-hint">Pressione <kbd>Enter</kbd> para adicionar</p>
          </div>

          {/* Cliente */}
          <div className="pdv-section">
            <div className="pdv-section-label">
              <span className="pdv-section-icon">👤</span>
              Identificação do Cliente <span style={{ fontWeight: 400, fontSize: '0.75rem', opacity: 0.6 }}>(opcional)</span>
            </div>
            <input
              type="text"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              placeholder="CPF ou CNPJ — deixe vazio para venda sem cliente"
              className={`pdv-cliente-input${cpfCnpj ? ' filled' : ''}`}
              maxLength={18}
            />
            {cpfCnpj ? (
              <p className="pdv-cliente-ok">✅ Cliente identificado</p>
            ) : (
              <p className="pdv-hint" style={{ marginTop: '0.35rem' }}>Venda sem vínculo de cliente</p>
            )}
          </div>

          {/* Resumo */}
          <div className="pdv-resumo">
            <div className="pdv-resumo-row">
              <span>Subtotal</span>
              <span>R$ {totalBruto.toFixed(2)}</span>
            </div>
            <div className="pdv-resumo-row">
              <span>Desconto</span>
              <span>− R$ {totalDesconto.toFixed(2)}</span>
            </div>
            <div className="pdv-resumo-total">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="pdv-btn-finalizar"
            onClick={finalizarVenda}
            disabled={carregando || !todosValidados}
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
                  {/* Linha 1: número, nome, subtotal, remover */}
                  <div className="pdv-item-row1">
                    <div className="pdv-item-num">{idx + 1}</div>
                    <div className="pdv-item-info">
                      <span className="pdv-item-codigo">{item.descricao}</span>
                      <span className="pdv-item-preco">R$ {(item.preco || 0).toFixed(2)} / un</span>
                    </div>
                    <div className="pdv-item-subtotal">
                      R$ {calcularSubtotalItem(item).toFixed(2)}
                    </div>
                    <button className="pdv-item-remove" onClick={() => removerItem(item.id)} title="Remover">×</button>
                  </div>
                  {/* Linha 2: qtd e desconto */}
                  <div className="pdv-item-row2">
                    <div className="pdv-item-qtd">
                      <button className="pdv-qtd-btn" onClick={() => atualizarQtd(item.id, item.qtd_item - 1)}>−</button>
                      <span className="pdv-qtd-val">{item.qtd_item}</span>
                      <button className="pdv-qtd-btn" onClick={() => atualizarQtd(item.id, item.qtd_item + 1)}>+</button>
                    </div>
                    <div className="pdv-item-desconto">
                      <span className="pdv-desconto-label">Desconto:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.desconto}
                        onChange={(e) => atualizarDesconto(item.id, e.target.value)}
                        className="pdv-desconto-input"
                        placeholder="0"
                      />
                      <span className="pdv-desconto-label">%</span>
                      {item.desconto > 0 && (
                        <span className="pdv-desconto-valor">
                          − R$ {(item.qtd_item * (item.preco || 0) * item.desconto / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
