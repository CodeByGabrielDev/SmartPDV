import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { vendaService } from '../api/vendaService';
import { showAlert } from '../components/Alert';

function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

function statusBadge(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('cancel')) return 'bg-red-100 text-red-700 border-red-200';
  if (s.includes('pend'))   return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
}

function statusLabel(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('cancel')) return 'Cancelada';
  if (s.includes('pend'))   return 'Pendente';
  return 'Concluída';
}

const fmt = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmtData = s => {
  if (!s) return '—';
  try { return new Date(s).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }
  catch { return s; }
};

function StatCard({ icon, iconBg, iconColor, label, value }) {
  return (
    <div className="bg-surface border border-outline-variant rounded-2xl p-lg flex items-center gap-md">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <span className={`material-symbols-outlined ${iconColor} text-[20px]`}>{icon}</span>
      </div>
      <div>
        <p className="text-label-md text-on-surface-variant">{label}</p>
        <p className="text-headline-md font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}

export default function Tickets() {
  const hoje = new Date();
  const [dataInicial, setDataInicial] = useState(toDateStr(hoje));
  const [dataFinal,   setDataFinal]   = useState(toDateStr(hoje));
  const [vendas,       setVendas]       = useState([]);
  const [carregando,   setCarregando]   = useState(false);
  const [busca,        setBusca]        = useState('');
  const [detalhe,      setDetalhe]      = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [cancelando,   setCancelando]   = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const data = await vendaService.relatorioVendas(
        `${dataInicial}T00:00:00`,
        `${dataFinal}T23:59:59`,
      );
      setVendas(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao carregar vendas', 'error');
      setVendas([]);
    } finally {
      setCarregando(false);
    }
  }, [dataInicial, dataFinal]);

  useEffect(() => { carregar(); }, [carregar]);

  const getId = v => v?.id ?? v?.idVenda ?? v?.id_banco;

  const vendasFiltradas = vendas.filter(v => {
    if (!busca) return true;
    const t = busca.toLowerCase();
    return (
      String(getId(v) || '').includes(t) ||
      (v.cliente?.nome  || '').toLowerCase().includes(t) ||
      (v.nomeCliente    || '').toLowerCase().includes(t) ||
      (v.cpfCliente     || '').includes(t) ||
      (v.ticket_venda   || '').toLowerCase().includes(t)
    );
  });

  const totalValor      = vendasFiltradas.reduce((acc, v) => acc + (v.valorTotal || 0), 0);
  const totalCanceladas = vendasFiltradas.filter(v => (v.status || '').toLowerCase().includes('cancel')).length;

  const podeCancelar = v => !(v.status || '').toLowerCase().includes('cancel');

  const abrirCancelar = (e, venda) => {
    e.stopPropagation();
    setConfirmModal({ venda });
  };

  const confirmarCancelamento = async () => {
    const id = getId(confirmModal.venda);
    if (!id) { showAlert('Não foi possível identificar a venda.', 'error'); return; }
    setCancelando(true);
    try {
      await vendaService.cancelarVenda(id);
      showAlert('Venda cancelada com sucesso!', 'success');
      setConfirmModal(null);
      if (getId(detalhe) === id) setDetalhe(null);
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao cancelar venda', 'error');
    } finally {
      setCancelando(false);
    }
  };

  const inputCls = 'px-md py-sm bg-surface border border-outline-variant rounded-xl text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all';

  return (
    <div className="p-xl space-y-lg max-w-7xl mx-auto w-full">

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-md bg-surface border border-outline-variant rounded-2xl p-lg">
        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-semibold text-on-surface-variant">Data inicial</label>
          <input type="date" value={dataInicial} onChange={e => setDataInicial(e.target.value)} className={inputCls} />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="text-label-md font-semibold text-on-surface-variant">Data final</label>
          <input type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)} className={inputCls} />
        </div>
        <button
          onClick={carregar}
          disabled={carregando}
          className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-xl text-label-md font-bold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          <span className={`material-symbols-outlined text-[20px] ${carregando ? 'animate-spin' : ''}`}>
            {carregando ? 'progress_activity' : 'search'}
          </span>
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>

        {/* Busca textual */}
        <div className="relative flex-1 min-w-[220px] ml-auto">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">manage_search</span>
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Filtrar por ID, cliente, CPF, ticket..."
            className={`w-full pl-xl ${inputCls}`}
          />
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <StatCard icon="receipt_long"  iconBg="bg-primary/10"  iconColor="text-primary"      label="Total de Vendas"   value={vendasFiltradas.length} />
        <StatCard icon="payments"      iconBg="bg-emerald-100" iconColor="text-emerald-600"  label="Valor Total"       value={fmt(totalValor)} />
        <StatCard icon="cancel"        iconBg="bg-red-100"     iconColor="text-red-500"      label="Canceladas"        value={totalCanceladas} />
      </div>

      {/* Lista + Painel de detalhe */}
      <div className="flex gap-lg items-start">

        {/* Lista */}
        <div className="flex-1 min-w-0 space-y-sm">
          {carregando ? (
            <div className="flex justify-center items-center py-2xl gap-md text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
              <span className="text-label-md">Carregando vendas...</span>
            </div>
          ) : vendasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center py-2xl gap-md text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl opacity-40">confirmation_number</span>
              <p className="text-label-md">Nenhuma venda encontrada para o período selecionado.</p>
            </div>
          ) : vendasFiltradas.map(v => {
            const id        = getId(v);
            const ativo     = podeCancelar(v);
            const selecionado = getId(detalhe) === id;

            return (
              <div
                key={id}
                onClick={() => setDetalhe(selecionado ? null : v)}
                className={`bg-surface border rounded-2xl px-lg py-md flex items-center gap-md cursor-pointer hover:border-primary transition-all duration-200 ${selecionado ? 'border-primary ring-2 ring-primary/10' : 'border-outline-variant'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">confirmation_number</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-sm flex-wrap">
                    <span className="text-label-md font-bold text-on-surface">
                      #{id}{v.ticket_venda ? ` · ${v.ticket_venda}` : ''}
                    </span>
                    <span className={`text-[11px] font-semibold px-sm py-[2px] rounded-full border ${statusBadge(v.status)}`}>
                      {statusLabel(v.status)}
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant truncate">
                    {fmtData(v.dataHora)}
                    {(v.cliente?.nome || v.nomeCliente) && ` · ${v.cliente?.nome || v.nomeCliente}`}
                  </p>
                </div>

                <div className="text-right flex-shrink-0 mr-sm">
                  <p className="text-label-md font-bold text-on-surface">{fmt(v.valorTotal)}</p>
                  {v.desconto > 0 && (
                    <p className="text-body-sm text-on-surface-variant">desc. {fmt(v.desconto)}</p>
                  )}
                </div>

                {ativo ? (
                  <button
                    onClick={e => abrirCancelar(e, v)}
                    title="Cancelar venda"
                    className="p-sm rounded-xl text-error hover:bg-error-container/20 transition-all flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                  </button>
                ) : (
                  <div className="w-9 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Painel de detalhes */}
        {detalhe && (
          <div className="w-80 flex-shrink-0 bg-surface border border-outline-variant rounded-2xl p-lg space-y-md sticky top-20">
            <div className="flex items-center justify-between">
              <h3 className="text-label-md font-bold text-on-surface">Detalhes</h3>
              <button
                onClick={() => setDetalhe(null)}
                className="p-xs rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="border-t border-outline-variant/50" />

            <div className="space-y-sm text-body-sm">
              <Row label="ID da Venda"  value={`#${getId(detalhe)}`} />
              {detalhe.ticket_venda && <Row label="Ticket"   value={detalhe.ticket_venda} />}
              <Row label="Data / Hora" value={fmtData(detalhe.dataHora)} />
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Status</span>
                <span className={`text-[11px] font-semibold px-sm py-[2px] rounded-full border ${statusBadge(detalhe.status)}`}>
                  {statusLabel(detalhe.status)}
                </span>
              </div>
              <Row label="Valor Total" value={fmt(detalhe.valorTotal)} bold />
              {detalhe.desconto > 0 && <Row label="Desconto" value={fmt(detalhe.desconto)} />}
              {(detalhe.cliente?.nome || detalhe.nomeCliente) && (
                <Row label="Cliente" value={detalhe.cliente?.nome || detalhe.nomeCliente} />
              )}
              {detalhe.cpfCliente && <Row label="CPF/CNPJ" value={detalhe.cpfCliente} />}
            </div>

            {/* Itens */}
            {detalhe.itens?.length > 0 && (
              <div className="space-y-xs">
                <div className="border-t border-outline-variant/50" />
                <p className="text-label-md font-bold text-on-surface">Itens ({detalhe.itens.length})</p>
                <div className="space-y-xs max-h-52 overflow-y-auto custom-scrollbar pr-xs">
                  {detalhe.itens.map((item, i) => (
                    <div key={i} className="flex justify-between text-body-sm bg-surface-container rounded-lg px-sm py-xs gap-sm">
                      <span className="text-on-surface truncate flex-1">
                        {item.nomeProduto || item.descricao || item.nome || `Item ${i + 1}`}
                      </span>
                      <span className="text-on-surface-variant flex-shrink-0">
                        {item.quantidade || item.quantidadeItens || 1}×
                      </span>
                      <span className="font-semibold text-on-surface flex-shrink-0">
                        {fmt(item.valorTotal || item.precoUnitario || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {podeCancelar(detalhe) && (
              <>
                <div className="border-t border-outline-variant/50" />
                <button
                  onClick={e => abrirCancelar(e, detalhe)}
                  className="w-full flex items-center justify-center gap-sm px-md py-sm bg-error text-on-error rounded-xl text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                  Cancelar Venda
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmação */}
      {confirmModal && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-md">
          <div className="bg-surface rounded-2xl shadow-card-lg p-xl max-w-md w-full space-y-lg">
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-2xl bg-error-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-error text-2xl">warning</span>
              </div>
              <div>
                <h3 className="text-headline-md font-bold text-on-surface">Cancelar Venda</h3>
                <p className="text-body-sm text-on-surface-variant">Esta ação não poderá ser desfeita</p>
              </div>
            </div>

            <p className="text-body-md text-on-surface">
              Você está prestes a cancelar a{' '}
              <strong>Venda #{getId(confirmModal.venda)}</strong> no valor de{' '}
              <strong>{fmt(confirmModal.venda.valorTotal)}</strong>.
              O estoque será revertido conforme validação fiscal.
            </p>

            <div className="flex gap-md">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={cancelando}
                className="flex-1 px-md py-sm border border-outline-variant rounded-xl text-label-md font-semibold text-on-surface hover:bg-surface-container transition-all disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={confirmarCancelamento}
                disabled={cancelando}
                className="flex-1 px-md py-sm bg-error text-on-error rounded-xl text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-sm disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[20px] ${cancelando ? 'animate-spin' : ''}`}>
                  {cancelando ? 'progress_activity' : 'cancel'}
                </span>
                {cancelando ? 'Cancelando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-start gap-sm">
      <span className="text-on-surface-variant flex-shrink-0">{label}</span>
      <span className={`text-right ${bold ? 'font-bold text-on-surface' : 'font-semibold text-on-surface'}`}>{value}</span>
    </div>
  );
}
