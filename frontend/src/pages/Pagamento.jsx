import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pagamentoService } from '../api/pagamentoService';
import { vendaService } from '../api/vendaService';
import { showAlert } from '../components/Alert';

const FORMA_ICON = {
  pix:      { icon: 'qr_code_2',      color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  débito:   { icon: 'credit_card',    color: 'bg-secondary-container text-on-secondary-container', border: 'border-outline-variant' },
  debito:   { icon: 'credit_card',    color: 'bg-secondary-container text-on-secondary-container', border: 'border-outline-variant' },
  crédito:  { icon: 'credit_card',    color: 'bg-primary/10 text-primary', border: 'border-primary/20' },
  credito:  { icon: 'credit_card',    color: 'bg-primary/10 text-primary', border: 'border-primary/20' },
  dinheiro: { icon: 'payments',       color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
};

function getFormaInfo(desc) {
  const key = Object.keys(FORMA_ICON).find(k => desc?.toLowerCase().includes(k));
  return key ? FORMA_ICON[key] : { icon: 'account_balance', color: 'bg-surface-container text-on-surface', border: 'border-outline-variant' };
}

export default function Pagamento() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [idVenda, setIdVenda]                   = useState(null);
  const [formaPgtoId, setFormaPgtoId]           = useState(null);
  const [qtdParcelas, setQtdParcelas]           = useState(1);
  const [formasPagamento, setFormasPagamento]   = useState([]);
  const [carregando, setCarregando]             = useState(false);
  const [carregandoFormas, setCarregandoFormas] = useState(true);
  const [concluido, setConcluido]               = useState(false);
  const [erroImposto, setErroImposto]           = useState(false);

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
      setTimeout(() => navigate('/dashboard/venda'), 2800);
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

  /* ── Tela de sucesso ── */
  if (concluido) {
    return (
      <div className="min-h-full flex items-center justify-center p-xl bg-background">
        <div className="flex flex-col items-center text-center gap-xl max-w-sm w-full">
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-5xl">check_circle</span>
            </div>
            <div className="absolute -right-1 -bottom-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">done</span>
            </div>
          </div>

          <div>
            <h2 className="text-headline-md font-bold text-on-surface">Pagamento Confirmado!</h2>
            <p className="text-body-md text-on-surface-variant mt-xs">
              Venda <strong className="text-on-surface font-geist-mono">#{idVenda}</strong> finalizada com sucesso.
            </p>
          </div>

          <div className="w-full bg-surface border border-outline-variant/40 rounded-2xl p-lg">
            <div className="flex items-center gap-sm text-emerald-600">
              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              <span className="text-body-sm font-semibold">Redirecionando para o PDV...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Tela de erro de imposto ── */
  if (erroImposto) {
    return (
      <div className="min-h-full flex items-center justify-center p-xl bg-background">
        <div className="bg-surface border border-outline-variant/40 rounded-2xl shadow-card p-xl max-w-md w-full space-y-lg">
          <div className="flex flex-col items-center text-center gap-md">
            <div className="w-16 h-16 bg-error-container rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-3xl">gpp_bad</span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">Venda Cancelada</h2>
              <p className="text-body-md text-on-surface-variant mt-xs">
                Não há <strong>exceção de imposto</strong> configurada para o CFOP 5102 desta loja.
                A venda foi cancelada automaticamente.
              </p>
            </div>
          </div>

          <div className="p-md bg-error-container/20 border border-error/20 rounded-xl flex items-start gap-sm">
            <span className="material-symbols-outlined text-error text-[18px] mt-xs flex-shrink-0">info</span>
            <p className="text-body-sm text-on-error-container">
              Configure as exceções de imposto antes de realizar novas vendas.
            </p>
          </div>

          <div className="flex flex-col gap-sm">
            <button
              onClick={() => navigate('/dashboard/excecao-imposto')}
              className="w-full min-h-[44px] bg-primary text-on-primary text-label-md font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-sm shadow-sm"
            >
              <span className="material-symbols-outlined">settings</span>
              Configurar Exceção de Imposto
            </button>
            <button
              onClick={() => navigate('/dashboard/venda')}
              className="w-full min-h-[44px] border border-outline-variant text-label-md font-semibold text-on-surface-variant rounded-xl hover:bg-surface-container transition-all"
            >
              ← Voltar ao PDV
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Tela principal de pagamento ── */
  return (
    <div className="min-h-full flex items-center justify-center p-xl bg-background">
      <div className="w-full max-w-lg space-y-lg">

        {/* Header card */}
        <div className="bg-surface border border-outline-variant/40 rounded-2xl shadow-card overflow-hidden">
          <div className="bg-primary px-xl py-lg flex items-center gap-md">
            <div className="w-12 h-12 bg-on-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary text-2xl">point_of_sale</span>
            </div>
            <div>
              <h1 className="text-headline-md font-bold text-on-primary">Finalizar Pagamento</h1>
              <p className="text-body-sm text-on-primary/70">
                {idVenda ? `Venda #${idVenda}` : 'Aguardando venda...'}
              </p>
            </div>
          </div>

          {!idVenda && (
            <div className="flex items-center gap-sm p-lg bg-error-container/20 border-b border-error/20">
              <span className="material-symbols-outlined text-error">warning</span>
              <p className="text-body-sm text-on-error-container flex-1">Nenhuma venda em aberto.</p>
              <button onClick={() => navigate('/dashboard/venda')} className="text-label-md font-bold text-primary hover:underline">
                Voltar ao PDV
              </button>
            </div>
          )}
        </div>

        {/* Payment methods */}
        <div className="bg-surface border border-outline-variant/40 rounded-2xl shadow-card p-xl space-y-md">
          <div className="flex items-center gap-sm mb-sm">
            <span className="material-symbols-outlined text-primary">payments</span>
            <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Forma de Pagamento</h2>
          </div>

          {carregandoFormas ? (
            <div className="flex items-center gap-sm py-lg text-on-surface-variant justify-center">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-body-sm">Carregando opções...</span>
            </div>
          ) : formasPagamento.length === 0 ? (
            <div className="flex items-center gap-md p-lg bg-surface-container rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant">credit_card_off</span>
              <div className="flex-1">
                <p className="text-label-md font-semibold text-on-surface">Nenhuma forma cadastrada</p>
                <p className="text-body-sm text-on-surface-variant">Cadastre meios de pagamento antes de continuar</p>
              </div>
              <button
                onClick={() => navigate('/dashboard/meios-pagamento')}
                className="px-md py-sm bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 transition-all"
              >
                Cadastrar
              </button>
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
                    className={`flex items-center gap-sm p-md rounded-xl border-2 transition-all text-left min-h-[60px] ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : `border-outline-variant hover:border-primary/40 hover:bg-surface-container-low`
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${info.color}`}>
                      <span className="material-symbols-outlined">{info.icon}</span>
                    </div>
                    <span className="text-label-md font-semibold text-on-surface truncate flex-1">{forma.desc_forma_pagamento}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Installments — credit only */}
        {ehCredito && (
          <div className="bg-surface border border-outline-variant/40 rounded-2xl shadow-card p-xl space-y-md">
            <div className="flex items-center gap-sm mb-sm">
              <span className="material-symbols-outlined text-primary">calendar_month</span>
              <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Parcelamento</h2>
            </div>
            <div className="grid grid-cols-6 gap-sm">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                <button
                  key={n}
                  onClick={() => setQtdParcelas(n)}
                  className={`min-h-[44px] rounded-xl text-label-md font-bold border-2 transition-all ${
                    qtdParcelas === n
                      ? 'border-primary bg-primary text-on-primary shadow-sm'
                      : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-sm">
          <button
            onClick={realizarPagamento}
            disabled={carregando || !idVenda || !formaPgtoId || formasPagamento.length === 0}
            className="w-full h-16 bg-primary text-on-primary text-headline-md font-bold rounded-2xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-md"
          >
            <span className="material-symbols-outlined text-2xl">{carregando ? 'sync' : 'payments'}</span>
            {carregando ? 'PROCESSANDO...' : 'CONFIRMAR PAGAMENTO'}
          </button>
          <button
            onClick={() => navigate('/dashboard/venda')}
            className="w-full min-h-[44px] border-2 border-outline-variant text-label-md font-semibold text-on-surface-variant rounded-xl hover:bg-surface-container hover:border-outline transition-all"
          >
            ← Voltar ao PDV
          </button>
        </div>
      </div>
    </div>
  );
}
