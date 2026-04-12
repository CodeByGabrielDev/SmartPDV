import { useState } from 'react';
import { excecaoImpostoService } from '../api/excecaoImpostoService';
import { showAlert } from '../components/Alert';

export default function ExcecaoImposto() {
  const [naturezaOperacao, setNaturezaOperacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [novoItem, setNovoItem] = useState({
    tipo: 1,
    aliquota: '',
    reducao_Base: ''
  });

  const adicionarItem = () => {
    if (!novoItem.aliquota) {
      showAlert('Informe a alíquota', 'error');
      return;
    }
    setItens([...itens, { ...novoItem }]);
    setNovoItem({ tipo: 1, aliquota: '', reducao_Base: '' });
  };

  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const criarExcecao = async () => {
    if (!naturezaOperacao) {
      showAlert('Informe a natureza da operação (CFOP)', 'error');
      return;
    }
    if (!descricao) {
      showAlert('Informe a descrição', 'error');
      return;
    }
    if (itens.length === 0) {
      showAlert('Adicione pelo menos um item de imposto', 'error');
      return;
    }

    setCarregando(true);
    try {
      const request = {
        naturezao_operacao: parseInt(naturezaOperacao),
        descricao,
        itens: itens.map(item => ({
          tipo: parseInt(item.tipo),
          aliquota: parseFloat(item.aliquota),
          reducao_Base: parseFloat(item.reducao_Base) || 0
        }))
      };
      
      await excecaoImpostoService.criarExcecaoImposto(request);
      showAlert('Exceção de imposto criada com sucesso!', 'success');
      
      setNaturezaOperacao('');
      setDescricao('');
      setItens([]);
    } catch (error) {
      const erroMsg = error.displayMessage || error.message || 'Erro ao criar exceção';
      showAlert(erroMsg, 'error');
    } finally {
      setCarregando(false);
    }
  };

  const tiposImposto = [
    { value: 1, label: 'ICMS' },
    { value: 2, label: 'PIS' },
    { value: 3, label: 'COFINS' },
    { value: 4, label: 'IPI' },
    { value: 5, label: 'IBS' },
    { value: 6, label: 'CBS' }
  ];

  return (
    <div className="page-container">
      <h1>Exceção de Imposto</h1>
      <p className="page-subtitle">Crie exceções de imposto para natureza de operação específica.</p>

      <div className="form-card">
        <h2>Dados da Exceção</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>Natureza da Operação (CFOP):</label>
            <input
              type="number"
              value={naturezaOperacao}
              onChange={(e) => setNaturezaOperacao(e.target.value)}
              placeholder="Ex: 5101"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição da exceção de imposto"
          />
        </div>
      </div>

      <div className="form-card">
        <h2>Itens de Imposto</h2>
        
        <div className="itens-add-row">
          <div className="form-group">
            <label>Tipo:</label>
            <select 
              value={novoItem.tipo} 
              onChange={(e) => setNovoItem({...novoItem, tipo: parseInt(e.target.value)})}
            >
              {tiposImposto.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Alíquota (%):</label>
            <input
              type="number"
              value={novoItem.aliquota}
              onChange={(e) => setNovoItem({...novoItem, aliquota: e.target.value})}
              placeholder="Ex: 18"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label>Redução Base (%):</label>
            <input
              type="number"
              value={novoItem.reducao_Base}
              onChange={(e) => setNovoItem({...novoItem, reducao_Base: e.target.value})}
              placeholder="Ex: 0"
              step="0.01"
            />
          </div>
          
          <button className="btn-add-item" onClick={adicionarItem}>
            ➕ Adicionar
          </button>
        </div>

        {itens.length > 0 && (
          <div className="itens-list">
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Alíquota</th>
                  <th>Redução Base</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item, index) => (
                  <tr key={index}>
                    <td>{tiposImposto.find(t => t.value === parseInt(item.tipo))?.label}</td>
                    <td>{item.aliquota}%</td>
                    <td>{item.reducao_Base || 0}%</td>
                    <td>
                      <button className="btn-remove" onClick={() => removerItem(index)}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button 
          className="btn-primary" 
          onClick={criarExcecao}
          disabled={carregando}
        >
          {carregando ? 'Criando...' : '✓ Criar Exceção'}
        </button>
      </div>
    </div>
  );
}