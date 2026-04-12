import { useState } from 'react';
import { caixaService } from '../api/caixaService';
import { showAlert } from '../components/Alert';

export default function Caixa() {
  const [caixaAberto, setCaixaAberto] = useState(null);
  const [caixaId, setCaixaId] = useState('');
  const [mensagem, setMensagem] = useState('');

  const abrirCaixa = async () => {
    try {
      const response = await caixaService.abrirCaixa();
      setCaixaAberto(response);
      setCaixaId(response.id);
      setMensagem('Caixa aberto com sucesso!');
    } catch (error) {
      const erroMsg = error.displayMessage || error.message || 'Erro ao abrir caixa';
      showAlert(erroMsg, 'error');
      setMensagem('Erro ao abrir caixa');
    }
  };

  const fecharCaixa = async () => {
    try {
      const response = await caixaService.fecharCaixa(caixaId);
      setMensagem('Caixa fechado com sucesso!');
      setCaixaAberto(null);
    } catch (error) {
      const erroMsg = error.displayMessage || error.message || 'Erro ao fechar caixa';
      showAlert(erroMsg, 'error');
      setMensagem('Erro ao fechar caixa');
    }
  };

  return (
    <div className="page-container">
      <h1>Gerenciamento de Caixa</h1>
      {!caixaAberto ? (
        <div className="caixa-section">
          <button onClick={abrirCaixa}>Abrir Caixa</button>
        </div>
      ) : (
        <div className="caixa-section">
          <p>Caixa ID: {caixaId}</p>
          <p>Data Abertura: {caixaAberto.dataAbertura}</p>
          <button onClick={fecharCaixa} className="btn-fechar">
            Fechar Caixa
          </button>
        </div>
      )}
      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
}