import { useState, useEffect } from 'react';
import { entradaMercadoriaService } from '../api/entradaMercadoriaService';
import { showAlert } from '../components/Alert';

const fmtDT = dt => {
  if (!dt) return '—';
  try { return new Date(dt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return dt; }
};

export default function EntradaMercadoria() {
  const [notas, setNotas]                   = useState([]);
  const [obs, setObs]                       = useState('');
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [loading, setLoading]               = useState(true);
  const [confirmando, setConfirmando]       = useState(false);

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
      showAlert('Entrada de mercadoria realizada com sucesso!', 'success');
      setNotaSelecionada(null); setObs(''); carregar();
    } catch (err) {
      showAlert(err.displayMessage || err.message || 'Erro ao realizar entrada', 'error');
    } finally { setConfirmando(false); }
  };

  return (
    <>
      <div className="p-xl space-y-xl max-w-7xl mx-auto w-full">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline-md font-bold text-on-surface">Entrada de Mercadoria</h1>
            <p className="text-body-sm text-on-surface-variant mt-xs">Receba e confirme notas fiscais em trânsito</p>
          </div>
          <button
            onClick={carregar}
            className="flex items-center gap-sm px-md py-sm bg-surface-container border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container-high transition-all min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Atualizar
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-2xl">
            <div className="flex flex-col items-center gap-md text-on-surface-variant">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-body-md">Carregando notas em trânsito...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && notas.length === 0 && (
          <div className="bg-surface border border-outline-variant rounded-2xl p-2xl flex flex-col items-center text-center gap-lg shadow-card">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">Tudo em dia!</h2>
              <p className="text-body-md text-on-surface-variant mt-xs">
                Não há notas fiscais de transferência aguardando recebimento.
              </p>
            </div>
            <div className="flex items-center gap-sm px-lg py-md bg-emerald-100 border border-emerald-200 rounded-xl">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">inventory</span>
              <p className="text-label-md font-semibold text-emerald-700">Estoque atualizado</p>
            </div>
          </div>
        )}

        {/* Notes Table */}
        {!loading && notas.length > 0 && (
          <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-card">

            {/* Table header */}
            <div className="px-xl py-lg border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-md">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 text-[20px]">local_shipping</span>
                </div>
                <div>
                  <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Notas em Trânsito</h2>
                  <p className="text-[11px] text-on-surface-variant">Aguardando conferência e entrada no estoque</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-xs px-md py-sm rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-label-md font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {notas.length} pendente{notas.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Nº Nota', 'Loja Origem', 'Loja Destino', 'Data de Envio', 'Ação'].map(h => (
                      <th key={h} className="px-lg py-md text-[11px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notas.map((nota, i) => (
                    <tr
                      key={nota.id}
                      className={`hover:bg-surface-container/50 transition-colors border-b border-outline-variant/30 last:border-0 ${i % 2 !== 0 ? 'bg-surface-container-low/20' : ''}`}
                    >
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-[16px]">description</span>
                          </div>
                          <span className="font-geist-mono text-label-md font-bold text-on-surface">#{nota.numero_Nota}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-on-surface-variant text-[16px]">store</span>
                          <span className="text-body-sm font-semibold text-on-surface">{nota.loja_Origem_Nome}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-primary text-[16px]">store</span>
                          <span className="text-body-sm font-semibold text-on-surface">{nota.loja_Destino_Nome}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <span className="text-body-sm text-on-surface-variant">{fmtDT(nota.data_Envio)}</span>
                      </td>
                      <td className="px-lg py-md">
                        <button
                          onClick={() => { setNotaSelecionada(nota); setObs(''); }}
                          className="flex items-center gap-xs px-lg min-h-[40px] bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          Receber
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="px-xl py-md border-t border-outline-variant bg-surface-container-low">
              <p className="text-body-sm text-on-surface-variant">
                <strong className="text-on-surface">{notas.length}</strong> nota{notas.length !== 1 ? 's' : ''} aguardando recebimento
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {notaSelecionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-md"
          onClick={() => !confirmando && setNotaSelecionada(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center gap-md p-lg border-b border-outline-variant bg-surface-container-low">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
              </div>
              <div className="flex-1">
                <h2 className="text-headline-md font-bold text-on-surface">Confirmar Recebimento</h2>
                <p className="text-body-sm text-on-surface-variant">Nota Fiscal <span className="font-geist-mono font-bold">#{notaSelecionada.numero_Nota}</span></p>
              </div>
              <button
                onClick={() => !confirmando && setNotaSelecionada(null)}
                className="p-sm hover:bg-surface-container rounded-xl transition-colors text-on-surface-variant flex-shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-lg space-y-md">
              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                {[
                  { label: 'Origem', value: notaSelecionada.loja_Origem_Nome, icon: 'storefront' },
                  { label: 'Destino', value: notaSelecionada.loja_Destino_Nome, icon: 'store' },
                  { label: 'Enviado em', value: fmtDT(notaSelecionada.data_Envio), icon: 'calendar_today' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="p-md bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <div className="flex items-center gap-xs mb-xs">
                      <span className="material-symbols-outlined text-on-surface-variant text-[14px]">{icon}</span>
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
                    </div>
                    <span className="text-body-sm font-semibold text-on-surface">{value}</span>
                  </div>
                ))}
              </div>

              {/* Observação */}
              <div className="space-y-xs">
                <label className="text-label-md font-semibold text-on-surface-variant">Observação (opcional)</label>
                <input
                  type="text"
                  value={obs}
                  onChange={e => setObs(e.target.value)}
                  placeholder="Ex: Mercadoria recebida sem avarias"
                  className="w-full min-h-[44px] px-md bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:border-primary input-focus-ring transition-all outline-none"
                />
              </div>

              {/* Warning */}
              <div className="flex items-start gap-sm p-md bg-amber-50 border border-amber-200 rounded-xl">
                <span className="material-symbols-outlined text-amber-600 text-[18px] mt-xs flex-shrink-0">warning</span>
                <p className="text-body-sm text-amber-700">
                  Ao confirmar, o estoque da loja destino será atualizado automaticamente. Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-lg border-t border-outline-variant flex gap-md">
              <button
                onClick={() => setNotaSelecionada(null)}
                disabled={confirmando}
                className="flex-1 min-h-[44px] border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={realizarEntrada}
                disabled={confirmando}
                className="flex-1 min-h-[44px] bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined text-[18px]">{confirmando ? 'sync' : 'check_circle'}</span>
                {confirmando ? 'Confirmando...' : 'Confirmar Entrada'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
