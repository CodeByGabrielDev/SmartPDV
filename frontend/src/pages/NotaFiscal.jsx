import { useState, useEffect } from 'react';
import { notaFiscalService } from '../api/notaFiscalService';
import { lojaService } from '../api/lojaService';
import { showAlert } from '../components/Alert';

export default function NotaFiscal() {
  const [activeTab, setActiveTab] = useState('emitir');
  const [showModal, setShowModal] = useState(false);
  const [showLojas, setShowLojas] = useState(false);
  const [lojas, setLojas] = useState([]);
  const [carregandoLojas, setCarregandoLojas] = useState(false);

  const [cfop, setCfop] = useState(5101);
  const [serieNfe, setSerieNfe] = useState(1);
  const [cpfCnpjLojaDestino, setCpfCnpjLojaDestino] = useState('');
  const [nomeLojaDestino, setNomeLojaDestino] = useState('');
  const [codigoBarra, setCodigoBarra] = useState('');
  const [itemQtd, setItemQtd] = useState(1);
  const [itemDesconto, setItemDesconto] = useState(0);
  const [itens, setItens] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [notasFiscais, setNotasFiscais] = useState([]);
  const [carregandoNotas, setCarregandoNotas] = useState(false);

  useEffect(() => {
    if (activeTab === 'historico') {
      carregarNotas();
    }
  }, [activeTab]);

  const carregarNotas = async () => {
    setCarregandoNotas(true);
    try {
      const response = await notaFiscalService.listarNotas();
      setNotasFiscais(response);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setCarregandoNotas(false);
    }
  };

  const buscarLojas = async () => {
    setCarregandoLojas(true);
    try {
      const response = await lojaService.listarLojasAtivas();
      setLojas(response);
      setShowLojas(true);
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
    } finally {
      setCarregandoLojas(false);
    }
  };

  const selecionarLoja = (loja) => {
    console.log('Loja selecionada:', loja);
    const cnpj = loja.cnpj || loja.cpfCnpj || loja.cnpjLoja;
    console.log('CNPJ capturado:', cnpj);
    setCpfCnpjLojaDestino(cnpj);
    setNomeLojaDestino(loja.razaoSocial);
    setShowLojas(false);
  };

  const adicionarItem = () => {
    if (!codigoBarra.trim()) return;
    setItens([...itens, { 
      codigo_barra: codigoBarra, 
      quantidade_Itens: parseInt(itemQtd) || 1,
      desconto: parseFloat(itemDesconto) || 0
    }]);
    setCodigoBarra('');
    setItemQtd(1);
    setItemDesconto(0);
  };

  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const emitirNota = async () => {
    if (!cpfCnpjLojaDestino || itens.length === 0) {
      showAlert('Preencha o CNPJ da loja e adicione itens', 'error');
      return;
    }

    setCarregando(true);
    try {
      const notaRequest = {
        cfop: parseInt(cfop),
        serieNfe: parseInt(serieNfe),
        codigo_barra: itens,
        cpf_cliente: cpfCnpjLojaDestino,
      };
      console.log('=== EnviandoNF ===', notaRequest);
      const response = await notaFiscalService.emitirNotaAvulsa(notaRequest);
      console.log('=== ResponseNF ===', response);
      showAlert(`Nota fiscal ${response.nf_numero} emitida com sucesso!`, 'success');
      setItens([]);
      setCpfCnpjLojaDestino('');
      setNomeLojaDestino('');
    } catch (error) {
      console.error('=== ErroNF ===', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      const erroMsg = error.displayMessage || error.message || 'Erro desconhecido';
      showAlert(erroMsg, 'error');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="notafiscal-container">
      <div className="notafiscal-content">
        <div className="notafiscal-header-row">
          <h1>🧾 Módulo Fiscal</h1>
          <button
            className="btn-primary-large"
            onClick={() => { setShowModal(true); setActiveTab('emitir'); }}
          >
            📝 Emissão de Nota
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'emitir' ? 'active' : ''}`}
            onClick={() => setActiveTab('emitir')}
          >
            📝 Emissão de NF
          </button>
          <button
            className={`tab ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            📋 Histórico
          </button>
        </div>

        {activeTab === 'emitir' && (
          <div className="tab-content">
            <p className="info-text">
              Emita notas fiscais avulsas para vendas externas ou entrada de mercadoria.
            </p>
            <button
              className="btn-primary-large"
              onClick={() => setShowModal(true)}
            >
              ➕ Emitir Nota Fiscal
            </button>
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="tab-content">
            {carregandoNotas ? (
              <p className="loading">Carregando notas fiscais...</p>
            ) : notasFiscais.length > 0 ? (
              <div className="notas-cards">
                {notasFiscais.map((nota, index) => (
                  <div key={index} className="nota-card">
                    <div className="nota-card-header">
                      <div className="nota-card-numero">
                        NF <span>{nota.nf_numero}</span> / Série {nota.serieNf}
                      </div>
                      <span className={`nota-card-status status-${nota.status_Nota?.toLowerCase() || 'pendente'}`}>
                        {nota.status_Nota || 'PENDENTE'}
                      </span>
                    </div>
                    <div className="nota-card-body">
                      <div className="nota-card-item">
                        <span className="nota-card-label">CFOP</span>
                        <span className="nota-card-value">{nota.cfop}</span>
                      </div>
                      <div className="nota-card-item">
                        <span className="nota-card-label">Cliente</span>
                        <span className="nota-card-value">{nota.cpf_Cliente || '-'}</span>
                      </div>
                      <div className="nota-card-item">
                        <span className="nota-card-label">Destino</span>
                        <span className="nota-card-value">{nota.loja || '-'}</span>
                      </div>
                      <div className="nota-card-item">
                        <span className="nota-card-label">Data</span>
                        <span className="nota-card-value">
                          {nota.data_Emissao ? new Date(nota.data_Emissao).toLocaleDateString('pt-BR') : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="nota-card-valores">
                      <div className="nota-card-item">
                        <span className="nota-card-label">Bruto</span>
                        <span className="nota-card-value">R$ {nota.valor_Bruto_Nota?.toFixed(2) || '0,00'}</span>
                      </div>
                      <div className="nota-card-item">
                        <span className="nota-card-label">Impostos</span>
                        <span className="nota-card-value">R$ {nota.valor_Total_De_Imposto_A_Pagar?.toFixed(2) || '0,00'}</span>
                      </div>
                      <div className="nota-card-item">
                        <span className="nota-card-label">Líquido</span>
                        <span className="nota-card-value">R$ {nota.valor_Liquido_Nota?.toFixed(2) || '0,00'}</span>
                      </div>
                      {nota.desconto > 0 && (
                        <div className="nota-card-item">
                          <span className="nota-card-label">Desconto</span>
                          <span className="nota-card-value">R$ {nota.desconto?.toFixed(2) || '0,00'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Nenhuma nota fiscal encontrada.</p>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🧾 Emissão de Nota Fiscal</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-tabs">
              <button 
                className={`modal-tab ${activeTab === 'emitir' ? 'active' : ''}`}
                onClick={() => setActiveTab('emitir')}
              >
                dados da NF
              </button>
              <button 
                className={`modal-tab ${activeTab === 'itens' ? 'active' : ''}`}
                onClick={() => setActiveTab('itens')}
              >
                itens (códigos)
              </button>
            </div>

            <div className="modal-body">
              {activeTab === 'emitir' && (
                <div className="form-emissao">
                  <p className="form-info">
                    Você está na MATRIZ. Busque a loja de destino para emitir a nota.
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label>CFOP:</label>
                      <input
                        type="number"
                        value={cfop}
                        onChange={(e) => setCfop(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Série NFe:</label>
                      <input
                        type="number"
                        value={serieNfe}
                        onChange={(e) => setSerieNfe(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>CNPJ/CPF Loja Destino:</label>
                    <div className="input-with-search">
                      <input
                        type="text"
                        value={cpfCnpjLojaDestino}
                        onChange={(e) => setCpfCnpjLojaDestino(e.target.value)}
                        placeholder="CNPJ ou CPF da loja de destino"
                      />
                      <button 
                        type="button"
                        className="btn-search"
                        onClick={buscarLojas}
                        title="Buscar lojas ativas"
                      >
                        🔍
                      </button>
                    </div>
                    {nomeLojaDestino && (
                      <span className="loja-selecionada">{nomeLojaDestino}</span>
                    )}
                  </div>

                  {showLojas && (
                    <div className="lista-lojas">
                      {carregandoLojas ? (
                        <p>Carregando...</p>
                      ) : lojas.length > 0 ? (
                        lojas.map((loja, index) => (
                          <div 
                            key={index} 
                            className="loja-item"
                            onClick={() => selecionarLoja(loja)}
                          >
                            <strong>{loja.razaoSocial}</strong>
                            <span>{loja.cnpj || loja.cpfCnpj}</span>
                          </div>
                        ))
                      ) : (
                        <p>Nenhuma loja encontrada.</p>
                      )}
                    </div>
                  )}

                  <button 
                    className="btn-proxima"
                    onClick={() => setActiveTab('itens')}
                    disabled={!cpfCnpjLojaDestino}
                  >
                    Próxima Etapa →
                  </button>
                </div>
              )}

              {activeTab === 'itens' && (
                <div className="form-itens">
                  <div className="form-group">
                    <label>Adicionar Item (código de barras):</label>
                    <input
                      type="text"
                      value={codigoBarra}
                      onChange={(e) => setCodigoBarra(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && adicionarItem()}
                      placeholder="Bipe ou digite o código"
                      className="input-codigo"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantidade:</label>
                      <input
                        type="number"
                        value={itemQtd}
                        onChange={(e) => setItemQtd(e.target.value)}
                        min="1"
                        className="input-qtd"
                      />
                    </div>
                    <div className="form-group">
                      <label>Desconto (R$):</label>
                      <input
                        type="number"
                        value={itemDesconto}
                        onChange={(e) => setItemDesconto(e.target.value)}
                        min="0"
                        step="0.01"
                        className="input-desconto"
                      />
                    </div>
                  </div>

                  <button onClick={adicionarItem} className="btn-add-item">
                    ➕ Adicionar Item
                  </button>

                  {itens.length > 0 && (
                    <div className="itens-list">
                      <h4>Itens ({itens.length})</h4>
                      {itens.map((item, index) => (
                        <div key={index} className="item-row">
                          <div className="item-info">
                            <span className="item-codigo">{item.codigo_barra}</span>
                            <span className="item-qtd">Qtd: {item.quantidade_Itens}</span>
                            {item.desconto > 0 && (
                              <span className="item-desconto">Desc: R$ {item.desconto.toFixed(2)}</span>
                            )}
                          </div>
                          <button className="btn-remove" onClick={() => removerItem(index)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    className="btn-voltar"
                    onClick={() => setActiveTab('emitir')}
                  >
                    ← Voltar
                  </button>

                  <button 
                    className="btn-emitir"
                    onClick={emitirNota}
                    disabled={carregando || itens.length === 0}
                  >
                    {carregando ? 'Emitindo...' : '🧾 EMITIR NOTA FISCAL'}
                  </button>

                  {mensagem && (
                    <div className={`mensagem ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
                      {mensagem}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}