import { useState, useEffect } from 'react';
import { entradaMercadoriaService } from '../api/entradaMercadoriaService';
import { showAlert } from '../components/Alert';

export default function EntradaMercadoria() {
  const [notas, setNotas] = useState([]);
  const [obs, setObs] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarNotas();
  }, []);

  const carregarNotas = async () => {
    const notasTransito = await entradaMercadoriaService.listarNotasTransito();
    setNotas(notasTransito);
  };

  const realizarEntrada = async (idNota) => {
    try {
      await entradaMercadoriaService.entradaDeMercadoria(idNota, obs);
      setMensagem('Entrada realizada com sucesso!');
      carregarNotas();
    } catch (error) {
      const erroMsg = error.displayMessage || error.message || 'Erro ao realizar entrada';
      showAlert(erroMsg, 'error');
      setMensagem('Erro ao realizar entrada');
    }
  };

  return (
    <div className="page-container">
      <h1>Entrada de Mercadoria</h1>
      <div className="form-group">
        <label>Observação:</label>
        <input
          type="text"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />
      </div>
      <table className="notas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nota Fiscal</th>
            <th>Data</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id}>
              <td>{nota.id}</td>
              <td>{nota.numeroNota}</td>
              <td>{nota.dataEmissao}</td>
              <td>
                <button onClick={() => realizarEntrada(nota.id)}>Confirmar Entrada</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
}