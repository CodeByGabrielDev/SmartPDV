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
      codigo_barra: codigoBarra,
      qtd_item: 1,
      desconto: 0,
    };
    
    setItens([...itens, { ...novoItem, id: Date.now() }]);
    setCodigoBarra('');
    inputRef.current?.focus();
  };

  const removerItem = (id) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const atualizarQtd = (id, qtd) => {
    if (qtd < 1) return;
    setItens(itens.map(item => 
      item.id === id ? { ...item, qtd_item: qtd } : item
    ));
  };

  const finalizarVenda = async () => {
    if (itens.length === 0) {
      alert('Adicione pelo menos um item');
      return;
    }
    if (!cpfCnpj) {
      alert('Informe o CPF/CNPJ do cliente');
      return;
    }

    setCarregando(true);
    try {
      const itensFormatados = itens.map(item => ({
        codigo_barra: item.codigo_barra,
        qtd_item: item.qtd_item,
        desconto: item.desconto || 0
      }));
      
      const vendaRequest = { itens_venda: itensFormatados };
      const response = await vendaService.realizarVenda(vendaRequest, cpfCnpj);
      
      const idVenda = response?.ticket || response?.idVenda || response?.id || response?.numeroTicket;
      
      if (idVenda) {
        navigate(`/dashboard/pagamento?idVenda=${idVenda}`);
      } else {
        alert('Venda realizada! Agora finalize o pagamento.');
        navigate('/dashboard/pagamento');
      }
    } catch (error) {
      const erroMsg = error.displayMessage || error.message || 'Erro ao processar venda';
      showAlert(erroMsg, 'error');
    } finally {
      setCarregando(false);
    }
  };

  const total = itens.reduce((acc, item) => acc + (item.qtd_item * (item.preco || 0)), 0);

  return (
    <div className="venda-container">
      <div className="venda-header">
        <h1>🛒 Nova Venda</h1>
      </div>

      <div className="venda-main">
        <div className="venda-left">
          <div className="bipador-section">
            <label>Bipar Produto</label>
            <div className="bipador-row">
              <input
                ref={inputRef}
                type="text"
                value={codigoBarra}
                onChange={(e) => setCodigoBarra(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && adicionarItem()}
                placeholder="Bipe o código de barras..."
                className="bipador-input"
              />
              <button onClick={adicionarItem} className="btn-add">+</button>
            </div>
          </div>

          <div className="cpf-section">
            <label>CPF/CNPJ Cliente</label>
            <input
              type="text"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              placeholder="Informe CPF ou CNPJ"
            />
          </div>
        </div>

        <div className="venda-right">
          <div className="itens-list">
            <h3>Itens da Venda</h3>
            {itens.length === 0 ? (
              <p className="empty-message">Nenhum item bipado ainda...</p>
            ) : (
              <div className="itens-scroll">
                {itens.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-info">
                      <span className="item-codigo">{item.codigo_barra}</span>
                      <div className="item-qtd">
                        <button onClick={() => atualizarQtd(item.id, item.qtd_item - 1)}>−</button>
                        <span>{item.qtd_item}</span>
                        <button onClick={() => atualizarQtd(item.id, item.qtd_item + 1)}>+</button>
                      </div>
                    </div>
                    <button className="btn-remove" onClick={() => removerItem(item.id)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="venda-footer">
            <div className="total-section">
              <span>Total:</span>
              <span className="total-value">R$ {total.toFixed(2)}</span>
            </div>
            <button 
              className="btn-finalizar" 
              onClick={finalizarVenda}
              disabled={carregando || itens.length === 0}
            >
              {carregando ? 'Processando...' : '✓ FINALIZAR VENDA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}