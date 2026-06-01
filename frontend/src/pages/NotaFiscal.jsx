import { useState, useEffect } from 'react';
import { notaFiscalService } from '../api/notaFiscalService';
import { lojaService } from '../api/lojaService';
import { showAlert } from '../components/Alert';

const CFOPS_TRANSFERENCIA = [5152, 6152];

const CFOPS_COMUNS = [
  { value: 5101, label: '5101 — Venda de produção do estabelecimento' },
  { value: 5102, label: '5102 — Venda de mercadoria adquirida' },
  { value: 5152, label: '5152 — Transferência de mercadoria (estadual)' },
  { value: 6101, label: '6101 — Venda de produção (interestadual)' },
  { value: 6102, label: '6102 — Venda de mercadoria (interestadual)' },
  { value: 6152, label: '6152 — Transferência de mercadoria (interestadual)' },
];

const FORM_INICIAL = {
  cfop: 5102,
  serieNfe: 1,
  cpfCliente: '',
  idLoja: null,
};

const ITEM_INICIAL = { codigo_barra: '', quantidade_Itens: 1, desconto: 0 };

export default function NotaFiscal() {
  const [aba, setAba]                   = useState('historico');
  const [modalAberto, setModalAberto]   = useState(false);
  const [etapa, setEtapa]               = useState(1); // 1 = dados, 2 = itens

  // Formulário
  const [form, setForm]                 = useState(FORM_INICIAL);
  const [itemForm, setItemForm]         = useState(ITEM_INICIAL);
  const [itens, setItens]               = useState([]);
  const [emitindo, setEmitindo]         = useState(false);

  // Lojas
  const [lojas, setLojas]               = useState([]);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);
  const [buscaLoja, setBuscaLoja]       = useState('');
  const [carregandoLojas, setCarregandoLojas] = useState(false);

  // Histórico
  const [notas, setNotas]               = useState([]);
  const [carregandoNotas, setCarregandoNotas] = useState(false);

  const ehTransferencia = CFOPS_TRANSFERENCIA.includes(Number(form.cfop));

  useEffect(() => {
    if (aba === 'historico') carregarNotas();
  }, [aba]);

  useEffect(() => {
    if (ehTransferencia && lojas.length === 0) carregarLojas();
    // Limpa campos ao trocar tipo
    setLojaSelecionada(null);
    setForm((f) => ({ ...f, cpfCliente: '', idLoja: null }));
  }, [form.cfop]);

  const carregarNotas = async () => {
    setCarregandoNotas(true);
    try {
      const data = await notaFiscalService.listarNotas();
      setNotas(data || []);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao carregar notas', 'error');
    } finally {
      setCarregandoNotas(false);
    }
  };

  const carregarLojas = async () => {
    setCarregandoLojas(true);
    try {
      const data = await lojaService.listarLojasAtivas();
      setLojas(data || []);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao buscar lojas', 'error');
    } finally {
      setCarregandoLojas(false);
    }
  };

  const selecionarLoja = (loja) => {
    setLojaSelecionada(loja);
    setForm((f) => ({ ...f, idLoja: loja.id }));
    setBuscaLoja('');
  };

  const adicionarItem = () => {
    if (!itemForm.codigo_barra.trim()) return;
    setItens((prev) => [...prev, {
      codigo_barra: itemForm.codigo_barra.trim(),
      quantidade_Itens: parseInt(itemForm.quantidade_Itens) || 1,
      desconto: parseFloat(itemForm.desconto) || 0,
    }]);
    setItemForm(ITEM_INICIAL);
  };

  const removerItem = (idx) => setItens((prev) => prev.filter((_, i) => i !== idx));

  const podeProsseguir = ehTransferencia
    ? !!form.idLoja
    : !!form.cpfCliente.trim();

  const emitirNota = async () => {
    if (itens.length === 0) {
      showAlert('Adicione pelo menos um item', 'error');
      return;
    }
    setEmitindo(true);
    try {
      const payload = {
        cfop: Number(form.cfop),
        serieNfe: Number(form.serieNfe),
        codigo_barra: itens,
        ...(ehTransferencia
          ? { id_Loja: form.idLoja }
          : { cpf_cliente: form.cpfCliente }),
      };
      const response = await notaFiscalService.emitirNotaAvulsa(payload);
      showAlert(`NF-e nº ${response.nf_numero} emitida com sucesso!`, 'success');
      fecharModal();
      if (aba === 'historico') carregarNotas();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao emitir nota', 'error');
    } finally {
      setEmitindo(false);
    }
  };

  const abrirModal = () => {
    setForm(FORM_INICIAL);
    setItens([]);
    setItemForm(ITEM_INICIAL);
    setLojaSelecionada(null);
    setEtapa(1);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEtapa(1);
  };

  const fmt = (v) =>
    v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';

  const lojasFiltradas = lojas.filter((l) =>
    l.razaoSocial?.toLowerCase().includes(buscaLoja.toLowerCase()) ||
    (l.cnpj || l.cpfCnpj || '')?.includes(buscaLoja)
  );

  return (
    <>
      <div className="nf-container">

        {/* ── Cabeçalho ── */}
        <div className="nf-header">
          <div>
            <h1 className="nf-title">🧾 Módulo Fiscal</h1>
            <p className="nf-subtitle">Emissão e histórico de notas fiscais</p>
          </div>
          <button className="nf-btn-emitir" onClick={abrirModal}>
            + Emitir Nota Fiscal
          </button>
        </div>

        {/* ── Abas ── */}
        <div className="nf-tabs">
          <button
            className={`nf-tab ${aba === 'historico' ? 'active' : ''}`}
            onClick={() => setAba('historico')}
          >
            📋 Histórico
          </button>
          <button
            className={`nf-tab ${aba === 'emitir' ? 'active' : ''}`}
            onClick={() => { setAba('emitir'); abrirModal(); }}
          >
            📝 Nova Emissão
          </button>
        </div>

        {/* ── Histórico ── */}
        {aba === 'historico' && (
          <div className="nf-historico">
            {carregandoNotas ? (
              <div className="nf-loading">
                <div className="loading-spinner" />
                <p>Carregando notas...</p>
              </div>
            ) : notas.length === 0 ? (
              <div className="nf-empty">
                <span>🧾</span>
                <p>Nenhuma nota fiscal emitida</p>
              </div>
            ) : (
              <div className="nf-cards-grid">
                {notas.map((nota, idx) => {
                  const status = nota.status_Nota?.toLowerCase() || 'pendente';
                  return (
                    <div key={idx} className="nf-card">
                      <div className="nf-card-top">
                        <div className="nf-card-num">
                          <span className="nf-card-label">NF-e</span>
                          <strong>#{nota.nf_numero}</strong>
                          <span className="nf-card-serie">Série {nota.serieNf}</span>
                        </div>
                        <span className={`nf-status-badge nf-status-${status}`}>
                          {nota.status_Nota || 'PENDENTE'}
                        </span>
                      </div>

                      <div className="nf-card-body">
                        <div className="nf-card-row">
                          <span className="nf-card-label">CFOP</span>
                          <span className="nf-card-val nf-mono">{nota.cfop}</span>
                        </div>
                        <div className="nf-card-row">
                          <span className="nf-card-label">Destinatário</span>
                          <span className="nf-card-val">{nota.cpf_Cliente || nota.loja || '—'}</span>
                        </div>
                        <div className="nf-card-row">
                          <span className="nf-card-label">Emissão</span>
                          <span className="nf-card-val">
                            {nota.data_Emissao
                              ? new Date(nota.data_Emissao).toLocaleDateString('pt-BR')
                              : '—'}
                          </span>
                        </div>
                      </div>

                      <div className="nf-card-valores">
                        <div className="nf-card-valor-item">
                          <span className="nf-card-label">Bruto</span>
                          <span>{fmt(nota.valor_Bruto_Nota)}</span>
                        </div>
                        <div className="nf-card-valor-item">
                          <span className="nf-card-label">Impostos</span>
                          <span>{fmt(nota.valor_Total_De_Imposto_A_Pagar)}</span>
                        </div>
                        <div className="nf-card-valor-item nf-card-valor-destaque">
                          <span className="nf-card-label">Líquido</span>
                          <strong>{fmt(nota.valor_Liquido_Nota)}</strong>
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

      {/* ══════════════════════════════════════
          MODAL DE EMISSÃO
      ══════════════════════════════════════ */}
      {modalAberto && (
        <div className="nf-modal-overlay" onClick={fecharModal}>
          <div className="nf-modal" onClick={(e) => e.stopPropagation()}>

            {/* Cabeçalho do modal */}
            <div className="nf-modal-header">
              <div className="nf-modal-header-info">
                <span className="nf-modal-icon">🧾</span>
                <div>
                  <h2 className="nf-modal-title">Emissão de Nota Fiscal</h2>
                  <p className="nf-modal-subtitle">
                    {etapa === 1 ? 'Etapa 1 de 2 — Dados da nota' : 'Etapa 2 de 2 — Itens'}
                  </p>
                </div>
              </div>
              <button className="nf-modal-close" onClick={fecharModal}>✕</button>
            </div>

            {/* Stepper */}
            <div className="nf-stepper">
              <div className={`nf-step ${etapa >= 1 ? 'active' : ''}`}>
                <div className="nf-step-circle">1</div>
                <span>Dados</span>
              </div>
              <div className="nf-step-line" />
              <div className={`nf-step ${etapa >= 2 ? 'active' : ''}`}>
                <div className="nf-step-circle">2</div>
                <span>Itens</span>
              </div>
            </div>

            {/* ── Etapa 1: Dados da NF ── */}
            {etapa === 1 && (
              <div className="nf-modal-body">

                <div className="nf-form-grid">
                  {/* CFOP */}
                  <div className="nf-field nf-field-wide">
                    <label className="nf-label">CFOP</label>
                    <select
                      className="nf-select"
                      value={form.cfop}
                      onChange={(e) => setForm((f) => ({ ...f, cfop: Number(e.target.value) }))}
                    >
                      {CFOPS_COMUNS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    {ehTransferencia && (
                      <p className="nf-field-hint nf-hint-transfer">
                        ⇄ CFOP de transferência — selecione a loja de destino abaixo
                      </p>
                    )}
                  </div>

                  {/* Série */}
                  <div className="nf-field">
                    <label className="nf-label">Série NF-e</label>
                    <input
                      className="nf-input"
                      type="number"
                      min="1"
                      value={form.serieNfe}
                      onChange={(e) => setForm((f) => ({ ...f, serieNfe: e.target.value }))}
                    />
                  </div>
                </div>

                {/* ── Transferência: busca de loja ── */}
                {ehTransferencia && (
                  <div className="nf-section">
                    <p className="nf-section-title">Loja de Destino</p>

                    {lojaSelecionada ? (
                      <div className="nf-loja-selecionada">
                        <div className="nf-loja-info">
                          <strong>{lojaSelecionada.razaoSocial}</strong>
                          <span className="nf-mono">{lojaSelecionada.cnpj || lojaSelecionada.cpfCnpj}</span>
                        </div>
                        <button
                          className="nf-btn-trocar"
                          onClick={() => { setLojaSelecionada(null); setForm((f) => ({ ...f, idLoja: null })); }}
                        >
                          Trocar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="nf-busca-wrap">
                          <span className="nf-busca-icon">🔍</span>
                          <input
                            className="nf-busca-input"
                            placeholder="Buscar por razão social ou CNPJ..."
                            value={buscaLoja}
                            onChange={(e) => setBuscaLoja(e.target.value)}
                          />
                        </div>

                        <div className="nf-lojas-lista">
                          {carregandoLojas ? (
                            <div className="nf-lojas-loading">
                              <div className="loading-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
                              <span>Carregando lojas...</span>
                            </div>
                          ) : lojasFiltradas.length === 0 ? (
                            <p className="nf-lojas-empty">Nenhuma loja encontrada</p>
                          ) : (
                            lojasFiltradas.map((loja, idx) => (
                              <div
                                key={idx}
                                className="nf-loja-item"
                                onClick={() => selecionarLoja(loja)}
                              >
                                <strong>{loja.razaoSocial}</strong>
                                <span className="nf-mono">{loja.cnpj || loja.cpfCnpj}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── Venda normal: CPF/CNPJ do cliente ── */}
                {!ehTransferencia && (
                  <div className="nf-section">
                    <p className="nf-section-title">Destinatário</p>
                    <div className="nf-field">
                      <label className="nf-label">CPF / CNPJ do Cliente</label>
                      <input
                        className="nf-input nf-mono"
                        type="text"
                        placeholder="000.000.000-00 ou 00.000.000/0001-00"
                        value={form.cpfCliente}
                        onChange={(e) => setForm((f) => ({ ...f, cpfCliente: e.target.value }))}
                      />
                      <p className="nf-field-hint">Informe o CPF ou CNPJ do destinatário da nota</p>
                    </div>
                  </div>
                )}

                <div className="nf-modal-footer">
                  <button className="nf-btn-cancel" onClick={fecharModal}>Cancelar</button>
                  <button
                    className="nf-btn-next"
                    onClick={() => setEtapa(2)}
                    disabled={!podeProsseguir}
                  >
                    Próximo — Itens →
                  </button>
                </div>
              </div>
            )}

            {/* ── Etapa 2: Itens ── */}
            {etapa === 2 && (
              <div className="nf-modal-body">

                {/* Resumo da etapa 1 */}
                <div className="nf-resumo-etapa1">
                  <div className="nf-resumo-item">
                    <span className="nf-card-label">CFOP</span>
                    <span className="nf-mono">{form.cfop}</span>
                  </div>
                  <div className="nf-resumo-item">
                    <span className="nf-card-label">Série</span>
                    <span>{form.serieNfe}</span>
                  </div>
                  <div className="nf-resumo-item">
                    <span className="nf-card-label">
                      {ehTransferencia ? 'Loja destino' : 'Destinatário'}
                    </span>
                    <span className="nf-mono">
                      {ehTransferencia
                        ? lojaSelecionada?.razaoSocial
                        : form.cpfCliente}
                    </span>
                  </div>
                </div>

                {/* Adicionar item */}
                <div className="nf-section">
                  <p className="nf-section-title">Adicionar Item</p>
                  <div className="nf-item-form">
                    <div className="nf-field nf-field-wide">
                      <label className="nf-label">Código de Barras</label>
                      <input
                        className="nf-input nf-mono"
                        placeholder="Bipe ou digite o código..."
                        value={itemForm.codigo_barra}
                        onChange={(e) => setItemForm((f) => ({ ...f, codigo_barra: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && adicionarItem()}
                        autoFocus
                      />
                    </div>
                    <div className="nf-field">
                      <label className="nf-label">Qtd</label>
                      <input
                        className="nf-input"
                        type="number"
                        min="1"
                        value={itemForm.quantidade_Itens}
                        onChange={(e) => setItemForm((f) => ({ ...f, quantidade_Itens: e.target.value }))}
                      />
                    </div>
                    <div className="nf-field">
                      <label className="nf-label">Desconto (R$)</label>
                      <input
                        className="nf-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={itemForm.desconto}
                        onChange={(e) => setItemForm((f) => ({ ...f, desconto: e.target.value }))}
                      />
                    </div>
                    <button className="nf-btn-add-item" onClick={adicionarItem}>
                      + Adicionar
                    </button>
                  </div>
                </div>

                {/* Lista de itens */}
                {itens.length > 0 ? (
                  <div className="nf-itens-lista">
                    <div className="nf-itens-header">
                      <span>{itens.length} item{itens.length !== 1 ? 'ns' : ''}</span>
                    </div>
                    {itens.map((item, idx) => (
                      <div key={idx} className="nf-item-row">
                        <span className="nf-item-num">{idx + 1}</span>
                        <span className="nf-item-codigo nf-mono">{item.codigo_barra}</span>
                        <span className="nf-item-qtd">Qtd: <strong>{item.quantidade_Itens}</strong></span>
                        {item.desconto > 0 && (
                          <span className="nf-item-desc">Desc: R$ {item.desconto.toFixed(2)}</span>
                        )}
                        <button className="nf-item-remove" onClick={() => removerItem(idx)}>✕</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="nf-itens-empty">
                    <span>📦</span>
                    <p>Nenhum item adicionado</p>
                    <p className="nf-itens-empty-sub">Bipe o código de barras ou digite acima</p>
                  </div>
                )}

                <div className="nf-modal-footer">
                  <button className="nf-btn-cancel" onClick={() => setEtapa(1)}>← Voltar</button>
                  <button
                    className="nf-btn-emitir"
                    onClick={emitirNota}
                    disabled={emitindo || itens.length === 0}
                  >
                    {emitindo ? '⏳ Emitindo...' : '🧾 Emitir Nota Fiscal'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
