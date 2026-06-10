import { useState, useEffect } from 'react';
import { pagamentoService } from '../api/pagamentoService';
import { showAlert } from '../components/Alert';

const ENUM_FORMAS = [
  { value: 'DINHEIRO',       label: 'Dinheiro em Espécie',  icon: 'payments',       color: 'bg-blue-100 text-blue-700' },
  { value: 'CARTAO_CREDITO', label: 'Crédito (TEF)',         icon: 'credit_card',    color: 'bg-primary-container/20 text-primary' },
  { value: 'CARTAO_DEBITO',  label: 'Débito',               icon: 'credit_card',    color: 'bg-secondary-container text-on-secondary-container' },
  { value: 'PIX',            label: 'Pix Instantâneo',      icon: 'qr_code_2',      color: 'bg-emerald-100 text-emerald-700' },
  { value: 'CREDIARIO',      label: 'Crediário',            icon: 'account_balance', color: 'bg-purple-100 text-purple-700' },
  { value: 'CHEQUE',         label: 'Cheque',               icon: 'receipt',         color: 'bg-orange-100 text-orange-700' },
];

const resolveInfo = val => ENUM_FORMAS.find(f => f.value === val) || { label: val || '—', icon: 'payments', color: 'bg-surface-container text-on-surface' };

export default function MeiosPagamento() {
  const [formas, setFormas] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [enumSel, setEnumSel] = useState('DINHEIRO');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalDelete, setModalDelete] = useState(null);
  const [deletando, setDeletando] = useState(false);

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

  const inputCls = 'w-full px-md py-sm bg-background border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none';

  return (
    <>
      <div className="p-xl max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-lg">
          {/* Form column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-lg">
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
              <div className="flex items-center gap-sm mb-lg">
                <span className="material-symbols-outlined text-primary text-2xl">add_card</span>
                <h2 className="text-headline-md font-semibold">Novo Meio</h2>
              </div>
              <form onSubmit={handleCriar} className="space-y-md">
                <div>
                  <label className="block text-label-md font-semibold mb-xs">Tipo de Operação</label>
                  <select value={enumSel} onChange={e => setEnumSel(e.target.value)} className={inputCls + ' appearance-none'} disabled={salvando}>
                    {ENUM_FORMAS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md font-semibold mb-xs">Nome do Meio</label>
                  <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Cartão Visa" className={inputCls} maxLength={60} disabled={salvando} />
                </div>
                <div>
                  <label className="block text-label-md font-semibold mb-xs">Ícone Representativo</label>
                  <div className="grid grid-cols-4 gap-sm">
                    {['credit_card', 'payments', 'qr_code_2', 'account_balance'].map(icon => (
                      <button key={icon} type="button" className="p-md rounded-lg border border-outline-variant hover:border-primary/50 text-on-surface-variant flex items-center justify-center transition-all hover:bg-primary-container/10">
                        <span className="material-symbols-outlined">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={salvando || !descricao.trim()}
                  className="w-full bg-primary text-on-primary py-md px-lg rounded-lg text-label-md font-bold hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">save</span>
                  {salvando ? 'Salvando...' : 'Cadastrar Meio de Pagamento'}
                </button>
              </form>
            </section>

            <div className="bg-primary-container text-on-primary-container rounded-xl p-lg flex items-start gap-md border border-primary/20">
              <span className="material-symbols-outlined text-4xl">info</span>
              <div>
                <h3 className="text-[18px] font-semibold mb-xs">Configuração Rápida</h3>
                <p className="text-body-sm opacity-90 leading-relaxed">
                  Os meios cadastrados aqui aparecerão instantaneamente na tela de Checkout do seu PDV.
                </p>
              </div>
            </div>
          </div>

          {/* Grid column */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-lg">
              <h2 className="text-headline-md font-semibold">Ativos no Sistema</h2>
              <span className="text-label-md font-semibold text-on-surface-variant bg-surface-container rounded-full px-md py-xs border border-outline-variant/30">
                {formas.length} Meios Registrados
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-2xl text-on-surface-variant">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : formas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-2xl text-on-surface-variant">
                <span className="material-symbols-outlined text-7xl opacity-20 mb-md">credit_card</span>
                <p className="text-body-md">Nenhum meio cadastrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-md">
                {formas.map((forma, idx) => {
                  const info = resolveInfo(forma.forma_pagamento);
                  return (
                    <div key={forma.id ?? idx} className="group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:shadow-md transition-all overflow-hidden">
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-[120px]">{info.icon}</span>
                      </div>
                      <div className="flex justify-between items-start mb-md">
                        <div className={`p-md rounded-xl ${info.color}`}>
                          <span className="material-symbols-outlined text-3xl">{info.icon}</span>
                        </div>
                        <div className="flex gap-xs">
                          <button
                            onClick={() => setModalDelete({ id: forma.id, nome: forma.desc_forma_pagamento })}
                            className="p-xs text-on-surface-variant hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                      <h3 className="text-headline-md font-semibold mb-xs">{forma.desc_forma_pagamento}</h3>
                      <p className="text-body-sm text-on-surface-variant mb-lg">{info.label}</p>
                      <div className="flex items-center gap-sm">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-sm py-xs text-xs font-semibold text-emerald-700 border border-emerald-200">Ativo</span>
                        {forma.id && <span className="font-geist-mono text-mono-label text-on-surface-variant">ID: {forma.id}</span>}
                      </div>
                    </div>
                  );
                })}

                {/* Add placeholder */}
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface-container/30 transition-all">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-outline text-3xl">add</span>
                  </div>
                  <p className="text-label-md font-semibold text-on-surface-variant">Adicionar Novo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {modalDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !deletando && setModalDelete(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm mx-md p-xl border border-outline-variant" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center gap-md">
              <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-3xl">delete</span>
              </div>
              <h2 className="text-headline-md font-semibold text-on-surface">Remover meio</h2>
              <p className="text-body-md text-on-surface-variant">
                Tem certeza que deseja remover <strong>"{modalDelete.nome}"</strong>?
              </p>
              <div className="flex gap-md w-full">
                <button onClick={() => setModalDelete(null)} disabled={deletando} className="flex-1 py-sm border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container transition-all">
                  Cancelar
                </button>
                <button onClick={handleDeletar} disabled={deletando} className="flex-1 py-sm bg-error text-on-error rounded-lg text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50">
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
