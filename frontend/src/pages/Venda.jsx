import { useState, useRef, useEffect } from 'react';
import { vendaService } from '../api/vendaService';
import { estoqueService } from '../api/estoqueService';
import { caixaService } from '../api/caixaService';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../components/Alert';

export default function Venda() {
  const [codigoBarra, setCodigoBarra] = useState('');
  const [itens, setItens] = useState([]);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [validando, setValidando] = useState(false);
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [verificandoCaixa, setVerificandoCaixa] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Verifica status do caixa ao montar
  useEffect(() => {
    const checarCaixa = async () => {
      setVerificandoCaixa(true);
      try {
        const status = await caixaService.buscarCaixaAberto();
        setCaixaAberto(!!status);
      } catch {
        setCaixaAberto(false);
      } finally {
        setVerificandoCaixa(false);
      }
    };
    checarCaixa();
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const adicionarItem = async () => {
    const codigo = codigoBarra.trim().toUpperCase();
    if (!codigo) return;
    if (itens.find(i => i.codigo_barra === codigo)) {
      showAlert('Item já adicionado. Ajuste a quantidade na lista.', 'error');
      setCodigoBarra('');
      inputRef.current?.focus();
      return;
    }
    setValidando(true);
    try {
      const estoque = await estoqueService.listarEstoque();
      const item = estoque.find(e => e.codigo_barra?.toUpperCase() === codigo);
      if (!item) { showAlert(`Produto "${codigo}" não encontrado no estoque.`, 'error'); return; }
      if (item.quantidade_atual < 1) { showAlert(`Produto "${codigo}" sem saldo em estoque.`, 'error'); return; }

      // Valida inativo via campo do response (se disponível)
      if (item.inativo === true) {
        showAlert(`Produto "${item.nome_produto || codigo}" está INATIVO e não pode ser adicionado à venda.`, 'error');
        setCodigoBarra('');
        return;
      }

      setItens(prev => [...prev, {
        id: Date.now(), codigo_barra: codigo, qtd_item: 1, desconto: 0,
        preco: item.preco_venda ?? 0, qtdDisponivel: item.quantidade_atual,
        descricao: item.nome_produto ?? codigo, validado: true,
        inativo: false,
      }]);
      setCodigoBarra('');
    } catch (err) {
      const msg = err.displayMessage || err.message || '';
      const ehInativo = msg.toLowerCase().includes('inativ') || msg.toLowerCase().includes('inactiv');

      if (ehInativo) {
        // Produto inativo — adiciona como "bloqueado" na lista com indicador visual
        const codigo2 = codigoBarra.trim().toUpperCase();
        setItens(prev => [...prev, {
          id: Date.now(), codigo_barra: codigo2, qtd_item: 1, desconto: 0,
          preco: 0, qtdDisponivel: 0,
          descricao: codigo2, validado: false,
          inativo: true,
        }]);
        setCodigoBarra('');
        showAlert(`Produto "${codigo}" está INATIVO e não pode ser vendido.`, 'error');
      } else {
        showAlert(msg || 'Erro ao validar produto no estoque.', 'error');
      }
    }
    finally { setValidando(false); inputRef.current?.focus(); }
  };

  const removerItem = id => setItens(prev => prev.filter(i => i.id !== id));

  const atualizarQtd = (id, qtd) => {
    if (qtd < 1) return;
    const item = itens.find(i => i.id === id);
    if (item && qtd > item.qtdDisponivel) {
      showAlert(`Saldo disponível: ${item.qtdDisponivel} un.`, 'error');
      return;
    }
    setItens(prev => prev.map(i => i.id === id ? { ...i, qtd_item: qtd } : i));
  };

  const atualizarDesconto = (id, d) => {
    const v = Math.min(100, Math.max(0, Number(d) || 0));
    setItens(prev => prev.map(i => i.id === id ? { ...i, desconto: v } : i));
  };

  const subtotalItem = item => {
    const bruto = item.qtd_item * (item.preco || 0);
    return bruto - bruto * ((item.desconto || 0) / 100);
  };

  const finalizarVenda = async () => {
    if (!caixaAberto) { showAlert('Abra o caixa antes de realizar vendas.', 'error'); return; }
    if (itens.length === 0) { showAlert('Adicione pelo menos um item', 'error'); return; }

    // Bloqueia se houver algum produto inativo na lista
    const inativos = itens.filter(i => i.inativo);
    if (inativos.length > 0) {
      showAlert(`Remova os produtos inativos antes de finalizar: ${inativos.map(i => i.descricao).join(', ')}`, 'error');
      return;
    }

    setCarregando(true);
    try {
      const payload = { itens_venda: itens.map(i => ({ codigo_barra: i.codigo_barra, qtd_item: i.qtd_item, desconto: i.desconto || 0 })) };
      const cpfLimpo = cpfCnpj.trim() ? cpfCnpj.replace(/[.\-\/]/g, '').trim() : null;
      const res = await vendaService.realizarVenda(payload, cpfLimpo);
      const idVenda = res?.id || res?.id_banco || res?.idVenda;
      if (!idVenda) throw new Error('Resposta da venda sem ID.');
      navigate(`/dashboard/pagamento?idVenda=${idVenda}`);
    } catch (error) {
      const msg = error.displayMessage || error.message || '';
      const ehInativo = msg.toLowerCase().includes('inativ') || msg.toLowerCase().includes('inactiv');

      if (ehInativo) {
        // Tenta identificar o produto pelo código na mensagem e marcá-lo visualmente
        showAlert(`Produto inativo detectado: ${msg}`, 'error');
        // Marca todos como não validados para forçar revisão
        setItens(prev => prev.map(i => ({ ...i, validado: false })));
      } else {
        showAlert(msg || 'Erro ao processar venda', 'error');
      }
    } finally { setCarregando(false); }
  };

  const totalBruto = itens.reduce((a, i) => a + i.qtd_item * (i.preco || 0), 0);
  const totalDesconto = itens.reduce((a, i) => { const b = i.qtd_item * (i.preco || 0); return a + b * ((i.desconto || 0) / 100); }, 0);
  const total = totalBruto - totalDesconto;
  const qtdItens = itens.reduce((a, i) => a + i.qtd_item, 0);
  const todosValidados = itens.length > 0 && itens.every(i => i.validado) && itens.every(i => !i.inativo);
  const temInativos = itens.some(i => i.inativo);
  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Badge do status do caixa
  const CaixaBadge = () => {
    if (verificandoCaixa) {
      return (
        <span className="px-sm py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-full border border-outline-variant flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-outline-variant animate-pulse" />
          VERIFICANDO...
        </span>
      );
    }
    if (caixaAberto) {
      return (
        <span className="px-sm py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          CAIXA ABERTO
        </span>
      );
    }
    return (
      <span
        className="px-sm py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full border border-error/30 flex items-center gap-xs cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => navigate('/dashboard/caixa')}
        title="Clique para abrir o caixa"
      >
        <span className="w-2 h-2 rounded-full bg-error" />
        CAIXA FECHADO — Abrir
      </span>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Top bar */}
      <div className="h-16 px-xl flex items-center justify-between bg-surface border-b border-outline-variant flex-shrink-0">
        <div className="flex items-center gap-md">
          <span className="text-headline-md font-black text-primary">PDV Terminal</span>
          <CaixaBadge />
        </div>
        <div className="flex items-center gap-md text-right">
          <div>
            <p className="text-label-md font-semibold text-on-surface">Operador: {localStorage.getItem('login') || 'Admin'}</p>
            <p className="text-body-sm text-on-surface-variant">SmartPDV</p>
          </div>
        </div>
      </div>

      {/* Alerta caixa fechado */}
      {!verificandoCaixa && !caixaAberto && (
        <div className="px-xl py-sm bg-error-container/30 border-b border-error/20 flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-error text-sm">warning</span>
            <p className="text-body-sm text-on-error-container font-semibold">
              O caixa está fechado. Vendas bloqueadas até a abertura do caixa.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/caixa')}
            className="text-label-md font-bold text-error hover:underline flex items-center gap-xs"
          >
            Ir para Caixa →
          </button>
        </div>
      )}

      {/* POS canvas */}
      <div className="flex-1 flex p-lg gap-gutter overflow-hidden">
        {/* Left column — 45% */}
        <section className="w-[45%] flex flex-col gap-lg">
          {/* Search card */}
          <div className="glass-card rounded-2xl p-xl shadow-sm flex flex-col gap-lg">
            <div className="space-y-sm">
              <label className="text-label-md font-bold text-primary uppercase tracking-wider">Bipar ou Pesquisar Produto</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-primary text-3xl">barcode_scanner</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={codigoBarra}
                  onChange={e => setCodigoBarra(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !validando && adicionarItem()}
                  placeholder="Escaneie o código ou digite o nome..."
                  className="w-full pl-16 pr-md py-5 bg-surface-container-low border-2 border-outline-variant rounded-2xl text-headline-md font-semibold focus:border-primary outline-none transition-all placeholder:text-outline-variant input-focus-ring"
                  disabled={validando || !caixaAberto}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Apenas CPF/CNPJ — vendedor vem do SecurityContextHolder */}
            <div className="space-y-sm">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">CPF/CNPJ na Nota (opcional)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
                <input
                  type="text"
                  value={cpfCnpj}
                  onChange={e => setCpfCnpj(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full pl-12 pr-md py-sm bg-surface border border-outline-variant rounded-xl focus:border-primary input-focus-ring transition-all text-body-md"
                  maxLength={18}
                  disabled={!caixaAberto}
                />
              </div>
            </div>
          </div>

          {/* Financial summary */}
          <div className="flex-1 glass-card rounded-2xl p-xl shadow-sm flex flex-col justify-between border-primary/20 bg-primary/5">
            <div className="space-y-md">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-body-md">Subtotal</span>
                <span className="font-geist-mono text-lg">{fmt(totalBruto)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-body-md">Descontos</span>
                <span className="font-geist-mono text-lg text-error">- {fmt(totalDesconto)}</span>
              </div>
              <div className="h-px bg-outline-variant/30 my-md" />
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-primary">Total a Pagar</span>
                  <span className="text-headline-xl font-bold text-on-surface leading-none">{fmt(total)}</span>
                </div>
                <div className="text-right text-body-sm text-on-surface-variant">
                  {qtdItens} iten{qtdItens !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <button
              onClick={finalizarVenda}
              disabled={carregando || !todosValidados || !caixaAberto}
              className="w-full bg-primary py-5 rounded-2xl text-on-primary text-headline-md font-semibold flex items-center justify-center gap-md hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-3xl">payments</span>
              {carregando ? 'PROCESSANDO...' : 'FINALIZAR VENDA (F10)'}
            </button>
          </div>
        </section>

        {/* Right column — 55% */}
        <section className="w-[55%] flex flex-col glass-card rounded-2xl shadow-sm overflow-hidden">
          <div className="p-lg bg-surface border-b border-outline-variant flex justify-between items-center flex-shrink-0">
            <h3 className="text-headline-md font-semibold flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">receipt</span>
              Itens da Venda
            </h3>
            <button
              onClick={() => setItens([])}
              disabled={itens.length === 0}
              className="px-md py-sm bg-surface-container border border-outline-variant rounded-lg text-label-md font-semibold flex items-center gap-xs hover:bg-surface-container-high transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Limpar Tudo
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-md space-y-sm scrollbar-hide">
            {itens.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-2xl text-on-surface-variant">
                <span className="material-symbols-outlined text-7xl opacity-20 mb-md">shopping_basket</span>
                <p className="text-body-md font-semibold opacity-50">Nenhum item adicionado</p>
                <p className="text-body-sm opacity-30 mt-xs">Bipe um produto para começar</p>
              </div>
            ) : (
              itens.map(item => (
                <div key={item.id} className={`item-row flex items-center gap-md p-md border rounded-xl transition-all ${
                  item.inativo
                    ? 'bg-error-container/20 border-error/40 opacity-80'
                    : 'bg-surface-container-lowest border-outline-variant hover:shadow-md'
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-sm">
                      <p className="text-label-md font-semibold text-on-surface truncate uppercase">{item.descricao}</p>
                      {item.inativo && (
                        <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full text-[10px] font-bold bg-error text-on-error flex-shrink-0">
                          <span className="material-symbols-outlined text-[12px]">block</span>
                          INATIVO
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      Cód: {item.codigo_barra}
                      {!item.inativo && ` · ${fmt(item.preco)}/un`}
                      {item.inativo && <span className="text-error font-semibold"> · Produto inativo — remova para continuar</span>}
                    </p>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center gap-xs bg-surface-container px-sm py-1 rounded-full border border-outline-variant">
                    <button onClick={() => atualizarQtd(item.id, item.qtd_item - 1)} className="w-6 h-6 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full font-bold">−</button>
                    <span className="font-geist-mono w-8 text-center text-mono-label">{String(item.qtd_item).padStart(2, '0')}</span>
                    <button onClick={() => atualizarQtd(item.id, item.qtd_item + 1)} className="w-6 h-6 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full font-bold">+</button>
                  </div>

                  {/* Discount */}
                  <div className="flex items-center gap-xs min-w-[100px]">
                    <input
                      type="number" min="0" max="100" value={item.desconto}
                      onChange={e => atualizarDesconto(item.id, e.target.value)}
                      className="w-14 px-sm py-1 border border-outline-variant rounded-lg text-body-sm text-center focus:border-primary input-focus-ring"
                      placeholder="0"
                    />
                    <span className="text-body-sm text-on-surface-variant">%</span>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-geist-mono text-mono-label text-on-surface">{fmt(subtotalItem(item))}</p>
                    {item.desconto > 0 && (
                      <p className="text-[10px] text-error font-bold uppercase">- {fmt(item.qtd_item * (item.preco || 0) * item.desconto / 100)} desc.</p>
                    )}
                  </div>

                  <button onClick={() => removerItem(item.id)} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between flex-shrink-0">
            <div className="text-body-sm text-on-surface-variant">
              {validando ? (
                <span className="flex items-center gap-xs text-primary animate-pulse">
                  <span className="material-symbols-outlined text-sm">sync</span>
                  Validando produto...
                </span>
              ) : (
                <span>{qtdItens} iten{qtdItens !== 1 ? 's' : ''} na sacola</span>
              )}
            </div>
            <div className="text-body-sm font-bold text-primary animate-pulse flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">wifi</span>
              Sistema Online
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
