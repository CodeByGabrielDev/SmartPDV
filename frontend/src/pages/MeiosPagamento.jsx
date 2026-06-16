import { useState, useEffect } from 'react';
import { pagamentoService } from '../api/pagamentoService';
import { showAlert } from '../components/Alert';

const ENUM_FORMAS = [
  { value: 'DINHEIRO',       label: 'Dinheiro',       icon: 'payments',        color: 'bg-blue-100 text-blue-700 border-blue-200',           iconBg: 'bg-blue-100',    iconCls: 'text-blue-600' },
  { value: 'CARTAO_CREDITO', label: 'Crédito (TEF)',  icon: 'credit_card',     color: 'bg-primary/10 text-primary border-primary/20',         iconBg: 'bg-primary/10',  iconCls: 'text-primary' },
  { value: 'CARTAO_DEBITO',  label: 'Débito',         icon: 'credit_card',     color: 'bg-secondary-container text-on-secondary-container border-outline-variant', iconBg: 'bg-secondary-container', iconCls: 'text-secondary' },
  { value: 'PIX',            label: 'Pix',            icon: 'qr_code_2',       color: 'bg-emerald-100 text-emerald-700 border-emerald-200',   iconBg: 'bg-emerald-100', iconCls: 'text-emerald-600' },
  { value: 'CREDIARIO',      label: 'Crediário',      icon: 'account_balance', color: 'bg-purple-100 text-purple-700 border-purple-200',      iconBg: 'bg-purple-100',  iconCls: 'text-purple-600' },
  { value: 'CHEQUE',         label: 'Cheque',         icon: 'receipt',         color: 'bg-amber-100 text-amber-700 border-amber-200',         iconBg: 'bg-amber-100',   iconCls: 'text-amber-600' },
];

const resolveInfo = val => ENUM_FORMAS.find(f => f.value === val) || {
  label: val || '—', icon: 'payments',
  color: 'bg-surface-container text-on-surface-variant border-outline-variant',
  iconBg: 'bg-surface-container', iconCls: 'text-on-surface-variant',
};

const inputCls = 'w-full min-h-[44px] px-md bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:border-primary input-focus-ring transition-all outline-none';

export default function MeiosPagamento() {
  const [formas, setFormas]           = useState([]);
  const [descricao, setDescricao]     = useState('');
  const [enumSel, setEnumSel]         = useState('DINHEIRO');
  const [loading, setLoading]         = useState(true);
  const [salvando, setSalvando]       = useState(false);
  const [modalDelete, setModalDelete] = useState(null);
  const [deletando, setDeletando]     = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try { setFormas((await pagamentoService.listarFormasPagamento()) || []); }
    catch (err) { showAlert(err.displayMessage || 'Erro ao carregar', 'error'); }
    finally { setLoading(false); }
  };

  const handleCriar = async (e) => {
    e.preventDefault();
    if (!descricao.trim()) { showAlert('Informe uma descrição', 'error'); return; }
    setSalvando(true);
    try {
      await pagamentoService.criarFormaPagamento(descricao.trim(), enumSel);
      showAlert(`"${descricao.trim()}" cadastrado!`, 'success');
      setDescricao(''); setEnumSel('DINHEIRO'); carregar();
    } catch (err) { showAlert(err.displayMessage || 'Erro ao cadastrar', 'error'); }
    finally { setSalvando(false); }
  };

  const handleDeletar = async () => {
    if (!modalDelete?.id) { showAlert('ID não encontrado', 'error'); setModalDelete(null); return; }
    setDeletando(true);
    try {
      await pagamentoService.deletarFormaPagamento(modalDelete.id);
      showAlert(`"${modalDelete.nome}" removido.`, 'success');
      setModalDelete(null); carregar();
    } catch (err) { showAlert(err.displayMessage || 'Erro ao remover', 'error'); }
    finally { setDeletando(false); }
  };

  const selectedInfo = resolveInfo(enumSel);

  return (
    <>
      <div className="p-xl max-w-[1400px] mx-auto space-y-xl">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline-md font-bold text-on-surface">Meios de Pagamento</h1>
            <p className="text-body-sm text-on-surface-variant mt-xs">Configure os métodos aceitos no PDV</p>
          </div>
          <span className="inline-flex items-center gap-xs px-md py-sm rounded-xl bg-surface-container border border-outline-variant text-label-md font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">credit_card</span>
            {formas.length} método{formas.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-xl items-start">

          {/* ── Form Panel ── */}
          <div className="w-full lg:w-[340px] flex flex-col gap-lg flex-shrink-0">

            {/* Add form card */}
            <div className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden shadow-card">
              <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex items-center gap-sm">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">add_card</span>
                </div>
                <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Novo Meio</h2>
              </div>
              <form onSubmit={handleCriar} className="p-lg space-y-md">
                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant">Tipo de Operação</label>
                  <select
                    value={enumSel}
                    onChange={e => setEnumSel(e.target.value)}
                    className={inputCls + ' appearance-none'}
                    disabled={salvando}
                  >
                    {ENUM_FORMAS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>

                {/* Preview do tipo */}
                <div className={`flex items-center gap-md p-md rounded-xl border ${selectedInfo.color}`}>
                  <div className={`w-10 h-10 ${selectedInfo.iconBg} rounded-xl flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${selectedInfo.iconCls}`}>{selectedInfo.icon}</span>
                  </div>
                  <div>
                    <p className="text-label-md font-bold">{selectedInfo.label}</p>
                    <p className="text-[11px] opacity-70">Tipo selecionado</p>
                  </div>
                </div>

                <div className="space-y-xs">
                  <label className="text-label-md font-semibold text-on-surface-variant">Nome do Meio</label>
                  <input
                    type="text"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    placeholder="Ex: Cartão Visa"
                    className={inputCls}
                    maxLength={60}
                    disabled={salvando}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={salvando || !descricao.trim()}
                  className="w-full min-h-[44px] bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-sm shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">{salvando ? 'sync' : 'save'}</span>
                  {salvando ? 'Salvando...' : 'Cadastrar Meio'}
                </button>
              </form>
            </div>

            {/* Info card */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-lg flex items-start gap-md">
              <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">info</span>
              <div>
                <p className="text-label-md font-bold text-on-surface mb-xs">Dica</p>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Os meios cadastrados aparecem instantaneamente na tela de checkout do PDV.
                </p>
              </div>
            </div>
          </div>

          {/* ── Cards Grid ── */}
          <div className="flex-1 min-w-0">

            {loading ? (
              <div className="flex items-center justify-center py-2xl">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : formas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-2xl gap-lg text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-50">credit_card_off</span>
                </div>
                <div>
                  <p className="text-label-md font-semibold text-on-surface">Nenhum meio cadastrado</p>
                  <p className="text-body-sm text-on-surface-variant mt-xs">Use o formulário ao lado para adicionar o primeiro</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-md">
                {formas.map((forma, idx) => {
                  const info = resolveInfo(forma.forma_pagamento);
                  return (
                    <div
                      key={forma.id ?? idx}
                      className="group relative bg-surface border border-outline-variant/40 rounded-2xl p-lg shadow-card hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      {/* Watermark icon */}
                      <div className="absolute -right-2 -bottom-2 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                        <span className="material-symbols-outlined text-[100px]">{info.icon}</span>
                      </div>

                      {/* Header row */}
                      <div className="flex items-start justify-between mb-lg">
                        <div className={`w-12 h-12 ${info.iconBg} rounded-xl flex items-center justify-center`}>
                          <span className={`material-symbols-outlined text-2xl ${info.iconCls}`}>{info.icon}</span>
                        </div>
                        <button
                          onClick={() => setModalDelete({ id: forma.id, nome: forma.desc_forma_pagamento })}
                          className="p-sm text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="Remover"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>

                      <h3 className="text-label-md font-bold text-on-surface mb-xs">{forma.desc_forma_pagamento}</h3>
                      <p className="text-body-sm text-on-surface-variant mb-lg">{info.label}</p>

                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full text-[11px] font-bold border ${info.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          Ativo
                        </span>
                        {forma.id && (
                          <span className="font-geist-mono text-[11px] text-on-surface-variant">ID {forma.id}</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add placeholder card */}
                <div className="border-2 border-dashed border-outline-variant rounded-2xl p-lg flex flex-col items-center justify-center gap-md text-center cursor-pointer hover:border-primary/40 hover:bg-surface-container/20 transition-all group min-h-[180px]">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant">add</span>
                  </div>
                  <div>
                    <p className="text-label-md font-semibold text-on-surface-variant">Adicionar novo</p>
                    <p className="text-[11px] text-on-surface-variant opacity-70 mt-xs">Use o formulário ao lado</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {modalDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-md"
          onClick={() => !deletando && setModalDelete(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm border border-outline-variant overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-md p-lg border-b border-outline-variant bg-error-container/20">
              <div className="w-10 h-10 bg-error-container rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-error">delete</span>
              </div>
              <h2 className="text-headline-md font-bold text-on-surface flex-1">Remover meio</h2>
              <button onClick={() => setModalDelete(null)} className="p-sm hover:bg-surface-container rounded-xl text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-xl space-y-lg">
              <p className="text-body-md text-on-surface-variant">
                Tem certeza que deseja remover <strong className="text-on-surface">"{modalDelete.nome}"</strong>?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-md">
                <button
                  onClick={() => setModalDelete(null)}
                  disabled={deletando}
                  className="flex-1 min-h-[44px] border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeletar}
                  disabled={deletando}
                  className="flex-1 min-h-[44px] bg-error text-on-error rounded-xl text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {deletando ? 'Removendo...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
