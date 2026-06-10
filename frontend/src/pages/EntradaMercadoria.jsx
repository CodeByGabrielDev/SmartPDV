import { useState, useEffect } from 'react';
import { entradaMercadoriaService } from '../api/entradaMercadoriaService';
import { showAlert } from '../components/Alert';

const fmtDT = dt => { if (!dt) return '—'; try { return new Date(dt).toLocaleString('pt-BR'); } catch { return dt; } };

export default function EntradaMercadoria() {
  const [notas, setNotas] = useState([]);
  const [obs, setObs] = useState('');
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try { setNotas((await entradaMercadoriaService.listarNotasTransito()) || []); }
    catch (err) { showAlert(err.displayMessage || err.message || 'Erro ao carregar notas', 'error'); }
    finally { setLoading(false); }
  };

  const realizarEntrada = async () => {
    if (!notaSelecionada) return;
    setConfirmando(true);
    try {
      await entradaMercadoriaService.entradaDeMercadoria(notaSelecionada.id, obs);
      showAlert('Entrada de mercadoria realizada!', 'success');
      setNotaSelecionada(null); setObs(''); carregar();
    } catch (err) { showAlert(err.displayMessage || err.message || 'Erro ao realizar entrada', 'error'); }
    finally { setConfirmando(false); }
  };

  return (
    <>
      <div className="p-xl space-y-xl max-w-7xl mx-auto w-full">
        {/* Empty state */}
        {!loading && notas.length === 0 && (
          <div className="bg-surface border border-outline-variant rounded-2xl p-2xl flex flex-col items-center text-center gap-lg">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40">inventory_2</span>
            </div>
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">Nenhuma nota pendente</h2>
              <p className="text-body-md text-on-surface-variant mt-xs">Não há notas fiscais de transferência aguardando recebimento.</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-2xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Notes table */}
        {!loading && notas.length > 0 && (
          <div className="glass-card border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-sm">
                <h2 className="text-headline-md font-semibold text-on-surface">Notas em Trânsito</h2>
                <span className="px-sm py-xs rounded-full bg-amber-100 text-amber-700 text-label-md font-bold border border-amber-200">
                  {notas.length} pendente{notas.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button onClick={carregar} className="p-sm hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    {['Nº Nota', 'Loja Origem', 'Loja Destino', 'Data de Envio', 'Ação'].map(h => (
                      <th key={h} className="px-md py-lg text-[14px] font-bold text-on-surface-variant tracking-wider uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {notas.map(nota => (
                    <tr key={nota.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-md py-md">
                        <span className="font-geist-mono text-label-md font-semibold text-on-surface">#{nota.numero_Nota}</span>
                      </td>
                      <td className="px-md py-md text-body-sm text-on-surface">{nota.loja_Origem_Nome}</td>
                      <td className="px-md py-md text-body-sm text-on-surface">{nota.loja_Destino_Nome}</td>
                      <td className="px-md py-md text-body-sm text-on-surface-variant">{fmtDT(nota.data_Envio)}</td>
                      <td className="px-md py-md">
                        <button
                          onClick={() => { setNotaSelecionada(nota); setObs(''); }}
                          className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Confirmar Entrada
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {notaSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-md" onClick={() => !confirmando && setNotaSelecionada(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-md p-lg border-b border-outline-variant">
              <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-headline-md font-semibold">Confirmar Entrada</h2>
                <p className="text-body-sm text-on-surface-variant">Nota Fiscal #{notaSelecionada.numero_Nota}</p>
              </div>
              <button onClick={() => !confirmando && setNotaSelecionada(null)} className="p-sm hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-lg space-y-md">
              <div className="grid grid-cols-2 gap-md">
                {[
                  ['Origem', notaSelecionada.loja_Origem_Nome],
                  ['Destino', notaSelecionada.loja_Destino_Nome],
                  ['Data de Envio', fmtDT(notaSelecionada.data_Envio)],
                ].map(([l, v]) => (
                  <div key={l} className="p-sm bg-surface-container-low rounded-lg border border-outline-variant/30">
                    <span className="text-[12px] font-bold text-on-surface-variant block mb-xs">{l}</span>
                    <span className="text-body-sm font-semibold">{v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant">Observação (opcional)</label>
                <input
                  type="text"
                  value={obs}
                  onChange={e => setObs(e.target.value)}
                  placeholder="Ex: Mercadoria recebida sem avarias"
                  className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:border-primary input-focus-ring transition-all outline-none"
                />
              </div>
            </div>

            <div className="p-lg border-t border-outline-variant flex gap-md">
              <button onClick={() => setNotaSelecionada(null)} disabled={confirmando} className="flex-1 py-sm border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all">
                Cancelar
              </button>
              <button onClick={realizarEntrada} disabled={confirmando} className="flex-1 py-sm bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {confirmando ? 'Confirmando...' : 'Confirmar Entrada'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
