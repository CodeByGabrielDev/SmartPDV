import { useState, useEffect } from 'react';
import { clienteService } from '../api/clienteService';
import { showAlert } from '../components/Alert';

const FORM_INICIAL = {
  nome_cliente: '',
  cpf_cnpj: '',
  email: '',
  telefone: '',
  cep: '',
  tipo: 'PESSOA_FISICA',
};

const FILTRO_INICIAL = { busca: '', tipo: '' };

export default function Cliente() {
  const [clientes, setClientes]           = useState([]);
  const [form, setForm]                   = useState(FORM_INICIAL);
  const [filtro, setFiltro]               = useState(FILTRO_INICIAL);
  const [loading, setLoading]             = useState(true);
  const [salvando, setSalvando]           = useState(false);
  const [atualizando, setAtualizando]     = useState(false);
  const [mostrarForm, setMostrarForm]     = useState(false);
  const [clienteDetalhe, setClienteDetalhe] = useState(null); // modal de detalhes/edição
  const [modoEdicao, setModoEdicao]       = useState(false);
  const [formEdicao, setFormEdicao]       = useState(FORM_INICIAL);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await clienteService.listarClientes();
      setClientes(data || []);
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdicaoChange = (e) => {
    const { name, value } = e.target;
    setFormEdicao((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  /* ── Cadastrar ── */
  const handleCadastrar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await clienteService.cadastrarCliente({
        nome_cliente: form.nome_cliente,
        cpf_cnpj:     form.cpf_cnpj,
        email:        form.email,
        telefone:     form.telefone,
        cep:          form.cep,
        tipo:         form.tipo,
      });
      showAlert(`"${form.nome_cliente}" cadastrado com sucesso!`, 'success');
      setForm(FORM_INICIAL);
      setMostrarForm(false);
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao cadastrar cliente', 'error');
    } finally {
      setSalvando(false);
    }
  };

  /* ── Atualizar ── */
  const handleAtualizar = async (e) => {
    e.preventDefault();
    setAtualizando(true);
    try {
      await clienteService.atualizarCliente(clienteDetalhe.id, {
        nome_cliente: formEdicao.nome_cliente,
        cpf_cnpj:     formEdicao.cpf_cnpj,
        email:        formEdicao.email,
        telefone:     formEdicao.telefone,
        cep:          formEdicao.cep,
        tipo:         formEdicao.tipo,
      });
      showAlert('Cliente atualizado com sucesso!', 'success');
      setClienteDetalhe(null);
      setModoEdicao(false);
      carregar();
    } catch (err) {
      showAlert(err.displayMessage || 'Erro ao atualizar cliente', 'error');
    } finally {
      setAtualizando(false);
    }
  };

  const abrirEdicao = (c) => {
    setFormEdicao({
      nome_cliente: c.nome_cliente  ?? '',
      cpf_cnpj:     c.cpf_cnpj     ?? '',
      email:        c.email         ?? '',
      telefone:     c.telefone      ?? '',
      cep:          c.cep           ?? '',
      tipo:         c.tipo          ?? 'PESSOA_FISICA',
    });
    setModoEdicao(true);
  };

  const fecharModal = () => {
    setClienteDetalhe(null);
    setModoEdicao(false);
    setFormEdicao(FORM_INICIAL);
  };

  const limparFiltros = () => setFiltro(FILTRO_INICIAL);

  const clientesFiltrados = clientes.filter((c) => {
    const termo = filtro.busca.toLowerCase();
    const matchBusca =
      !termo ||
      c.nome_cliente?.toLowerCase().includes(termo) ||
      c.cpf_cnpj?.toLowerCase().includes(termo) ||
      c.email?.toLowerCase().includes(termo) ||
      c.telefone?.toLowerCase().includes(termo);
    const matchTipo = !filtro.tipo || c.tipo === filtro.tipo;
    return matchBusca && matchTipo;
  });

  /* ── formatações ── */
  const formatarCpfCnpj = (valor) => {
    if (!valor) return '—';
    const v = valor.replace(/\D/g, '');
    if (v.length === 11) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (v.length === 14) return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return valor;
  };

  const formatarTelefone = (valor) => {
    if (!valor) return '—';
    const v = valor.replace(/\D/g, '');
    if (v.length === 11) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (v.length === 10) return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return valor;
  };

  const tipoLabel     = (tipo) => tipo === 'PESSOA_JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física';
  const tipoBadgeClass = (tipo) => tipo === 'PESSOA_JURIDICA' ? 'cli-badge-pj' : 'cli-badge-pf';

  return (
    <>
      <div className="cli-container">

        {/* ══ Cabeçalho ═══════════════════════════════════════ */}
        <div className="cli-header">
          <div>
            <h1 className="cli-title">👥 Clientes</h1>
            <p className="cli-subtitle">Clientes cadastrados nesta loja</p>
          </div>
          <button
            className="cli-btn-novo"
            onClick={() => { setMostrarForm((v) => !v); setForm(FORM_INICIAL); }}
          >
            {mostrarForm ? '✕ Cancelar' : '+ Novo Cliente'}
          </button>
        </div>

        {/* ══ Formulário de cadastro ══════════════════════════ */}
        {mostrarForm && (
          <div className="cli-form-card">
            <h2 className="cli-section-title">Cadastrar Novo Cliente</h2>
            <form onSubmit={handleCadastrar} className="cli-form">
              <div className="cli-form-grid">

                <div className="cli-field cli-field-wide">
                  <label>Nome completo <span className="cli-required">*</span></label>
                  <input
                    name="nome_cliente"
                    value={form.nome_cliente}
                    onChange={handleChange}
                    placeholder="Ex: João da Silva"
                    required
                    disabled={salvando}
                  />
                </div>

                <div className="cli-field">
                  <label>CPF / CNPJ <span className="cli-required">*</span></label>
                  <input
                    name="cpf_cnpj"
                    value={form.cpf_cnpj}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                    disabled={salvando}
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div className="cli-field">
                  <label>E-mail</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                    disabled={salvando}
                  />
                </div>

                <div className="cli-field">
                  <label>Telefone</label>
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    disabled={salvando}
                  />
                </div>

                <div className="cli-field">
                  <label>CEP <span className="cli-required">*</span></label>
                  <input
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    required
                    disabled={salvando}
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>

                <div className="cli-field">
                  <label>Tipo</label>
                  <select name="tipo" value={form.tipo} onChange={handleChange} disabled={salvando}>
                    <option value="PESSOA_FISICA">Pessoa Física</option>
                    <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                  </select>
                </div>

              </div>

              <div className="cli-form-actions">
                <button type="submit" className="cli-btn-salvar" disabled={salvando}>
                  {salvando
                    ? <><span className="cli-spinner" /> Salvando...</>
                    : '✓ Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══ Filtros ═════════════════════════════════════════ */}
        <div className="cli-filtros-card">
          <div className="cli-filtros-row">
            <div className="cli-filtro-busca-wrap">
              <span className="cli-filtro-icon">🔍</span>
              <input
                type="text"
                name="busca"
                value={filtro.busca}
                onChange={handleFiltroChange}
                placeholder="Buscar por nome, CPF/CNPJ, e-mail ou telefone..."
                className="cli-filtro-busca"
              />
              {filtro.busca && (
                <button className="cli-filtro-clear" onClick={() => setFiltro((f) => ({ ...f, busca: '' }))}>✕</button>
              )}
            </div>

            <select name="tipo" value={filtro.tipo} onChange={handleFiltroChange} className="cli-filtro-select">
              <option value="">Todos os tipos</option>
              <option value="PESSOA_FISICA">Pessoa Física</option>
              <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
            </select>

            {(filtro.busca || filtro.tipo) && (
              <button className="cli-btn-limpar" onClick={limparFiltros}>Limpar filtros</button>
            )}
          </div>

          <div className="cli-filtros-info">
            <span className="cli-count">
              {clientesFiltrados.length} de {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
            </span>
            {(filtro.busca || filtro.tipo) && <span className="cli-filtro-ativo">• filtro ativo</span>}
          </div>
        </div>

        {/* ══ Lista ═══════════════════════════════════════════ */}
        <div className="cli-list-card">
          {loading ? (
            <div className="cli-loading">
              <div className="loading-spinner" />
              <p>Carregando clientes...</p>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="cli-empty">
              <span>👥</span>
              <p>{filtro.busca || filtro.tipo ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}</p>
              {!filtro.busca && !filtro.tipo && (
                <p className="cli-empty-sub">Clique em "+ Novo Cliente" para começar</p>
              )}
            </div>
          ) : (
            <div className="cli-table-wrapper">
              <table className="cli-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF / CNPJ</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Tipo</th>
                    <th>Localidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((c, idx) => (
                    <tr key={c.cpf_cnpj ?? idx}>
                      <td><span className="cli-nome">{c.nome_cliente}</span></td>
                      <td><span className="cli-mono">{formatarCpfCnpj(c.cpf_cnpj)}</span></td>
                      <td><span className="cli-email">{c.email || '—'}</span></td>
                      <td><span className="cli-mono">{formatarTelefone(c.telefone)}</span></td>
                      <td>
                        <span className={`cli-badge ${tipoBadgeClass(c.tipo)}`}>
                          {tipoLabel(c.tipo)}
                        </span>
                      </td>
                      <td>
                        <span className="cli-localidade">
                          {c.localidade && c.uf ? `${c.localidade} / ${c.uf}` : '—'}
                        </span>
                      </td>
                      <td>
                        <div className="cli-acoes">
                          <button
                            className="cli-btn-detalhe"
                            onClick={() => { setClienteDetalhe(c); setModoEdicao(false); }}
                            title="Ver detalhes"
                          >
                            👁 Ver
                          </button>
                          <button
                            className="cli-btn-editar"
                            onClick={() => { setClienteDetalhe(c); abrirEdicao(c); }}
                            title="Editar cliente"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ══ Modal detalhes / edição ══════════════════════════ */}
      {clienteDetalhe && (
        <div className="cli-modal-overlay" onClick={fecharModal}>
          <div className="cli-modal" onClick={(e) => e.stopPropagation()}>

            {/* Header do modal */}
            <div className="cli-modal-header">
              <div className="cli-modal-avatar">
                {clienteDetalhe.nome_cliente?.charAt(0).toUpperCase()}
              </div>
              <div className="cli-modal-header-info">
                <h2 className="cli-modal-nome">{clienteDetalhe.nome_cliente}</h2>
                <span className={`cli-badge ${tipoBadgeClass(clienteDetalhe.tipo)}`}>
                  {tipoLabel(clienteDetalhe.tipo)}
                </span>
              </div>
              <div className="cli-modal-header-actions">
                {!modoEdicao && (
                  <button
                    className="cli-modal-btn-editar"
                    onClick={() => abrirEdicao(clienteDetalhe)}
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                )}
                <button className="cli-modal-close" onClick={fecharModal} title="Fechar">✕</button>
              </div>
            </div>

            {/* Corpo: detalhes ou formulário de edição */}
            {!modoEdicao ? (
              /* ── Visualização ── */
              <div className="cli-modal-body">
                <div className="cli-modal-grid">
                  <div className="cli-modal-item">
                    <span className="cli-modal-label">CPF / CNPJ</span>
                    <span className="cli-modal-value cli-mono">{formatarCpfCnpj(clienteDetalhe.cpf_cnpj)}</span>
                  </div>
                  <div className="cli-modal-item">
                    <span className="cli-modal-label">E-mail</span>
                    <span className="cli-modal-value">{clienteDetalhe.email || '—'}</span>
                  </div>
                  <div className="cli-modal-item">
                    <span className="cli-modal-label">Telefone</span>
                    <span className="cli-modal-value cli-mono">{formatarTelefone(clienteDetalhe.telefone)}</span>
                  </div>
                  <div className="cli-modal-item">
                    <span className="cli-modal-label">CEP</span>
                    <span className="cli-modal-value cli-mono">{clienteDetalhe.cep || '—'}</span>
                  </div>
                  <div className="cli-modal-item cli-modal-item-wide">
                    <span className="cli-modal-label">Logradouro</span>
                    <span className="cli-modal-value">{clienteDetalhe.logradouro || '—'}</span>
                  </div>
                  <div className="cli-modal-item">
                    <span className="cli-modal-label">Bairro</span>
                    <span className="cli-modal-value">{clienteDetalhe.bairro || '—'}</span>
                  </div>
                  <div className="cli-modal-item">
                    <span className="cli-modal-label">Cidade / UF</span>
                    <span className="cli-modal-value">
                      {clienteDetalhe.localidade && clienteDetalhe.uf
                        ? `${clienteDetalhe.localidade} — ${clienteDetalhe.uf}` : '—'}
                    </span>
                  </div>
                  <div className="cli-modal-item">
                    <span className="cli-modal-label">Estado</span>
                    <span className="cli-modal-value">{clienteDetalhe.estado || '—'}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Edição ── */
              <div className="cli-modal-body">
                <form onSubmit={handleAtualizar} className="cli-form">
                  <div className="cli-form-grid">

                    <div className="cli-field cli-field-wide">
                      <label>Nome completo</label>
                      <input
                        name="nome_cliente"
                        value={formEdicao.nome_cliente}
                        onChange={handleEdicaoChange}
                        disabled={atualizando}
                      />
                    </div>

                    <div className="cli-field">
                      <label>CPF / CNPJ</label>
                      <input
                        name="cpf_cnpj"
                        value={formEdicao.cpf_cnpj}
                        onChange={handleEdicaoChange}
                        disabled={atualizando}
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>

                    <div className="cli-field">
                      <label>E-mail</label>
                      <input
                        name="email"
                        type="email"
                        value={formEdicao.email}
                        onChange={handleEdicaoChange}
                        disabled={atualizando}
                      />
                    </div>

                    <div className="cli-field">
                      <label>Telefone</label>
                      <input
                        name="telefone"
                        value={formEdicao.telefone}
                        onChange={handleEdicaoChange}
                        disabled={atualizando}
                      />
                    </div>

                    <div className="cli-field">
                      <label>CEP</label>
                      <input
                        name="cep"
                        value={formEdicao.cep}
                        onChange={handleEdicaoChange}
                        disabled={atualizando}
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>

                    <div className="cli-field">
                      <label>Tipo</label>
                      <select name="tipo" value={formEdicao.tipo} onChange={handleEdicaoChange} disabled={atualizando}>
                        <option value="PESSOA_FISICA">Pessoa Física</option>
                        <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                      </select>
                    </div>

                  </div>

                  <div className="cli-modal-edit-actions">
                    <button
                      type="button"
                      className="cli-modal-btn-cancelar"
                      onClick={() => setModoEdicao(false)}
                      disabled={atualizando}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="cli-btn-salvar" disabled={atualizando}>
                      {atualizando
                        ? <><span className="cli-spinner" /> Salvando...</>
                        : '✓ Salvar alterações'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!modoEdicao && (
              <div className="cli-modal-footer">
                <button className="cli-modal-btn-fechar" onClick={fecharModal}>Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
