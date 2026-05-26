import { useState, useEffect } from 'react';
import { entradaMercadoriaService } from '../api/entradaMercadoriaService';
import { showAlert } from '../components/Alert';

export default function EntradaMercadoria() {
  const [notas, setNotas] = useState([]);
  const [obs, setObs] = useState('');
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    carregarNotas();
  }, []);

  const carregarNotas = async () => {
    setLoading(true);
    try {
      const notasTransito = await entradaMercadoriaService.listarNotasTransito();
      setNotas(notasTransito);
    } catch (error) {
      const msg = error.displayMessage || error.message || 'Erro ao carregar notas';
      showAlert(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const abrirConfirmacao = (nota) => {
    setNotaSelecionada(nota);
    setObs('');
  };

  const cancelarConfirmacao = () => {
    setNotaSelecionada(null);
    setObs('');
  };

  const realizarEntrada = async () => {
    if (!notaSelecionada) return;
    setConfirmando(true);
    try {
      await entradaMercadoriaService.entradaDeMercadoria(notaSelecionada.id, obs);
      showAlert('Entrada de mercadoria realizada com sucesso!', 'success');
      setNotaSelecionada(null);
      setObs('');
      carregarNotas();
    } catch (error) {
      const msg = error.displayMessage || error.message || 'Erro ao realizar entrada';
      showAlert(msg, 'error');
    } finally {
      setConfirmando(false);
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '—';
    const data = new Date(dataStr);
    return data.toLocaleString('pt-BR');
  };

  return (
    <div className="page-container">
      <h1>📦 Entrada de Mercadoria</h1>
      <p style={{ color: 'var(--text-secondary, #666)', marginBottom: '1.5rem' }}>
        Notas fiscais de transferência pendentes de recebimento para sua loja.
      </p>

      {loading ? (
        <p>Carregando notas em trânsito...</p>
      ) : notas.length === 0 ? (
        <div className="empty-state" style={{
          textAlign: 'center',
          padding: '3rem',
          border: '2px dashed var(--border-color, #ddd)',
          borderRadius: '8px',
          color: 'var(--text-secondary, #888)'
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
          <p>Nenhuma nota fiscal pendente de entrada para sua loja.</p>
        </div>
      ) : (
        <table className="notas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Nº Nota</th>
              <th>Loja Origem</th>
              <th>Loja Destino</th>
              <th>Data de Envio</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((nota) => (
              <tr key={nota.id}>
                <td><strong>#{nota.numero_Nota}</strong></td>
                <td>{nota.loja_Origem_Nome}</td>
                <td>{nota.loja_Destino_Nome}</td>
                <td>{formatarData(nota.data_Envio)}</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => abrirConfirmacao(nota)}
                  >
                    Confirmar Entrada
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmação */}
      {notaSelecionada && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card-bg, #fff)',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Confirmar Entrada de Mercadoria</h2>

            <div style={{
              background: 'var(--bg-secondary, #f5f5f5)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p><strong>Nota Fiscal:</strong> #{notaSelecionada.numero_Nota}</p>
              <p><strong>Origem:</strong> {notaSelecionada.loja_Origem_Nome}</p>
              <p><strong>Destino:</strong> {notaSelecionada.loja_Destino_Nome}</p>
              <p><strong>Data de Envio:</strong> {formatarData(notaSelecionada.data_Envio)}</p>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Observação (opcional):</label>
              <input
                type="text"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Ex: Mercadoria recebida sem avarias"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelarConfirmacao}
                disabled={confirmando}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #ccc)',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={realizarEntrada}
                disabled={confirmando}
              >
                {confirmando ? 'Confirmando...' : '✅ Confirmar Entrada'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
