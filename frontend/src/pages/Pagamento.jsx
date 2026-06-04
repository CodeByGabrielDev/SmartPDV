import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pagamentoService } from '../api/pagamentoService';
import { vendaService } from '../api/vendaService';
import { showAlert } from '../components/Alert';

export default function Pagamento() {
  const location  = useLocation();
  const navigate  = useNavigate();

  const [idVenda,         setIdVenda]         = useState(null);
  const [formaPgtoId,     setFormaPgtoId]     = useState(null);
  const [qtdParcelas,     setQtdParcelas]     = useState(1);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [carregando,      setCarregando]      = useState(false);
  const [carregandoFormas,setCarregandoFormas]= useState(true);
  const [concluido,       setConcluido]       = useState(false);
  const [erroImposto,     setErroImposto]     = useState(false);

  /* ── Carrega ID da venda pela URL e formas de pagamento ── */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('idVenda');
    if (id) {
      setIdVenda(id);
    } else {
      showAlert('Nenhuma venda identificada. Volte ao PDV.', 'error');
    }

    const carregarFormas = async () => {
      setCarregandoFormas(true);
      try {
        const formas = await pagamentoService.listarFormasPagamento();
        if (!formas || formas.length === 0) {
          showAlert('Nenhuma forma de pagamento cadastrada. Acesse Meios de Pagamento e cadastre.', 'error');
          return;
        }
        setFormasPagamento(formas);
        setFormaPgtoId(formas[0].id); // seleciona o primeiro por padrão
      } catch (error) {
        showAlert('Erro ao carregar formas de pagamento.', 'error');
      } finally {
        setCarregandoFormas(false);
      }
    };
    carregarFormas();
  }, [location]);

  const formaSelecionada = formasPagamento.find((f) => f.id === formaPgtoId);
  const ehCredito = formaSelecionada?.desc_forma_pagamento?.toLowerCase().includes('crédito')
                 || formaSelecionada?.desc_forma_pagamento?.toLowerCase().includes('credito');

  const realizarPagamento = async () => {
    if (!idVenda) {
      showAlert('Venda não identificada.', 'error');
      return;
    }
    if (!formaPgtoId) {
      showAlert('Selecione uma forma de pagamento.', 'error');
      return;
    }

    setCarregando(true);
    try {
      await pagamentoService.realizarPagamento(parseInt(idVenda), formaPgtoId, qtdParcelas);
      setConcluido(true);
      setTimeout(() => navigate('/dashboard/venda'), 2500);
    } catch (error) {
      const status   = error.response?.status || error.status;
      const mensagem = error.response?.data?.message || error.displayMessage || error.message || '';

      console.log('[Pagamento] erro status:', status, '| mensagem:', mensagem, '| idVenda:', idVenda);

      // 404 nesse contexto = backend não encontrou exceção de imposto e cancelou
      const ehExcecaoImposto =
        status === 404 ||
        mensagem.toLowerCase().includes('excecao') ||
        mensagem.toLowerCase().includes('exceção') ||
        mensagem.toLowerCase().includes('imposto');

      if (ehExcecaoImposto) {
        console.log('[Pagamento] chamando cancelarVenda com idVenda:', idVenda);
        try {
          await vendaService.cancelarVenda(parseInt(idVenda));
          console.log('[Pagamento] cancelarVenda executado com sucesso');
        } catch (cancelErr) {
          console.error('[Pagamento] erro ao cancelar venda:', cancelErr);
        }
        setIdVenda(null);
        setErroImposto(true);
      } else {
        showAlert(mensagem || 'Erro ao processar pagamento', 'error');
      }
    } finally {
      setCarregando(false);
    }
  };

  /* ── Tela de sucesso ── */
  if (concluido) {
    return (
      <div className="pgto-container">
        <div className="pgto-sucesso">
          <div className="pgto-sucesso-icon">✅</div>
          <h2>Pagamento confirmado!</h2>
          <p>Venda <strong>#{idVenda}</strong> finalizada com sucesso.</p>
          <p className="pgto-sucesso-sub">Redirecionando para o PDV...</p>
        </div>
      </div>
    );
  }

  /* ── Tela de erro: exceção de imposto não configurada ── */
  if (erroImposto) {
    return (
      <div className="pgto-container">
        <div className="pgto-card">
          <div className="pgto-erro-imposto">
            <div className="pgto-erro-icon">⚠️</div>
            <h2>Venda cancelada</h2>
            <p>
              Não há <strong>exceção de imposto</strong> configurada para o CFOP 5102 desta loja.
              A venda foi cancelada automaticamente para evitar inconsistências.
            </p>
            <p className="pgto-erro-sub">
              Configure a exceção de imposto e realize a venda novamente.
            </p>
            <div className="pgto-erro-acoes">
              <button
                className="pgto-btn-confirmar"
                onClick={() => navigate('/dashboard/excecao-imposto')}
              >
                ⚙️ Configurar Exceção de Imposto
              </button>
              <button
                className="pgto-btn-voltar"
                onClick={() => navigate('/dashboard/venda')}
              >
                ← Voltar ao PDV
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pgto-container">
      <div className="pgto-card">

        {/* Cabeçalho */}
        <div className="pgto-header">
          <span className="pgto-header-icon">💳</span>
          <div>
            <h1 className="pgto-title">Pagamento</h1>
            <p className="pgto-subtitle">
              {idVenda ? `Venda #${idVenda}` : 'Aguardando venda...'}
            </p>
          </div>
        </div>

        {/* Alerta sem venda */}
        {!idVenda && (
          <div className="pgto-alerta">
            ⚠️ Nenhuma venda em aberto. <button className="pgto-link" onClick={() => navigate('/dashboard/venda')}>Voltar ao PDV</button>
          </div>
        )}

        {/* Forma de pagamento */}
        <div className="pgto-section">
          <label className="pgto-label">Forma de Pagamento</label>
          {carregandoFormas ? (
            <div className="pgto-loading-formas">
              <div className="loading-spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
              <span>Carregando formas...</span>
            </div>
          ) : formasPagamento.length === 0 ? (
            <div className="pgto-alerta">
              ⚠️ Nenhuma forma de pagamento cadastrada.{' '}
              <button className="pgto-link" onClick={() => navigate('/dashboard/meios-pagamento')}>
                Cadastrar agora
              </button>
            </div>
          ) : (
            <div className="pgto-formas-grid">
              {formasPagamento.map((forma) => (
                <button
                  key={forma.id}
                  className={`pgto-forma-btn ${formaPgtoId === forma.id ? 'selected' : ''}`}
                  onClick={() => { setFormaPgtoId(forma.id); setQtdParcelas(1); }}
                >
                  <span className="pgto-forma-icon">
                    {forma.desc_forma_pagamento?.toLowerCase().includes('pix')     ? '⚡' :
                     forma.desc_forma_pagamento?.toLowerCase().includes('débito')  ? '💳' :
                     forma.desc_forma_pagamento?.toLowerCase().includes('debito')  ? '💳' :
                     forma.desc_forma_pagamento?.toLowerCase().includes('crédito') ? '💎' :
                     forma.desc_forma_pagamento?.toLowerCase().includes('credito') ? '💎' :
                     forma.desc_forma_pagamento?.toLowerCase().includes('dinheiro')? '💵' : '🏦'}
                  </span>
                  <span>{forma.desc_forma_pagamento}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Parcelas — só aparece para crédito */}
        {ehCredito && (
          <div className="pgto-section">
            <label className="pgto-label">Número de Parcelas</label>
            <div className="pgto-parcelas-row">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                <button
                  key={n}
                  className={`pgto-parcela-btn ${qtdParcelas === n ? 'selected' : ''}`}
                  onClick={() => setQtdParcelas(n)}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botão confirmar */}
        <button
          className="pgto-btn-confirmar"
          onClick={realizarPagamento}
          disabled={carregando || !idVenda || !formaPgtoId || formasPagamento.length === 0}
        >
          {carregando
            ? <><span className="pgto-spinner" /> Processando...</>
            : '✓ CONFIRMAR PAGAMENTO'}
        </button>

        <button className="pgto-btn-voltar" onClick={() => navigate('/dashboard/venda')}>
          ← Voltar ao PDV
        </button>

      </div>
    </div>
  );
}
