import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../api/dashboardService';

// ── Gráfico de barras SVG puro ──────────────────────────────────────────────
function BarChart({ data, color = '#2563eb' }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">Sem dados para exibir</div>
    );
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 100, H = 60, barW = W / data.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const barH = (d.value / max) * (H - 4);
        const x = i * (W / data.length) + 0.5;
        const y = H - barH;
        return (
          <g key={`bar-${i}-${d.label}`}>
            <rect x={x} y={y} width={barW} height={barH} rx="1" fill="url(#barGrad)" />
          </g>
        );
      })}
    </svg>
  );
}

// ── Card de métrica ──────────────────────────────────────────────────────────
function MetricCard({ icon, label, value, sub, color, onClick }) {
  return (
    <div className={`dash-metric-card${onClick ? ' clickable' : ''}`} onClick={onClick}>
      <div className="dash-metric-icon" style={{ background: color + '22', color }}>
        {icon}
      </div>
      <div className="dash-metric-body">
        <span className="dash-metric-label">{label}</span>
        <span className="dash-metric-value">{value}</span>
        {sub && <span className="dash-metric-sub">{sub}</span>}
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function DashboardHome() {
  const navigate = useNavigate();
  const loginName = localStorage.getItem('login') || 'Usuário';

  const [vendas, setVendas]           = useState([]);
  const [notas, setNotas]             = useState([]);
  const [pendentes, setPendentes]     = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [v, n, p] = await Promise.allSettled([
          dashboardService.vendasHoje(),
          dashboardService.notasFiscais(),
          dashboardService.notasPendentes(),
        ]);
        if (v.status === 'fulfilled') setVendas(v.value || []);
        if (n.status === 'fulfilled') setNotas(n.value || []);
        if (p.status === 'fulfilled') setPendentes(p.value || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Cálculos ──
  const totalVendas     = vendas.reduce((s, v) => s + (v.valorTotal || 0), 0);
  const totalDescontos  = vendas.reduce((s, v) => s + (v.desconto   || 0), 0);
  const qtdVendas       = vendas.length;
  const ticketMedio     = qtdVendas > 0 ? totalVendas / qtdVendas : 0;
  const qtdNotas        = notas.length;
  const qtdPendentes    = pendentes.length;

  // Faturamento por hora (0–23)
  const porHora = Array.from({ length: 24 }, (_, h) => ({
    label: `${h}h`,
    value: vendas
      .filter((v) => new Date(v.dataHora).getHours() === h)
      .reduce((s, v) => s + (v.valorTotal || 0), 0),
  }));

  // Últimas 5 vendas
  const ultimasVendas = [...vendas]
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
    .slice(0, 5);

  const fmt = (v) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const fmtHora = (dt) =>
    dt ? new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="dash-home">
      {/* Saudação */}
      <div className="dash-greeting">
        <div>
          <h1 className="dash-greeting-title">{saudacao}, {loginName} 👋</h1>
          <p className="dash-greeting-sub">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button className="dash-refresh-btn" onClick={() => window.location.reload()} title="Atualizar dados">
          🔄 Atualizar
        </button>
      </div>

      {loading ? (
        <div className="dash-loading">
          <div className="loading-spinner" />
          <p>Carregando dados...</p>
        </div>
      ) : (
        <>
          {/* ── Métricas ── */}
          <div className="dash-metrics-grid">
            <MetricCard
              icon="💰"
              label="Faturamento Hoje"
              value={fmt(totalVendas)}
              sub={`${qtdVendas} venda${qtdVendas !== 1 ? 's' : ''} realizadas`}
              color="#2563eb"
              onClick={() => navigate('venda')}
            />
            <MetricCard
              icon="🎫"
              label="Ticket Médio"
              value={fmt(ticketMedio)}
              sub={`Desconto total: ${fmt(totalDescontos)}`}
              color="#7c3aed"
            />
            <MetricCard
              icon="🧾"
              label="Notas Fiscais"
              value={qtdNotas}
              sub="emitidas pela loja"
              color="#0891b2"
              onClick={() => navigate('notafiscal')}
            />
            <MetricCard
              icon="📦"
              label="Entradas Pendentes"
              value={qtdPendentes}
              sub={qtdPendentes > 0 ? '⚠️ Aguardando recebimento' : '✅ Tudo em dia'}
              color={qtdPendentes > 0 ? '#d97706' : '#16a34a'}
              onClick={() => navigate('entrada-mercadoria')}
            />
          </div>

          {/* ── Gráfico + Tabela ── */}
          <div className="dash-bottom-grid">
            {/* Gráfico de faturamento por hora */}
            <div className="dash-chart-card">
              <div className="dash-card-header">
                <h2>📈 Faturamento por Hora</h2>
                <span className="dash-card-badge">Hoje</span>
              </div>
              <div className="dash-chart-area">
                <BarChart data={porHora} color="#2563eb" />
              </div>
              <div className="dash-chart-labels">
                {[0, 6, 12, 18, 23].map((h) => (
                  <span key={`label-${h}`}>{h}h</span>
                ))}
              </div>
            </div>

            {/* Últimas vendas */}
            <div className="dash-table-card">
              <div className="dash-card-header">
                <h2>🕐 Últimas Vendas</h2>
                <button className="dash-link-btn" onClick={() => navigate('venda')}>
                  Ver todas →
                </button>
              </div>
              {ultimasVendas.length === 0 ? (
                <div className="dash-empty">
                  <p>📭</p>
                  <p>Nenhuma venda hoje</p>
                </div>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Vendedor</th>
                      <th>Hora</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimasVendas.map((v) => (
                      <tr key={v.id}>
                        <td><span className="dash-ticket">#{v.ticket}</span></td>
                        <td>{v.nomeVendedor || '—'}</td>
                        <td>{fmtHora(v.dataHora)}</td>
                        <td><strong>{fmt(v.valorTotal || 0)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ── Notas pendentes (se houver) ── */}
          {qtdPendentes > 0 && (
            <div className="dash-alert-card" onClick={() => navigate('entrada-mercadoria')}>
              <span className="dash-alert-icon">⚠️</span>
              <div>
                <strong>{qtdPendentes} nota{qtdPendentes !== 1 ? 's' : ''} fiscal{qtdPendentes !== 1 ? 'is' : ''} aguardando entrada de mercadoria</strong>
                <p>Clique para acessar o módulo de Entrada de Mercadoria</p>
              </div>
              <span className="dash-alert-arrow">→</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
