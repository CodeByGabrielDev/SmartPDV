import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { notaFiscalService } from '../api/notaFiscalService';
import { lojaService } from '../api/lojaService';
import { showAlert } from '../components/Alert';
import { gerarNotaPDF } from '../utils/gerarNotaPDF';

const CFOPS_TRANSFERENCIA = [5152, 6152];
const CFOPS_COMUNS = [
  { value: 5101, label: '5101 — Venda de produção do estabelecimento' },
  { value: 5102, label: '5102 — Venda de mercadoria adquirida' },
  { value: 5152, label: '5152 — Transferência de mercadoria (estadual)' },
  { value: 6101, label: '6101 — Venda de produção (interestadual)' },
  { value: 6102, label: '6102 — Venda de mercadoria (interestadual)' },
  { value: 6152, label: '6152 — Transferência de mercadoria (interestadual)' },
];
const FORM_INICIAL = { cfop: 5102, serieNfe: 1, cpfCliente: '', idLoja: null };
const ITEM_INICIAL = { codigo_barra: '', quantidade_Itens: 1, desconto: 0 };

function statusBadge(status) {
  const s = status?.toLowerCase() || 'pendente';
  const map = {
    autorizada:  'bg-emerald-100 text-emerald-700 border-emerald-200',
    pendente:    'bg-amber-100 text-amber-700 border-amber-200',
    cancelada:   'bg-red-100 text-red-700 border-red-200',
    rejeitada:   'bg-red-100 text-red-700 border-red-200',
  };
  return map[s] || 'bg-surface-container text-on-surface-variant border-outline-variant';
}

const inputCls = 'w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all';

export default function NotaFiscal() {
  const [aba, setAba] = useState('historico');
  const [modalAberto, setModalAberto] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [notaDetalhes, setNotaDetalhes] = useState(null);
  const [abaDetalhes, setAbaDetalhes] = useState('resumo');
  const [form, setForm] = useState(FORM_INICIAL);
  const [itemForm, setItemForm] = useState(ITEM_INICIAL);
  const [itens, setItens] = useState([]);
  const [emitindo, setEmitindo] = useState(false);
  const [lojas, setLojas] = useState([]);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);
  const [buscaLoja, setBuscaLoja] = useState('');
  const [carregandoLojas, setCarregandoLojas] = useState(false);
  const [notas, setNotas] = useState([]);
  const [carregandoNotas, setCarregandoNotas] = useState(false);
  const [buscaHistorico, setBuscaHistorico] = useState('');
  const [gerandoPDF, setGerandoPDF] = useState(null); // id da nota sendo gerada
  const [confirmModal, setConfirmModal] = useState(null); // { tipo: 'cancelar'|'inutilizar', nota }
  const [motivo, setMotivo] = useState('');
  const [processando, setProcessando] = useState(false);

  const handleGerarPDF = async (e, nota) => {
    e.stopPropagation();
    setGerandoPDF(nota.nf_numero);
    try {
      await gerarNotaPDF(nota);
    } catch {
      showAlert('Erro ao gerar PDF. Tente novamente.', 'error');
    } finally {
      setGerandoPDF(null);
    }
  };
  const abrirCancelar = async (e, nota) => {
    e.stopPropagation();
    let notaAtualizada = nota;
    if (!nota.id) {
      const lista = await notaFiscalService.listarNotas();
      notaAtualizada = lista.find(n => n.nf_numero === nota.nf_numero) || nota;
    }
    setMotivo('');
    setConfirmModal({ tipo: 'cancelar', nota: notaAtualizada });
  };
  const abrirInutilizar = async (e, nota) => {
    e.stopPropagation();
    let notaAtualizada = nota;
    if (!nota.id) {
      const lista = await notaFiscalService.listarNotas();
      notaAtualizada = lista.find(n => n.nf_numero === nota.nf_numero) || nota;
    }
    setConfirmModal({ tipo: 'inutilizar', nota: notaAtualizada });
  };
  const confirmarAcao = async () => {
    if (confirmModal.tipo === 'cancelar' && !motivo.trim()) { showAlert('Informe o motivo do cancelamento', 'error'); return; }
    const idNota = confirmModal.nota.id;
    if (!idNota) { showAlert('Não foi possível identificar a nota. Recarregando lista...', 'error'); carregarNotas(); setConfirmModal(null); return; }
    setProcessando(true);
    try {
      if (confirmModal.tipo === 'cancelar') {
        await notaFiscalService.cancelarNota(idNota, motivo.trim());
        showAlert('Nota fiscal cancelada com sucesso!', 'success');
      } else {
        await notaFiscalService.inutilizarNota(idNota);
        showAlert('Nota fiscal inutilizada com sucesso!', 'success');
      }
      setConfirmModal(null);
      if (notaDetalhes?.id === idNota) { setNotaDetalhes(null); setAbaDetalhes('resumo'); }
      carregarNotas();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao processar operação', 'error');
    } finally {
      setProcessando(false);
    }
  };

  const ehTransferencia = CFOPS_TRANSFERENCIA.includes(Number(form.cfop));

  useEffect(() => { if (aba === 'historico') carregarNotas(); }, [aba]);
  useEffect(() => {
    if (ehTransferencia && lojas.length === 0) carregarLojas();
    setLojaSelecionada(null);
    setForm(f => ({ ...f, cpfCliente: '', idLoja: null }));
  }, [form.cfop]);

  const carregarNotas = async () => {
    setCarregandoNotas(true);
    try { setNotas((await notaFiscalService.listarNotas()) || []); }
    catch (err) { showAlert(err.displayMessage || 'Erro ao carregar notas', 'error'); }
    finally { setCarregandoNotas(false); }
  };

  const carregarLojas = async () => {
    setCarregandoLojas(true);
    try { setLojas((await lojaService.listarLojasAtivas()) || []); }
    catch (err) { showAlert(err.displayMessage || 'Erro ao buscar lojas', 'error'); }
    finally { setCarregandoLojas(false); }
  };

  const adicionarItem = () => {
    if (!itemForm.codigo_barra.trim()) return;
    setItens(prev => [...prev, {
      codigo_barra: itemForm.codigo_barra.trim(),
      quantidade_Itens: parseInt(itemForm.quantidade_Itens) || 1,
      desconto: parseFloat(itemForm.desconto) || 0,
    }]);
    setItemForm(ITEM_INICIAL);
  };

  const removerItem = idx => setItens(prev => prev.filter((_, i) => i !== idx));

  const podeProsseguir = ehTransferencia ? lojaSelecionada !== null : !!form.cpfCliente.trim();

  const emitirNota = async () => {
    if (itens.length === 0) { showAlert('Adicione pelo menos um item', 'error'); return; }
    setEmitindo(true);
    try {
      const payload = {
        cfop: Number(form.cfop),
        serieNfe: Number(form.serieNfe),
        codigo_barra: itens,
        ...(ehTransferencia ? { id_Loja: lojaSelecionada.id } : { cpf_cliente: form.cpfCliente }),
      };
      const response = await notaFiscalService.emitirNotaAvulsa(payload);
      showAlert(`NF-e nº ${response.nf_numero} emitida com sucesso!`, 'success');
      fecharModal();
      if (aba === 'historico') carregarNotas();
    } catch (err) { showAlert(err.displayMessage || 'Erro ao emitir nota', 'error'); }
    finally { setEmitindo(false); }
  };

  const abrirModal = () => { setForm(FORM_INICIAL); setItens([]); setItemForm(ITEM_INICIAL); setLojaSelecionada(null); setEtapa(1); setModalAberto(true); };
  const fecharModal = () => { setModalAberto(false); setEtapa(1); };

  const fmt = v => v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';

  const lojasFiltradas = lojas.filter(l =>
    l.razaoSocial?.toLowerCase().includes(buscaLoja.toLowerCase()) ||
    (l.cnpj || l.cpfCnpj || '').includes(buscaLoja)
  );

  const notasFiltradas = notas.filter(n => {
    const t = buscaHistorico.toLowerCase();
    return !t || String(n.nf_numero).includes(t) || n.cpf_Cliente?.includes(t) || n.loja?.toLowerCase().includes(t);
  });

  return (
    <>
      <div className="p-xl space-y-xl max-w-7xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex items-center gap-xl border-b border-outline-variant">
          {[
            { id: 'historico', icon: 'history', label: 'Histórico' },
            { id: 'emissao',   icon: 'add_circle', label: 'Emissão' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setAba(t.id); if (t.id === 'emissao') abrirModal(); }}
              className={`relative pb-md text-label-md font-semibold flex items-center gap-xs transition-colors ${aba === t.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
              {t.label}
              {aba === t.id && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-t" />}
            </button>
          ))}
          <div className="ml-auto pb-md">
            <button onClick={abrirModal} className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-xl text-label-md font-bold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all">
              <span className="material-symbols-outlined">download</span>
              Emitir Nota Fiscal
            </button>
          </div>
        </div>

        {/* Histórico */}
        {aba === 'historico' && (
          <div className="space-y-lg">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
                <input
                  type="text"
                  value={buscaHistorico}
                  onChange={e => setBuscaHistorico(e.target.value)}
                  placeholder="Buscar por número, CPF ou cliente..."
                  className="w-full pl-xl pr-md py-sm bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
                />
              </div>
              <div className="flex items-center gap-sm">
                <button className="flex items-center gap-sm px-md py-sm bg-surface border border-outline-variant rounded-xl text-on-surface text-label-md font-semibold hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined">filter_list</span>
                  Filtros
                </button>
                <button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-xl text-label-md font-semibold shadow-sm hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined">download</span>
                  Exportar XML
                </button>
              </div>
            </div>

            {carregandoNotas ? (
              <div className="flex items-center justify-center py-2xl">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notasFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-2xl text-on-surface-variant">
                <span className="material-symbols-outlined text-7xl opacity-20 mb-md">description</span>
                <p className="text-body-md">Nenhuma nota fiscal emitida</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {notasFiltradas.map((nota, idx) => {
                  const status = nota.status_Nota?.toLowerCase() || 'pendente';
                  const cfopLabel = CFOPS_COMUNS.find(c => c.value === nota.cfop)?.label?.split('—')[1]?.trim() || `CFOP ${nota.cfop}`;
                  return (
                    <div
                      key={idx}
                      onClick={() => setNotaDetalhes(nota)}
                      className="bg-surface p-md rounded-2xl border border-outline-variant shadow-card cursor-pointer
                                 transition-all duration-300 ease-out
                                 hover:-translate-y-2 hover:shadow-card-lg hover:border-primary/30"
                    >
                      <div className="flex justify-between items-start mb-md">
                        <div>
                          <p className="text-body-sm text-on-surface-variant font-geist-mono text-mono-label">NF-e #{nota.nf_numero}</p>
                          <h3 className="text-label-md font-semibold text-on-surface mt-xs">{nota.cpf_Cliente || nota.loja || 'Consumidor Final'}</h3>
                        </div>
                        <span className={`px-sm py-xs rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge(nota.status_Nota)}`}>
                          {nota.status_Nota || 'PENDENTE'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-sm text-body-sm mb-md">
                        <div className="flex flex-col">
                          <span className="text-on-surface-variant text-[12px]">Série</span>
                          <span className="font-bold">{nota.serieNf || '—'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-on-surface-variant text-[12px]">CFOP</span>
                          <span className="font-bold font-geist-mono">{nota.cfop}</span>
                        </div>
                        <div className="col-span-2 flex flex-col">
                          <span className="text-on-surface-variant text-[12px]">Emissão</span>
                          <span className="font-bold">
                            {nota.data_Emissao ? new Date(nota.data_Emissao).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="pt-md border-t border-outline-variant flex justify-between items-center">
                        <div>
                          <span className="text-on-surface-variant text-[12px]">Total Bruto</span>
                          <p className="text-primary font-bold">{fmt(nota.valor_Bruto_Nota)}</p>
                        </div>
                        <div className="flex gap-xs">
                          <button
                            className="p-sm rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary-container transition-all"
                            title="Visualizar nota"
                            onClick={e => { e.stopPropagation(); setNotaDetalhes(nota); }}
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button
                            className="p-sm rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary-container transition-all disabled:opacity-50"
                            title="Baixar PDF"
                            onClick={e => handleGerarPDF(e, nota)}
                            disabled={gerandoPDF === nota.nf_numero}
                          >
                            {gerandoPDF === nota.nf_numero
                              ? <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                              : <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                            }
                          </button>
                          {nota.status_Nota?.toUpperCase() === 'AUTORIZADA' && (
                            <button
                              className="p-sm rounded-lg bg-surface-container hover:bg-error-container hover:text-error transition-all"
                              title="Cancelar nota"
                              onClick={e => abrirCancelar(e, nota)}
                            >
                              <span className="material-symbols-outlined text-[20px]">cancel</span>
                            </button>
                          )}
                          {nota.status_Nota?.toUpperCase() === 'PENDENTE' && (
                            <button
                              className="p-sm rounded-lg bg-surface-container hover:bg-tertiary-container hover:text-on-tertiary-container transition-all"
                              title="Inutilizar nota"
                              onClick={e => abrirInutilizar(e, nota)}
                            >
                              <span className="material-symbols-outlined text-[20px]">block</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL DETALHES ── */}
      {notaDetalhes && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-md" onClick={() => { setNotaDetalhes(null); setAbaDetalhes('resumo'); }}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-outline-variant overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-md p-lg border-b border-outline-variant flex-shrink-0">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">description</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-sm">
                  <h2 className="text-headline-md font-semibold text-on-surface">NF-e <span className="font-geist-mono">#{notaDetalhes.nf_numero}</span></h2>
                  <span className={`px-sm py-xs rounded-full text-[10px] font-bold uppercase border ${statusBadge(notaDetalhes.status_Nota)}`}>
                    {notaDetalhes.status_Nota || 'PENDENTE'}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  Série {notaDetalhes.serieNf} · CFOP {notaDetalhes.cfop} ·{' '}
                  {notaDetalhes.data_Emissao ? new Date(notaDetalhes.data_Emissao).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}
                </p>
              </div>
              <button onClick={() => { setNotaDetalhes(null); setAbaDetalhes('resumo'); }} className="p-sm hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-xl px-lg border-b border-outline-variant flex-shrink-0">
              {[
                { id: 'resumo', label: 'Resumo' },
                { id: 'itens', label: `Itens${notaDetalhes.itens?.length ? ` (${notaDetalhes.itens.length})` : ''}` },
                { id: 'impostos', label: `Impostos${notaDetalhes.impostos?.length ? ` (${notaDetalhes.impostos.length})` : ''}` },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setAbaDetalhes(t.id)}
                  className={`relative py-md text-label-md font-semibold transition-colors ${abaDetalhes === t.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {t.label}
                  {abaDetalhes === t.id && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-t" />}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-lg custom-scrollbar">
              {abaDetalhes === 'resumo' && (
                <div className="space-y-lg">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-md">
                    {[
                      { label: 'Valor Bruto', value: fmt(notaDetalhes.valor_Bruto_Nota), cls: 'text-on-surface' },
                      { label: 'Impostos', value: fmt(notaDetalhes.valor_Total_De_Imposto_A_Pagar), cls: 'text-error' },
                      { label: 'Valor Líquido', value: fmt(notaDetalhes.valor_Liquido_Nota), cls: 'text-primary' },
                    ].map(({ label, value, cls }) => (
                      <div key={label} className="p-md bg-surface-container-low rounded-xl border border-outline-variant text-center">
                        <span className="text-[12px] font-bold text-on-surface-variant block mb-xs">{label}</span>
                        <strong className={`text-headline-md font-semibold ${cls}`}>{value}</strong>
                      </div>
                    ))}
                  </div>
                  {/* Info grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="space-y-sm">
                      <p className="text-label-md font-bold text-primary uppercase tracking-wider">Identificação</p>
                      {[
                        ['Número', `#${notaDetalhes.nf_numero}`, true],
                        ['Série', notaDetalhes.serieNf],
                        ['CFOP', notaDetalhes.cfop, true],
                        ['Ticket Venda', notaDetalhes.ticket_venda ? `#${notaDetalhes.ticket_venda}` : null],
                        ['Emitente', notaDetalhes.loja],
                      ].filter(([, v]) => v != null).map(([l, v, mono]) => (
                        <div key={l} className="flex justify-between items-center py-xs border-b border-outline-variant/30">
                          <span className="text-body-sm text-on-surface-variant">{l}</span>
                          <strong className={`text-body-sm ${mono ? 'font-geist-mono' : ''}`}>{v}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-sm">
                      <p className="text-label-md font-bold text-primary uppercase tracking-wider">Financeiro</p>
                      {[
                        ['Bruto', fmt(notaDetalhes.valor_Bruto_Nota)],
                        ['Desconto', `− ${fmt(notaDetalhes.desconto)}`],
                        ['Impostos', fmt(notaDetalhes.valor_Total_De_Imposto_A_Pagar)],
                        ['Líquido', fmt(notaDetalhes.valor_Liquido_Nota)],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between items-center py-xs border-b border-outline-variant/30">
                          <span className="text-body-sm text-on-surface-variant">{l}</span>
                          <strong className="text-body-sm">{v}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {abaDetalhes === 'itens' && (
                <div>
                  {!notaDetalhes.itens?.length ? (
                    <div className="flex flex-col items-center py-xl text-on-surface-variant"><span className="material-symbols-outlined text-5xl opacity-20 mb-sm">inventory_2</span><p>Nenhum item disponível</p></div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-outline-variant">
                      <table className="w-full text-left">
                        <thead className="bg-surface-container-low border-b border-outline-variant">
                          <tr>
                            {['#', 'Produto', 'Qtd', 'Bruto', 'Desc', 'Líquido'].map(h => (
                              <th key={h} className="px-md py-sm text-label-md font-bold text-on-surface-variant">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/30">
                          {notaDetalhes.itens.map((item, i) => (
                            <tr key={i} className="hover:bg-surface-container-lowest transition-colors">
                              <td className="px-md py-md text-mono-label font-geist-mono">{item.numeroItem}</td>
                              <td className="px-md py-md">
                                <strong className="text-body-sm block">{item.descricaoProduto}</strong>
                                <span className="text-[12px] text-on-surface-variant font-geist-mono">{item.codigoBarra}</span>
                              </td>
                              <td className="px-md py-md text-body-sm">{item.quantidade}x</td>
                              <td className="px-md py-md text-body-sm">{fmt(item.valorBrutoItem)}</td>
                              <td className="px-md py-md text-body-sm text-error">{item.desconto > 0 ? `− ${fmt(item.desconto)}` : '—'}</td>
                              <td className="px-md py-md font-bold text-body-sm">{fmt(item.valorLiquidoItem)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-surface-container-low border-t border-outline-variant">
                          <tr>
                            <td colSpan={5} className="px-md py-sm text-label-md font-bold text-on-surface-variant text-right">Total</td>
                            <td className="px-md py-sm font-bold text-primary">{fmt(notaDetalhes.valor_Liquido_Nota)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {abaDetalhes === 'impostos' && (
                <div>
                  {!notaDetalhes.impostos?.length ? (
                    <div className="flex flex-col items-center py-xl text-on-surface-variant"><span className="material-symbols-outlined text-5xl opacity-20 mb-sm">receipt_long</span><p>Nenhum imposto registrado</p></div>
                  ) : (
                    <div className="space-y-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                        {notaDetalhes.impostos.map((imp, i) => (
                          <div key={i} className="p-lg bg-surface-container-low rounded-xl border border-outline-variant">
                            <p className="text-label-md font-bold text-primary mb-md">{imp.tipoImposto}</p>
                            {[
                              ['Base de Cálculo', fmt(imp.baseCalculo)],
                              imp.reducaoBase > 0 && ['Redução Base', `${imp.reducaoBase}%`],
                              ['Alíquota', `${imp.aliquota}%`],
                              ['Valor', fmt(imp.valorCalculado)],
                            ].filter(Boolean).map(([l, v]) => (
                              <div key={l} className="flex justify-between items-center py-xs border-b border-outline-variant/30">
                                <span className="text-body-sm text-on-surface-variant">{l}</span>
                                <strong className="text-body-sm">{v}</strong>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center p-md bg-primary-container/10 rounded-xl border border-primary/20">
                        <span className="text-label-md font-bold text-on-surface">Total de Impostos</span>
                        <strong className="text-headline-md font-semibold text-primary">{fmt(notaDetalhes.valor_Total_De_Imposto_A_Pagar)}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-lg border-t border-outline-variant flex justify-between items-center flex-shrink-0">
              <button
                onClick={e => handleGerarPDF(e, notaDetalhes)}
                disabled={gerandoPDF === notaDetalhes?.nf_numero}
                className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {gerandoPDF === notaDetalhes?.nf_numero ? (
                  <><span className="material-symbols-outlined text-sm animate-spin">sync</span> Gerando PDF...</>
                ) : (
                  <><span className="material-symbols-outlined text-sm">picture_as_pdf</span> Baixar PDF</>
                )}
              </button>
              <div className="flex items-center gap-sm">
                {notaDetalhes?.status_Nota?.toUpperCase() === 'AUTORIZADA' && (
                  <button
                    onClick={e => abrirCancelar(e, notaDetalhes)}
                    className="flex items-center gap-sm px-lg py-sm bg-error text-on-error rounded-xl text-label-md font-bold hover:opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">cancel</span> Cancelar NF-e
                  </button>
                )}
                {notaDetalhes?.status_Nota?.toUpperCase() === 'PENDENTE' && (
                  <button
                    onClick={e => abrirInutilizar(e, notaDetalhes)}
                    className="flex items-center gap-sm px-lg py-sm bg-tertiary text-on-tertiary rounded-xl text-label-md font-bold hover:opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">block</span> Inutilizar NF-e
                  </button>
                )}
                <button
                  onClick={() => { setNotaDetalhes(null); setAbaDetalhes('resumo'); }}
                  className="px-xl py-sm border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── MODAL CONFIRMAÇÃO CANCELAR / INUTILIZAR ── */}
      {confirmModal && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-md"
          onClick={() => { if (!processando) setConfirmModal(null); }}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-md p-lg border-b border-outline-variant">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                confirmModal.tipo === 'cancelar'
                  ? 'bg-error-container text-error'
                  : 'bg-tertiary-container text-on-tertiary-container'
              }`}>
                <span className="material-symbols-outlined">
                  {confirmModal.tipo === 'cancelar' ? 'cancel' : 'block'}
                </span>
              </div>
              <div>
                <h3 className="text-headline-md font-semibold">
                  {confirmModal.tipo === 'cancelar' ? 'Cancelar Nota Fiscal' : 'Inutilizar Nota Fiscal'}
                </h3>
                <p className="text-body-sm text-on-surface-variant font-geist-mono">
                  NF-e #{confirmModal.nota.nf_numero}
                </p>
              </div>
            </div>
            <div className="p-lg space-y-lg">
              {confirmModal.tipo === 'cancelar' ? (
                <>
                  <p className="text-body-md text-on-surface-variant">
                    Esta ação cancela a NF-e junto à SEFAZ (válido dentro do prazo de 24h). O estoque dos itens será restaurado automaticamente.
                  </p>
                  <div className="space-y-sm">
                    <label className="text-label-md font-semibold">
                      Motivo do cancelamento <span className="text-error">*</span>
                    </label>
                    <textarea
                      value={motivo}
                      onChange={e => setMotivo(e.target.value)}
                      rows={3}
                      placeholder="Descreva o motivo do cancelamento..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </>
              ) : (
                <p className="text-body-md text-on-surface-variant">
                  Esta ação inutiliza a NF-e localmente (somente notas pendentes, ainda não transmitidas à SEFAZ). O estoque será restaurado. Esta operação não pode ser desfeita.
                </p>
              )}
            </div>
            <div className="p-lg border-t border-outline-variant flex justify-end gap-sm">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={processando}
                className="px-lg py-sm border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={confirmarAcao}
                disabled={processando || (confirmModal.tipo === 'cancelar' && !motivo.trim())}
                className={`px-xl py-sm rounded-xl text-label-md font-bold transition-all disabled:opacity-50 flex items-center gap-sm ${
                  confirmModal.tipo === 'cancelar'
                    ? 'bg-error text-on-error hover:opacity-90'
                    : 'bg-tertiary text-on-tertiary hover:opacity-90'
                }`}
              >
                {processando ? (
                  <><span className="material-symbols-outlined text-sm animate-spin">sync</span> Processando...</>
                ) : confirmModal.tipo === 'cancelar' ? (
                  <><span className="material-symbols-outlined text-sm">cancel</span> Confirmar Cancelamento</>
                ) : (
                  <><span className="material-symbols-outlined text-sm">block</span> Confirmar Inutilização</>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── MODAL EMISSÃO ── */}
      {modalAberto && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-md" onClick={fecharModal}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col border border-outline-variant overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-md p-lg border-b border-outline-variant flex-shrink-0">
              <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="flex-1">
                <h2 className="text-headline-md font-semibold">Emissão de Nota Fiscal</h2>
                <p className="text-body-sm text-on-surface-variant">
                  {etapa === 1 ? 'Etapa 1 de 2 — Dados da nota' : 'Etapa 2 de 2 — Itens'}
                </p>
              </div>
              <button onClick={fecharModal} className="p-sm hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-md px-lg py-md flex-shrink-0">
              {[{ n: 1, label: 'Dados Fiscais' }, { n: 2, label: 'Itens da Nota' }].map(({ n, label }, i) => (
                <div key={n} className="flex items-center gap-sm flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 ${etapa >= n ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}>{n}</div>
                  <span className={`text-label-md font-semibold ${etapa >= n ? 'text-primary' : 'text-on-surface-variant opacity-40'}`}>{label}</span>
                  {i === 0 && <div className="flex-1 h-px bg-outline-variant ml-sm" />}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-lg custom-scrollbar space-y-lg">
              {etapa === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="space-y-sm">
                      <label className="text-label-md font-semibold">CFOP Operação</label>
                      <select value={form.cfop} onChange={e => setForm(f => ({...f, cfop: Number(e.target.value)}))} className={inputCls + ' appearance-none'}>
                        {CFOPS_COMUNS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                      {ehTransferencia && (
                        <p className="text-body-sm text-tertiary">⇄ CFOP de transferência — selecione a loja de destino abaixo</p>
                      )}
                    </div>
                    <div className="space-y-sm">
                      <label className="text-label-md font-semibold">Série</label>
                      <input type="number" min="1" value={form.serieNfe} onChange={e => setForm(f => ({...f, serieNfe: e.target.value}))} className={inputCls} />
                    </div>
                  </div>

                  {ehTransferencia ? (
                    <div className="space-y-md">
                      <label className="text-label-md font-semibold">Loja de Destino</label>
                      {lojaSelecionada ? (
                        <div className="flex items-center justify-between p-md bg-primary-container/10 rounded-xl border border-primary/20">
                          <div>
                            <strong className="text-label-md">{lojaSelecionada.razaoSocial}</strong>
                            <p className="text-body-sm font-geist-mono text-on-surface-variant">{lojaSelecionada.cnpj || lojaSelecionada.cpfCnpj}</p>
                          </div>
                          <button onClick={() => setLojaSelecionada(null)} className="px-md py-xs border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container transition-all">Trocar</button>
                        </div>
                      ) : (
                        <div className="space-y-sm">
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
                            <input value={buscaLoja} onChange={e => setBuscaLoja(e.target.value)} placeholder="Buscar por razão social ou CNPJ..." className={`${inputCls} pl-12`} />
                          </div>
                          <div className="max-h-48 overflow-y-auto rounded-xl border border-outline-variant divide-y divide-outline-variant/30 custom-scrollbar">
                            {carregandoLojas ? (
                              <div className="p-md flex items-center gap-sm text-on-surface-variant"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /><span className="text-body-sm">Carregando...</span></div>
                            ) : lojasFiltradas.length === 0 ? (
                              <p className="p-md text-body-sm text-on-surface-variant">Nenhuma loja encontrada</p>
                            ) : lojasFiltradas.map((loja, idx) => (
                              <div key={idx} onClick={() => setLojaSelecionada(loja)} className="p-md hover:bg-surface-container-low cursor-pointer transition-colors">
                                <strong className="text-label-md block">{loja.razaoSocial}</strong>
                                <span className="text-body-sm font-geist-mono text-on-surface-variant">{loja.cnpj || loja.cpfCnpj}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-sm">
                      <label className="text-label-md font-semibold">Destinatário</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">person_search</span>
                        <input
                          type="text"
                          placeholder="CPF ou CNPJ do cliente..."
                          value={form.cpfCliente}
                          onChange={e => setForm(f => ({...f, cpfCliente: e.target.value}))}
                          className={`${inputCls} pl-12 font-geist-mono`}
                        />
                      </div>
                      <p className="text-body-sm text-on-surface-variant italic">Selecione "Consumidor Final" para vendas rápidas.</p>
                    </div>
                  )}
                </>
              )}

              {etapa === 2 && (
                <>
                  {/* Summary bar */}
                  <div className="flex gap-md p-md bg-surface-container-low rounded-xl border border-outline-variant">
                    {[
                      { label: 'CFOP', value: form.cfop },
                      { label: 'Série', value: form.serieNfe },
                      { label: ehTransferencia ? 'Loja Destino' : 'Destinatário', value: ehTransferencia ? lojaSelecionada?.razaoSocial : form.cpfCliente },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex-1">
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">{label}</span>
                        <strong className="text-label-md font-geist-mono">{value}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Add item */}
                  <div className="space-y-sm">
                    <label className="text-label-md font-semibold">Adicionar Item</label>
                    <div className="flex flex-col md:flex-row gap-md">
                      <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">barcode_scanner</span>
                        <input
                          type="text"
                          value={itemForm.codigo_barra}
                          onChange={e => setItemForm(f => ({...f, codigo_barra: e.target.value}))}
                          onKeyDown={e => e.key === 'Enter' && adicionarItem()}
                          placeholder="Digite ou escaneie o código..."
                          className={`${inputCls} pl-12 font-geist-mono`}
                          autoFocus
                        />
                      </div>
                      <div className="w-24 space-y-sm">
                        <label className="text-label-md font-semibold text-[11px]">Qtd.</label>
                        <input type="number" min="1" value={itemForm.quantidade_Itens} onChange={e => setItemForm(f => ({...f, quantidade_Itens: e.target.value}))} className={inputCls} />
                      </div>
                      <div className="w-32 space-y-sm">
                        <label className="text-label-md font-semibold text-[11px]">Desc. (R$)</label>
                        <input type="number" min="0" step="0.01" value={itemForm.desconto} onChange={e => setItemForm(f => ({...f, desconto: e.target.value}))} className={inputCls} placeholder="0,00" />
                      </div>
                      <div className="flex items-end">
                        <button onClick={adicionarItem} className="h-[42px] px-md bg-secondary-container text-on-secondary-container rounded-lg text-label-md font-semibold hover:bg-secondary-fixed transition-all">
                          Incluir
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  {itens.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-outline-variant">
                      <table className="w-full text-left">
                        <thead className="bg-surface-container-low border-b border-outline-variant">
                          <tr>
                            {['Produto', 'Un.', 'Desconto', ''].map(h => (
                              <th key={h} className="px-md py-sm text-label-md font-bold text-on-surface-variant">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                          {itens.map((item, idx) => (
                            <tr key={idx} className="hover:bg-surface-container-lowest transition-colors">
                              <td className="px-md py-md font-geist-mono text-mono-label">{item.codigo_barra}</td>
                              <td className="px-md py-md text-body-sm">{item.quantidade_Itens}</td>
                              <td className="px-md py-md text-body-sm">{item.desconto > 0 ? `R$ ${Number(item.desconto).toFixed(2)}` : '—'}</td>
                              <td className="px-md py-md text-center">
                                <button onClick={() => removerItem(idx)} className="text-error hover:scale-110 transition-transform">
                                  <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-xl text-on-surface-variant border-2 border-dashed border-outline-variant rounded-xl">
                      <span className="material-symbols-outlined text-5xl opacity-20 mb-sm">inventory_2</span>
                      <p className="text-body-sm">Nenhum item adicionado</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-lg border-t border-outline-variant flex justify-between flex-shrink-0">
              {etapa === 1 ? (
                <>
                  <button onClick={fecharModal} className="px-lg py-sm border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all">Cancelar</button>
                  <button onClick={() => setEtapa(2)} disabled={!podeProsseguir} className="px-xl py-sm bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50">
                    Próximo: Adicionar Itens
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEtapa(1)} className="px-lg py-sm border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all">Voltar</button>
                  <div className="flex gap-sm">
                    <button className="px-lg py-sm bg-secondary-container text-on-secondary-container rounded-xl text-label-md font-semibold hover:opacity-90 transition-all">
                      Salvar Rascunho
                    </button>
                    <button onClick={emitirNota} disabled={emitindo || itens.length === 0} className="px-xl py-sm bg-primary text-on-primary rounded-xl text-label-md font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-sm disabled:opacity-50">
                      <span className="material-symbols-outlined">send</span>
                      {emitindo ? 'Emitindo...' : 'Emitir e Transmitir'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
