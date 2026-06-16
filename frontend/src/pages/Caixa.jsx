import { useState, useEffect } from 'react';
import { caixaService } from '../api/caixaService';
import { showAlert } from '../components/Alert';
import { useNavigate } from 'react-router-dom';

const fmt    = v  => Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtDT  = dt => { if (!dt) return '—'; try { return new Date(dt).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); } catch { return dt; } };
const calcDur = ab => {
  if (!ab) return null;
  const d = Math.floor((Date.now() - new Date(ab).getTime()) / 1000);
  const h = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), s = d % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};
const STORAGE_KEY = 'smartpdv_caixa_aberto';

export default function Caixa() {
  const navigate = useNavigate();
  const [caixaAberto, setCaixaAberto] = useState(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  });
  const [caixaId, setCaixaId] = useState(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r)?.id ?? null : null; } catch { return null; }
  });
  const [loading, setLoading]         = useState(false);
  const [confirmFechar, setConfirmFechar] = useState(false);
  const [resumo, setResumo]           = useState(null);
  const [duracao, setDuracao]         = useState(null);

  // Sync with backend on mount
  useEffect(() => {
    (async () => {
      const caixaBackend = await caixaService.buscarCaixaAberto();
      if (!caixaBackend) {
        localStorage.removeItem(STORAGE_KEY);
        setCaixaAberto(null);
        setCaixaId(null);
      } else if (!caixaAberto) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(caixaBackend));
        setCaixaAberto(caixaBackend);
        setCaixaId(caixaBackend.id);
      }
    })();
  }, []); // eslint-disable-line

  // Live timer
  useEffect(() => {
    if (!caixaAberto) return;
    setDuracao(calcDur(caixaAberto.horario_abertura));
    const timer = setInterval(() => setDuracao(calcDur(caixaAberto.horario_abertura)), 1000);
    return () => clearInterval(timer);
  }, [caixaAberto]);

  const abrirCaixa = async () => {
    setLoading(true);
    try {
      const r = await caixaService.abrirCaixa();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
      setCaixaAberto(r); setCaixaId(r.id); setResumo(null);
      showAlert('Caixa aberto com sucesso!', 'success');
    } catch (err) { showAlert(err.displayMessage || err.message || 'Erro ao abrir caixa', 'error'); }
    finally { setLoading(false); }
  };

  const fecharCaixa = async () => {
    setLoading(true);
    try {
      const r = await caixaService.fecharCaixa(caixaId);
      localStorage.removeItem(STORAGE_KEY);
      setResumo(r); setCaixaAberto(null); setCaixaId(null); setConfirmFechar(false);
      showAlert('Caixa fechado com sucesso!', 'success');
    } catch (err) {
      showAlert(err.displayMessage || err.message || 'Erro ao fechar caixa', 'error');
      setConfirmFechar(false);
    } finally { setLoading(false); }
  };

  /* ─────────────────────────────────────────── */
  /* ESTADO: Caixa FECHADO                       */
  /* ─────────────────────────────────────────── */
  if (!caixaAberto && !resumo) {
    return (
      <div className="p-xl flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-md space-y-lg">
          {/* Card principal */}
          <div className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden shadow-card">
            {/* Header colorido */}
            <div className="bg-surface-container-high px-xl py-lg flex items-center gap-md border-b border-outline-variant">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-2xl">lock</span>
              </div>
              <div>
                <h2 className="text-headline-md font-bold text-on-surface">Caixa Fechado</h2>
                <p className="text-body-sm text-on-surface-variant">Nenhuma operação ativa no momento</p>
              </div>
              <span className="ml-auto px-sm py-xs rounded-full bg-error-container text-on-error-container text-[11px] font-bold border border-error/20 flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-error" />
                INATIVO
              </span>
            </div>

            <div className="p-xl space-y-lg">
              {/* Info de status */}
              <div className="grid grid-cols-2 gap-md">
                {[
                  { icon: 'store', label: 'Operador', value: localStorage.getItem('login') || 'Admin' },
                  { icon: 'calendar_today', label: 'Data', value: new Date().toLocaleDateString('pt-BR') },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="p-md bg-surface-container-low rounded-xl border border-outline-variant flex items-center gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</p>
                      <p className="text-label-md font-semibold text-on-surface">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-body-sm text-on-surface-variant text-center">
                Para iniciar as vendas do dia, abra o caixa. Todas as transações serão vinculadas a esta sessão.
              </p>

              <button
                onClick={abrirCaixa}
                disabled={loading}
                className="w-full h-14 bg-primary text-on-primary text-label-md font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">lock_open</span>
                {loading ? 'Abrindo Caixa...' : 'Abrir Caixa'}
              </button>
            </div>
          </div>

          {/* Dica */}
          <div className="flex items-start gap-sm p-md bg-surface-container-low rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-primary text-[20px] mt-xs">info</span>
            <p className="text-body-sm text-on-surface-variant">
              O caixa deve ser aberto uma vez por turno. Ao fechar, um relatório de movimentação é gerado automaticamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────── */
  /* ESTADO: Caixa ABERTO                        */
  /* ─────────────────────────────────────────── */
  if (caixaAberto) {
    return (
      <>
        <div className="p-xl space-y-lg max-w-4xl mx-auto w-full">

          {/* Hero banner — status + tempo */}
          <div className="relative bg-primary rounded-2xl p-xl overflow-hidden shadow-card-lg">
            {/* Decorative circle */}
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-on-primary/5 rounded-full" />
            <div className="absolute -right-4 -bottom-12 w-56 h-56 bg-on-primary/5 rounded-full" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
              <div className="flex items-center gap-lg">
                <div className="w-16 h-16 bg-on-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-primary text-3xl">account_balance_wallet</span>
                </div>
                <div>
                  <div className="flex items-center gap-sm mb-xs">
                    <span className="px-sm py-xs rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30 flex items-center gap-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      CAIXA ABERTO
                    </span>
                    <span className="text-on-primary/50 text-[11px] font-mono">ID #{caixaId}</span>
                  </div>
                  <h2 className="text-headline-md font-bold text-on-primary">{caixaAberto.nome_loja || 'Loja'}</h2>
                  <p className="text-body-sm text-on-primary/70">Operador: {caixaAberto.nome_usuario_abertura || '—'}</p>
                </div>
              </div>

              {/* Timer */}
              <div className="text-right">
                <p className="text-[11px] font-bold text-on-primary/60 uppercase tracking-wider mb-xs">Tempo de sessão</p>
                <p className="font-geist-mono text-3xl font-bold text-on-primary tracking-widest">{duracao ?? '00:00:00'}</p>
                <p className="text-[11px] text-on-primary/60 mt-xs">Aberto em {fmtDT(caixaAberto.horario_abertura)}</p>
              </div>
            </div>
          </div>

          {/* Cards de info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {[
              { icon: 'check_circle', label: 'Status', value: 'Operacional', iconCls: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: 'tag',          label: 'ID do Caixa', value: `#${caixaId}`, iconCls: 'text-primary', bg: 'bg-primary/10', mono: true },
              { icon: 'person',       label: 'Operador', value: caixaAberto.nome_usuario_abertura || '—', iconCls: 'text-secondary', bg: 'bg-secondary/10' },
              { icon: 'schedule',     label: 'Abertura', value: fmtDT(caixaAberto.horario_abertura), iconCls: 'text-on-surface-variant', bg: 'bg-surface-container' },
            ].map(({ icon, label, value, iconCls, bg, mono }) => (
              <div key={label} className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col gap-md shadow-card">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${iconCls}`}>{icon}</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-xs">{label}</p>
                  <p className={`text-label-md font-bold text-on-surface ${mono ? 'font-geist-mono' : ''}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ações rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <button
              onClick={() => navigate('/dashboard/venda')}
              className="flex items-center gap-lg p-lg bg-surface border border-outline-variant rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group text-left shadow-card"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary">shopping_cart</span>
              </div>
              <div>
                <p className="text-label-md font-bold text-on-surface">Ir para PDV</p>
                <p className="text-body-sm text-on-surface-variant">Iniciar uma nova venda</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant ml-auto">arrow_forward</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-lg p-lg bg-surface border border-outline-variant rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group text-left shadow-card"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-all">
                <span className="material-symbols-outlined text-secondary group-hover:text-on-secondary">bar_chart</span>
              </div>
              <div>
                <p className="text-label-md font-bold text-on-surface">Ver Dashboard</p>
                <p className="text-body-sm text-on-surface-variant">Resumo de vendas do dia</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant ml-auto">arrow_forward</span>
            </button>
          </div>

          {/* Fechar caixa */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-md shadow-card">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-error">lock</span>
              </div>
              <div>
                <p className="text-label-md font-bold text-on-surface">Encerrar Turno</p>
                <p className="text-body-sm text-on-surface-variant">
                  Um relatório completo será gerado ao fechar o caixa.
                </p>
              </div>
            </div>
            <button
              onClick={() => setConfirmFechar(true)}
              disabled={loading}
              className="flex items-center gap-sm px-xl py-md border-2 border-error/50 text-error rounded-xl text-label-md font-bold hover:bg-error hover:text-on-error hover:border-error transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              <span className="material-symbols-outlined">power_settings_new</span>
              Fechar Caixa
            </button>
          </div>
        </div>

        {/* Modal confirmação fechar */}
        {confirmFechar && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => !loading && setConfirmFechar(false)}
          >
            <div
              className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-md border border-outline-variant overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-xl flex flex-col items-center text-center gap-md">
                <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-3xl">power_settings_new</span>
                </div>
                <div>
                  <h2 className="text-headline-md font-bold text-on-surface">Fechar o caixa?</h2>
                  <p className="text-body-md text-on-surface-variant mt-xs">
                    O caixa <strong>#{caixaId}</strong> será encerrado. Confirme que todas as vendas foram finalizadas.
                  </p>
                </div>
              </div>

              <div className="mx-xl mb-lg p-md bg-surface-container-low rounded-xl border border-outline-variant">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">🏦 Loja</span>
                  <strong>{caixaAberto?.nome_loja || '—'}</strong>
                </div>
                <div className="flex justify-between items-center text-body-sm mt-xs">
                  <span className="text-on-surface-variant">⏱ Tempo aberto</span>
                  <strong className="font-geist-mono">{duracao}</strong>
                </div>
              </div>

              <div className="flex gap-md px-xl pb-xl">
                <button
                  onClick={() => setConfirmFechar(false)}
                  disabled={loading}
                  className="flex-1 py-sm border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={fecharCaixa}
                  disabled={loading}
                  className="flex-1 py-sm bg-error text-on-error rounded-xl text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-xs"
                >
                  <span className="material-symbols-outlined text-sm">lock</span>
                  {loading ? 'Fechando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /* ─────────────────────────────────────────── */
  /* ESTADO: Resumo pós-fechamento               */
  /* ─────────────────────────────────────────── */
  return (
    <div className="p-xl flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-lg space-y-lg">
        {/* Header */}
        <div className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden shadow-card">
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-xl py-lg flex items-center gap-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500 text-2xl">task_alt</span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">Caixa Encerrado</h2>
              <p className="text-body-sm text-on-surface-variant">Caixa #{resumo.id} · Relatório de fechamento</p>
            </div>
          </div>

          <div className="p-xl space-y-lg">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-md">
              {[
                ['Loja',          resumo.nome_loja],
                ['Operador',      resumo.login_usuario_fechamento],
                ['Abertura',      fmtDT(resumo.data_abertura)],
                ['Fechamento',    fmtDT(resumo.data_fechamento)],
              ].map(([l, v]) => (
                <div key={l} className="p-md bg-surface-container-low rounded-xl border border-outline-variant">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-xs">{l}</p>
                  <p className="text-body-md font-semibold text-on-surface">{v || '—'}</p>
                </div>
              ))}
            </div>

            {/* Movimentação */}
            <div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
              <div className="px-lg py-md border-b border-outline-variant">
                <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Movimentação Financeira</p>
              </div>
              <div className="p-lg space-y-sm">
                {[
                  ['Saldo Inicial', fmt(resumo.valor_inicial), 'text-on-surface'],
                  ['Saldo Final',   fmt(resumo.valor_final),   'text-on-surface'],
                ].map(([l, v, cls]) => (
                  <div key={l} className="flex justify-between items-center py-xs border-b border-outline-variant/30">
                    <span className="text-body-sm text-on-surface-variant">{l}</span>
                    <strong className={`text-body-md font-bold ${cls}`}>{v}</strong>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-sm">
                  <span className="text-label-md font-bold text-on-surface">Total Movimentado</span>
                  <strong className={`text-headline-md font-bold ${(resumo.valor_final ?? 0) >= (resumo.valor_inicial ?? 0) ? 'text-emerald-500' : 'text-error'}`}>
                    {fmt((resumo.valor_final ?? 0) - (resumo.valor_inicial ?? 0))}
                  </strong>
                </div>
              </div>
            </div>

            <button
              onClick={abrirCaixa}
              disabled={loading}
              className="w-full h-14 bg-primary text-on-primary text-label-md font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-sm"
            >
              <span className="material-symbols-outlined">lock_open</span>
              {loading ? 'Abrindo...' : 'Abrir Novo Caixa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
