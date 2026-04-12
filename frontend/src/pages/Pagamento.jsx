import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pagamentoService } from '../api/pagamentoService';
import { showAlert } from '../components/Alert';

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const [idVenda, setIdVenda] = useState('');
  const [formaPgto, setFormaPgto] = useState(1);
  const [qtdParcelas, setQtdParcelas] = useState(1);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('idVenda');
    if (id) setIdVenda(id);
    
    const carregarFormas = async () => {
      try {
        const formas = await pagamentoService.listarFormasPagamento();
        setFormasPagamento(formas);
      } catch (error) {
        console.error('Erro ao carregar formas:', error);
      }
    };
    carregarFormas();
  }, [location]);

  const realizarPagamento = async () => {
    if (!idVenda) {
      alert('Informe o ID da venda');
      return;
    }
    
    setCarregando(true);
    try {
      await pagamentoService.realizarPagamento(parseInt(idVenda), formaPgto, qtdParcelas);
      setMensagem('Pagamento realizado com sucesso!');
      setTimeout(() => {
        navigate('/dashboard/venda');
      }, 1500);
    } catch (error) {
      const erroMsg = error.displayMessage || error.message || 'Erro ao processar pagamento';
      showAlert(erroMsg, 'error');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pagamento-container">
      <div className="pagamento-card">
        <h1>💳 Pagamento</h1>
        
        {idVenda && (
          <div className="venda-info">
            <span>Venda #</span>
            <strong>{idVenda}</strong>
          </div>
        )}

        <div className="form-group">
          <label>ID da Venda/Ticket:</label>
          <input
            type="number"
            value={idVenda}
            onChange={(e) => setIdVenda(e.target.value)}
            placeholder="Informe o ID da venda"
          />
        </div>

        <div className="form-group">
          <label>Forma de Pagamento:</label>
          <select 
            value={formaPgto} 
            onChange={(e) => setFormaPgto(parseInt(e.target.value))}
          >
            {formasPagamento.map((forma, index) => (
              <option key={index} value={index + 1}>
                {forma.desc_forma_pagamento}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Parcelas:</label>
          <input
            type="number"
            value={qtdParcelas}
            onChange={(e) => setQtdParcelas(parseInt(e.target.value))}
            min="1"
            max="12"
          />
        </div>

        <button 
          className="btn-pagar" 
          onClick={realizarPagamento}
          disabled={carregando}
        >
          {carregando ? 'Processando...' : '✓ CONFIRMAR PAGAMENTO'}
        </button>

        {mensagem && (
          <div className="mensagem sucesso">{mensagem}</div>
        )}
      </div>
    </div>
  );
}