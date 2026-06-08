import { useState, useEffect } from 'react';
import { caixaService } from '../api/caixaService';
import { showAlert } from '../components/Alert';

const fmt = (v) =>
  Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmtDateTime = (dt) => {
  if (!dt) return '—';
  try {
    return new Date(dt).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dt;
  }
};

const calcDuracao = (abertura) => {
  if (!abertura) return null;
  const diff = Math.floor((Date.now() - new Date(abertura).getTime()) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const STORAGE_KEY = 'smartpdv_caixa_aberto';

function carregarCaixaDoStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Caixa() {
  const [caixaAberto, setCaixaAberto] = useState(() => carregarCaixaDoStorage());
  const [caixaId, setCaixaId]         = useState(() => carregarCaixaDoStorage()?.id ?? null);
  const [loading, setLoading]         = useState(false);
  const [confirmFechar, setConfirmFechar] = useState(false);
  const [resumoFechamento, setResumoFechamento] = useState(null);
  const [duracao, setDuracao]         = useState(null);
  const [tick, setTick]               = useState(0);

  // Ao montar, valida com o backend se o caixa do localStorage ainda existe
  useEffect(() => {
    const validarCaixaNoBackend = async () => {
      const caixaBackend = await caixaService.buscarCaixaAberto();
      if (!caixaBackend) {
        // Backend não tem caixa aberto — limpa o localStorage
        localStorage.removeItem(STORAGE_KEY);
        setCaixaAberto(null);
        setCaixaId(null);
      } else if (!caixaAberto) {
        // Backend tem caixa aberto mas frontend não sabe — sincroniza
        localStorage.setItem(STORAGE_KEY, JSON.stringify(caixaBackend));
        setCaixaAberto(caixaBackend);
        setCaixaId(caixaBackend.id);
      }
    };
    validarCaixaNoBackend();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Atualiza o cronômetro enquanto o caixa estiver aberto
  useEffect(() => {
    if (!caixaAberto) return;
    const timer = setInterval(() => {
      setDuracao(calcDuracao(caixaAberto.horario_abertura));
      setTick((t) => t + 1);
    }, 1000);
    setDuracao(calcDuracao(caixaAberto.horario_abertura));
    return () => clearInterval(timer);
  }, [caixaAberto]);

  const abrirCaixa = async () => {
    setLoading(true);
    try {
      const response = await caixaService.abrirCaixa();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
      setCaixaAberto(response);
      setCaixaId(response.id);
      setResumoFechamento(null);
      showAlert('Caixa aberto com sucesso!', 'success');
    } catch (error) {
      showAlert(error.displayMessage || error.message || 'Erro ao abrir caixa', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fecharCaixa = async () => {
    setLoading(true);
    try {
      const response = await caixaService.fecharCaixa(caixaId);
      localStorage.removeItem(STORAGE_KEY);
      setResumoFechamento(response);
      setCaixaAberto(null);
      setCaixaId(null);
      setConfirmFechar(false);
      showAlert('Caixa fechado com sucesso!', 'success');
    } catch (error) {
      showAlert(error.displayMessage || error.message || 'Erro ao fechar caixa', 'error');
      setConfirmFechar(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cx-wrapper">

      {/* ── Cabeçalho da página ── */}
      <div className="cx-page-header">
        <div>
          <h1 className="cx-page-title">
            <span className="cx-icon">💵</span> Caixa
          </h1>
          <p className="cx-page-sub">Abertura e fechamento do caixa da loja</p>
        </div>
        <div className={`cx-status-badge ${caixaAberto ? 'aberto' : 'fechado'}`}>
          <span className="cx-status-dot" />
          {caixaAberto ? 'Caixa Aberto' : 'Caixa Fechado'}
        </div>
      </div>

      {/* ══════════════════════════════════════
          ESTADO: CAIXA FECHADO — aguardando abertura
         ══════════════════════════════════════ */}
      {!caixaAberto && !resumoFechamento && (
        <div className="cx-card cx-abertura">
          <div className="cx-illustration">
            <span className="cx-illustration-icon">🏦</span>
          </div>
          <h2 className="cx-card-title">Nenhum caixa aberto</h2>
          <p className="cx-card-desc">
            Clique no botão abaixo para iniciar o caixa e liberar as vendas do dia.
          </p>
          <button
            className="cx-btn-abrir"
            onClick={abrirCaixa}
            disabled={loading}
          >
            {loading ? (
              <><span className="cx-btn-spinner" /> Abrindo...</>
            ) : (
              <><span>🔓</span> Abrir Caixa</>
            )}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
          ESTADO: CAIXA ABERTO
         ══════════════════════════════════════ */}
      {caixaAberto && (
        <>
          {/* Banner de informações do caixa */}
          <div className="cx-banner">
            <div className="cx-banner-item">
              <span className="cx-banner-label">ID do Caixa</span>
              <span className="cx-banner-value cx-mono">#{caixaId}</span>
            </div>
            <div className="cx-banner-divider" />
            <div className="cx-banner-item">
              <span className="cx-banner-label">Loja</span>
              <span className="cx-banner-value">{caixaAberto.nome_loja || '—'}</span>
            </div>
            <div className="cx-banner-divider" />
            <div className="cx-banner-item">
              <span className="cx-banner-label">Operador</span>
              <span className="cx-banner-value">{caixaAberto.nome_usuario_abertura || '—'}</span>
            </div>
            <div className="cx-banner-divider" />
            <div className="cx-banner-item">
              <span className="cx-banner-label">Aberto em</span>
              <span className="cx-banner-value">{fmtDateTime(caixaAberto.horario_abertura)}</span>
            </div>
            <div className="cx-banner-divider" />
            <div className="cx-banner-item cx-banner-tempo">
              <span className="cx-banner-label">⏱ Tempo aberto</span>
              <span className="cx-banner-value cx-mono cx-tempo">{duracao ?? '00:00:00'}</span>
            </div>
          </div>

          {/* Cards de resumo */}
          <div className="cx-cards-grid">
            <div className="cx-info-card cx-info-green">
              <div className="cx-info-icon">✅</div>
              <div>
                <p className="cx-info-label">Status</p>
                <p className="cx-info-val">Operacional</p>
              </div>
            </div>
            <div className="cx-info-card cx-info-blue">
              <div className="cx-info-icon">🏷️</div>
              <div>
                <p className="cx-info-label">ID do Caixa</p>
                <p className="cx-info-val cx-mono">#{caixaId}</p>
              </div>
            </div>
            <div className="cx-info-card cx-info-purple">
              <div className="cx-info-icon">👤</div>
              <div>
                <p className="cx-info-label">Operador responsável</p>
                <p className="cx-info-val">{caixaAberto.nome_usuario_abertura || '—'}</p>
              </div>
            </div>
            <div className="cx-info-card cx-info-orange">
              <div className="cx-info-icon">🕐</div>
              <div>
                <p className="cx-info-label">Hora de abertura</p>
                <p className="cx-info-val">{fmtDateTime(caixaAberto.horario_abertura)}</p>
              </div>
            </div>
          </div>

          {/* Ação de fechar */}
          <div className="cx-fechar-area">
            <button
              className="cx-btn-fechar"
              onClick={() => setConfirmFechar(true)}
              disabled={loading}
            >
              <span>🔒</span> Fechar Caixa
            </button>
            <p className="cx-fechar-hint">
              Ao fechar o caixa, um resumo de movimentação será gerado.
            </p>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════
          ESTADO: RESUMO PÓS-FECHAMENTO
         ══════════════════════════════════════ */}
      {resumoFechamento && !caixaAberto && (
        <div className="cx-card cx-resumo">
          <div className="cx-resumo-header">
            <span className="cx-resumo-icon">📋</span>
            <h2 className="cx-card-title">Resumo do Fechamento</h2>
            <p className="cx-card-desc">Caixa #{resumoFechamento.id} encerrado com sucesso</p>
          </div>

          <div className="cx-resumo-grid">
            <div className="cx-resumo-item">
              <span className="cx-resumo-label">Loja</span>
              <span className="cx-resumo-val">{resumoFechamento.nome_loja || '—'}</span>
            </div>
            <div className="cx-resumo-item">
              <span className="cx-resumo-label">Operador de fechamento</span>
              <span className="cx-resumo-val">{resumoFechamento.login_usuario_fechamento || '—'}</span>
            </div>
            <div className="cx-resumo-item">
              <span className="cx-resumo-label">Abertura</span>
              <span className="cx-resumo-val">{fmtDateTime(resumoFechamento.data_abertura)}</span>
            </div>
            <div className="cx-resumo-item">
              <span className="cx-resumo-label">Fechamento</span>
              <span className="cx-resumo-val">{fmtDateTime(resumoFechamento.data_fechamento)}</span>
            </div>
          </div>

          <div className="cx-resumo-valores">
            <div className="cx-valor-box cx-valor-inicial">
              <p className="cx-valor-label">Valor Inicial</p>
              <p className="cx-valor-num">{fmt(resumoFechamento.valor_inicial)}</p>
            </div>
            <div className="cx-valor-arrow">→</div>
            <div className="cx-valor-box cx-valor-final">
              <p className="cx-valor-label">Valor Final</p>
              <p className="cx-valor-num">{fmt(resumoFechamento.valor_final)}</p>
            </div>
            <div className="cx-valor-arrow">＝</div>
            <div className={`cx-valor-box cx-valor-diff ${(resumoFechamento.valor_final - resumoFechamento.valor_inicial) >= 0 ? 'positivo' : 'negativo'}`}>
              <p className="cx-valor-label">Movimentação</p>
              <p className="cx-valor-num">
                {fmt((resumoFechamento.valor_final ?? 0) - (resumoFechamento.valor_inicial ?? 0))}
              </p>
            </div>
          </div>

          <button className="cx-btn-abrir" onClick={abrirCaixa} disabled={loading}>
            {loading ? (
              <><span className="cx-btn-spinner" /> Abrindo...</>
            ) : (
              <><span>🔓</span> Abrir Novo Caixa</>
            )}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
          MODAL DE CONFIRMAÇÃO — Fechar caixa
         ══════════════════════════════════════ */}
      {confirmFechar && (
        <div className="cx-modal-overlay" onClick={() => !loading && setConfirmFechar(false)}>
          <div className="cx-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cx-modal-icon">🔒</div>
            <h2 className="cx-modal-title">Fechar o caixa?</h2>
            <p className="cx-modal-msg">
              Você está prestes a encerrar o caixa <strong>#{caixaId}</strong>.<br />
              <span className="cx-modal-warn">
                Certifique-se de que todas as vendas foram finalizadas antes de prosseguir.
              </span>
            </p>
            <div className="cx-modal-info-row">
              <span>🏦 {caixaAberto?.nome_loja}</span>
              <span>👤 {caixaAberto?.nome_usuario_abertura}</span>
              <span>⏱ {duracao}</span>
            </div>
            <div className="cx-modal-actions">
              <button
                className="cx-modal-btn-cancel"
                onClick={() => setConfirmFechar(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="cx-modal-btn-confirm"
                onClick={fecharCaixa}
                disabled={loading}
              >
                {loading ? (
                  <><span className="cx-btn-spinner cx-spinner-white" /> Fechando...</>
                ) : (
                  'Sim, fechar caixa'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
