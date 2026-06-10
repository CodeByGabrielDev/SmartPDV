import { useState, useEffect } from 'react';
import { caixaService } from '../api/caixaService';
import { showAlert } from '../components/Alert';

const fmt = v => Number(v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtDT = dt => { if (!dt) return '—'; try { return new Date(dt).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); } catch { return dt; } };
const calcDur = ab => { if (!ab) return null; const d = Math.floor((Date.now() - new Date(ab).getTime()) / 1000); const h = Math.floor(d/3600), m = Math.floor((d%3600)/60), s = d%60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; };
const STORAGE_KEY = 'smartpdv_caixa_aberto';

export default function Caixa() {
  const [caixaAberto, setCaixaAberto] = useState(() => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } });
  const [caixaId, setCaixaId] = useState(() => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r)?.id ?? null : null; } catch { return null; } });
  const [loading, setLoading] = useState(false);
  const [confirmFechar, setConfirmFechar] = useState(false);
  const [resumo, setResumo] = useState(null);
  const [duracao, setDuracao] = useState(null);

  useEffect(() => {
    (async () => {
      const caixaBackend = await caixaService.buscarCaixaAberto();
      if (!caixaBackend) { localStorage.removeItem(STORAGE_KEY); setCaixaAberto(null); setCaixaId(null); }
      else if (!caixaAberto) { localStorage.setItem(STORAGE_KEY, JSON.stringify(caixaBackend)); setCaixaAberto(caixaBackend); setCaixaId(caixaBackend.id); }
    })();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!caixaAberto) return;
    const timer = setInterval(() => setDuracao(calcDur(caixaAberto.horario_abertura)), 1000);
    setDuracao(calcDur(caixaAberto.horario_abertura));
    return () => clearInterval(timer);
  }, [caixaAberto]);

  const abrirCaixa = async () => {
    setLoading(true);
    try { const r = await caixaService.abrirCaixa(); localStorage.setItem(STORAGE_KEY, JSON.stringify(r)); setCaixaAberto(r); setCaixaId(r.id); setResumo(null); showAlert('Caixa aberto!', 'success'); }
    catch (err) { showAlert(err.displayMessage || err.message || 'Erro ao abrir caixa', 'error'); }
    finally { setLoading(false); }
  };

  const fecharCaixa = async () => {
    setLoading(true);
    try { const r = await caixaService.fecharCaixa(caixaId); localStorage.removeItem(STORAGE_KEY); setResumo(r); setCaixaAberto(null); setCaixaId(null); setConfirmFechar(false); showAlert('Caixa fechado!', 'success'); }
    catch (err) { showAlert(err.displayMessage || err.message || 'Erro ao fechar caixa', 'error'); setConfirmFechar(false); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="p-xl space-y-xl max-w-3xl mx-auto w-full">

        {/* Caixa fechado */}
        {!caixaAberto && !resumo && (
          <div className="bg-surface border border-outline-variant rounded-2xl p-2xl flex flex-col items-center text-center gap-lg shadow-sm">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">account_balance_wallet</span>
            </div>
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">Nenhum caixa aberto</h2>
              <p className="text-body-md text-on-surface-variant mt-xs">Clique abaixo para iniciar o caixa e liberar as vendas do dia.</p>
            </div>
            <button onClick={abrirCaixa} disabled={loading} className="h-12 px-2xl bg-primary text-on-primary text-label-md font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-sm">
              <span className="material-symbols-outlined">lock_open</span>
              {loading ? 'Abrindo...' : 'Abrir Caixa'}
            </button>
          </div>
        )}

        {/* Caixa aberto */}
        {caixaAberto && (
          <>
            {/* Status banner */}
            <div className="bg-primary-container/10 border-2 border-primary/20 rounded-2xl p-lg flex flex-wrap gap-xl justify-between items-center">
              {[
                { label: 'ID do Caixa', value: `#${caixaId}`, mono: true },
                { label: 'Loja', value: caixaAberto.nome_loja || '—' },
                { label: 'Operador', value: caixaAberto.nome_usuario_abertura || '—' },
                { label: 'Aberto em', value: fmtDT(caixaAberto.horario_abertura) },
                { label: '⏱ Tempo aberto', value: duracao ?? '00:00:00', mono: true, accent: true },
              ].map(({ label, value, mono, accent }) => (
                <div key={label} className="flex flex-col gap-xs">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
                  <span className={`text-label-md font-semibold ${mono ? 'font-geist-mono' : ''} ${accent ? 'text-primary text-xl' : 'text-on-surface'}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {[
                { icon: 'check_circle', label: 'Status', value: 'Operacional', cls: 'text-emerald-600', bg: 'bg-emerald-100' },
                { icon: 'tag', label: 'ID do Caixa', value: `#${caixaId}`, cls: 'text-primary', bg: 'bg-primary-container/20', mono: true },
                { icon: 'person', label: 'Operador', value: caixaAberto.nome_usuario_abertura || '—', cls: 'text-on-surface', bg: 'bg-surface-container' },
                { icon: 'schedule', label: 'Abertura', value: fmtDT(caixaAberto.horario_abertura), cls: 'text-on-surface', bg: 'bg-surface-container' },
              ].map(({ icon, label, value, cls, bg, mono }) => (
                <div key={label} className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col gap-sm">
                  <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${cls}`}>{icon}</span>
                  </div>
                  <p className="text-[12px] font-bold text-on-surface-variant">{label}</p>
                  <p className={`text-label-md font-semibold ${cls} ${mono ? 'font-geist-mono' : ''}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Close action */}
            <div className="bg-error-container/20 border border-error/20 rounded-xl p-lg flex items-center justify-between">
              <div>
                <p className="text-label-md font-bold text-on-error-container">Fechar Caixa</p>
                <p className="text-body-sm text-on-error-container/70">Um resumo de movimentação será gerado ao fechar.</p>
              </div>
              <button onClick={() => setConfirmFechar(true)} disabled={loading} className="flex items-center gap-sm px-xl py-md border-2 border-error text-error rounded-xl text-label-md font-bold hover:bg-error hover:text-on-error transition-all active:scale-95 disabled:opacity-50">
                <span className="material-symbols-outlined">lock</span>
                Fechar Caixa
              </button>
            </div>
          </>
        )}

        {/* Fechamento resumo */}
        {resumo && !caixaAberto && (
          <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-sm space-y-xl">
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-2xl">receipt_long</span>
              </div>
              <div>
                <h2 className="text-headline-md font-semibold text-on-surface">Resumo do Fechamento</h2>
                <p className="text-body-sm text-on-surface-variant">Caixa #{resumo.id} encerrado com sucesso</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-md">
              {[
                ['Loja', resumo.nome_loja],
                ['Operador', resumo.login_usuario_fechamento],
                ['Abertura', fmtDT(resumo.data_abertura)],
                ['Fechamento', fmtDT(resumo.data_fechamento)],
              ].map(([l, v]) => (
                <div key={l} className="p-md bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <span className="text-[12px] font-bold text-on-surface-variant block mb-xs">{l}</span>
                  <span className="text-body-md font-semibold">{v || '—'}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-md p-lg bg-primary-container/10 rounded-xl border border-primary/20">
              {[
                { label: 'Valor Inicial', value: fmt(resumo.valor_inicial), cls: 'text-on-surface' },
                { label: '→', value: null },
                { label: 'Valor Final', value: fmt(resumo.valor_final), cls: 'text-on-surface' },
                { label: '=', value: null },
                { label: 'Movimentação', value: fmt((resumo.valor_final ?? 0) - (resumo.valor_inicial ?? 0)), cls: (resumo.valor_final ?? 0) >= (resumo.valor_inicial ?? 0) ? 'text-emerald-600' : 'text-error' },
              ].map(({ label, value, cls }, i) => (
                value === null ? (
                  <span key={i} className="text-headline-md font-bold text-on-surface-variant">{label}</span>
                ) : (
                  <div key={label} className="flex flex-col items-center flex-1">
                    <span className="text-[12px] font-bold text-on-surface-variant">{label}</span>
                    <strong className={`text-headline-md font-semibold ${cls}`}>{value}</strong>
                  </div>
                )
              ))}
            </div>

            <button onClick={abrirCaixa} disabled={loading} className="w-full h-12 bg-primary text-on-primary text-label-md font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined">lock_open</span>
              {loading ? 'Abrindo...' : 'Abrir Novo Caixa'}
            </button>
          </div>
        )}
      </div>

      {/* Confirm close modal */}
      {confirmFechar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !loading && setConfirmFechar(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-md p-xl border border-outline-variant" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center gap-md mb-xl">
              <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-3xl">lock</span>
              </div>
              <h2 className="text-headline-md font-semibold">Fechar o caixa?</h2>
              <p className="text-body-md text-on-surface-variant">Você está prestes a encerrar o caixa <strong>#{caixaId}</strong>. Certifique-se que todas as vendas foram finalizadas.</p>
            </div>
            <div className="flex gap-sm p-md bg-surface-container-low rounded-xl border border-outline-variant mb-lg text-body-sm text-on-surface-variant">
              <span>🏦 {caixaAberto?.nome_loja}</span>
              <span className="mx-sm opacity-30">·</span>
              <span>⏱ {duracao}</span>
            </div>
            <div className="flex gap-md">
              <button onClick={() => setConfirmFechar(false)} disabled={loading} className="flex-1 py-sm border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={fecharCaixa} disabled={loading} className="flex-1 py-sm bg-error text-on-error rounded-xl text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? 'Fechando...' : 'Sim, fechar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
