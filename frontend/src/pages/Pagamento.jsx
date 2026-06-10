import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pagamentoService } from '../api/pagamentoService';
import { vendaService } from '../api/vendaService';
import { showAlert } from '../components/Alert';

const FORMA_ICON = {
  pix:     { icon: 'qr_code_2',      color: 'bg-emerald-100 text-emerald-700' },
  débito:  { icon: 'credit_card',    color: 'bg-secondary-container text-on-secondary-container' },
  debito:  { icon: 'credit_card',    color: 'bg-secondary-container text-on-secondary-container' },
  crédito: { icon: 'credit_card',    color: 'bg-primary-container/20 text-primary' },
  credito: { icon: 'credit_card',    color: 'bg-primary-container/20 text-primary' },
  dinheiro:{ icon: 'payments',       color: 'bg-blue-100 text-blue-700' },
};

function getFormaInfo(desc) {
  const key = Object.keys(FORMA_ICON).find(k => desc?.toLowerCase().includes(k));
  return key ? FORMA_ICON[key] : { icon: 'account_balance', color: 'bg-surface-container text-on-surface' };
}

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const [idVenda, setIdVenda] = useState(null);
  const [formaPgtoId, setFormaPgtoId] = useState(null);
  const [qtdParcelas, setQtdParcelas] = useState(1);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoFormas, setCarregandoFormas] = useState(true);
  const [concluido, setConcluido] = useState(false);
  const [erroImposto, setErroImposto] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('idVenda');
    if (id) setIdVenda(id);
    else showAlert('Nenhuma venda identificada. Volte ao PDV.', 'error');

    (async () => {
      setCarregandoFormas(true);
      try {
        const formas = await pagamentoService.listarFormasPagamento();
        if (!formas?.length) { showAlert('Nenhuma forma de pagamento cadastrada.', 'error'); return; }
        setFormasPagamento(formas);
        setFormaPgtoId(formas[0].id);
      } catch { showAlert('Erro ao carregar formas de pagamento.', 'error'); }
      finally { setCarregandoFormas(false); }
    })();
  }, [location]);

  const formaSelecionada = formasPagamento.find(f => f.id === formaPgtoId);
  const ehCredito = ['crédito', 'credito'].some(k => formaSelecionada?.desc_forma_pagamento?.toLowerCase().includes(k));

  const realizarPagamento = async () => {
    if (!idVenda) { showAlert('Venda não identificada.', 'error'); return; }
    if (!formaPgtoId) { showAlert('Selecione uma forma de pagamento.', 'error'); return; }
    setCarregando(true);
    try {
      await pagamentoService.realizarPagamento(parseInt(idVenda), formaPgtoId, qtdParcelas);
      setConcluido(true);
      setTimeout(() => navigate('/dashboard/venda'), 2500);
    } catch (error) {
      const status = error.response?.status || error.status;
      const mensagem = error.response?.data?.message || error.displayMessage || error.message || '';
      const ehExcecao = status === 404 || mensagem.toLowerCase().includes('excecao') || mensagem.toLowerCase().includes('exceção') || mensagem.toLowerCase().includes('imposto');
      if (ehExcecao) {
        try { await vendaService.cancelarVenda(parseInt(idVenda)); } catch {}
        setIdVenda(null);
        setErroImposto(true);
      } else {
        showAlert(mensagem || 'Erro ao processar pagamento', 'error');
      }
    } finally { setCarregando(false); }
  };

  // Success screen
  if (concluido) {
    return (
      <div className="min-h-full flex items-center justify-center p-xl">
        <div className="flex flex-col items-center text-center gap-lg max-w-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
          </div>
          <div>
            <h2 className="text-headline-md font-semibold text-on-surface">Pagamento confirmado!</h2>
            <p className="text-body-md text-on-surface-variant mt-xs">Venda <strong>#{idVenda}</strong> finalizada com sucesso.</p>
          </div>
          <p className="text-body-sm text-on-surface-variant animate-pulse flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">sync</span>
            Redirecionando para o PDV...
          </p>
        </div>
      </div>
    );
  }

  // Tax error screen
  if (erroImposto) {
    return (
      <div className="min-h-full flex items-center justify-center p-xl">
        <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm p-xl max-w-md w-full space-y-lg">
          <div className="flex flex-col items-center text-center gap-md">
            <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-3xl">warning</span>
            </div>
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">Venda cancelada</h2>
              <p className="text-body-md text-on-surface-variant mt-xs">
                Não há <strong>exceção de imposto</strong> configurada para o CFOP 5102 desta loja. A venda foi cancelada para evitar inconsistências.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-sm">
            <button onClick={() => navigate('/dashboard/excecao-imposto')} className="w-full h-12 bg-primary text-on-primary text-label-md font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined">settings</span>
              Configurar Exceção de Imposto
            </button>
            <button onClick={() => navigate('/dashboard/venda')} className="w-full h-11 border border-outline-variant text-label-md font-semibold rounded-xl hover:bg-surface-container transition-all">
              ← Voltar ao PDV
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center p-xl">
      <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm w-full max-w-lg space-y-xl overflow-hidden">
        {/* Header */}
        <div className="p-xl pb-0">
          <div className="flex items-center gap-md mb-xl">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
            <div>
              <h1 className="text-headline-md font-semibold text-on-surface">Finalizar Pagamento</h1>
              <p className="text-body-sm text-on-surface-variant">
                {idVenda ? `Venda #${idVenda}` : 'Aguardando venda...'}
              </p>
            </div>
          </div>

          {!idVenda && (
            <div className="flex items-center gap-sm p-md bg-error-container/30 rounded-xl border border-error/30 mb-lg">
              <span className="material-symbols-outlined text-error">warning</span>
              <p className="text-body-sm text-on-error-container flex-1">Nenhuma venda em aberto.</p>
              <button onClick={() => navigate('/dashboard/venda')} className="text-label-md font-semibold text-primary hover:underline">Voltar ao PDV</button>
            </div>
          )}
        </div>

        {/* Payment methods */}
        <div className="px-xl space-y-sm">
          <label className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Forma de Pagamento</label>
          {carregandoFormas ? (
            <div className="flex items-center gap-sm py-lg text-on-surface-variant">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-body-sm">Carregando formas...</span>
            </div>
          ) : formasPagamento.length === 0 ? (
            <div className="flex items-center gap-sm p-md bg-surface-container rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant">info</span>
              <p className="text-body-sm text-on-surface-variant flex-1">Nenhuma forma cadastrada.</p>
              <button onClick={() => navigate('/dashboard/meios-pagamento')} className="text-label-md font-semibold text-primary hover:underline">Cadastrar</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-sm">
              {formasPagamento.map(forma => {
                const info = getFormaInfo(forma.desc_forma_pagamento);
                const isSelected = formaPgtoId === forma.id;
                return (
                  <button
                    key={forma.id}
                    onClick={() => { setFormaPgtoId(forma.id); setQtdParcelas(1); }}
                    className={`flex items-center gap-sm p-md rounded-xl border-2 transition-all text-left ${isSelected ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low'}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${info.color}`}>
                      <span className="material-symbols-outlined">{info.icon}</span>
                    </div>
                    <span className="text-label-md font-semibold text-on-surface truncate">{forma.desc_forma_pagamento}</span>
                    {isSelected && <span className="material-symbols-outlined text-primary ml-auto text-sm">check_circle</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Installments — credit only */}
        {ehCredito && (
          <div className="px-xl space-y-sm">
            <label className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Número de Parcelas</label>
            <div className="grid grid-cols-6 gap-sm">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                <button
                  key={n}
                  onClick={() => setQtdParcelas(n)}
                  className={`h-10 rounded-lg text-label-md font-semibold border-2 transition-all ${qtdParcelas === n ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant hover:border-primary/50'}`}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-xl pt-0 space-y-sm">
          <button
            onClick={realizarPagamento}
            disabled={carregando || !idVenda || !formaPgtoId || formasPagamento.length === 0}
            className="w-full h-14 bg-primary text-on-primary text-headline-md font-semibold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-md"
          >
            <span className="material-symbols-outlined text-2xl">payments</span>
            {carregando ? 'Processando...' : 'CONFIRMAR PAGAMENTO'}
          </button>
          <button onClick={() => navigate('/dashboard/venda')} className="w-full h-11 border border-outline-variant text-label-md font-semibold text-on-surface-variant rounded-xl hover:bg-surface-container transition-all">
            ← Voltar ao PDV
          </button>
        </div>
      </div>
    </div>
  );
}
