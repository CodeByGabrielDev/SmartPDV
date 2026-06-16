import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../api/dashboardService';

function MetricCard({ icon, label, value, sub, badge, badgeCls, alert, onClick }) {
  return (
    <div
      className={`bg-surface border rounded-2xl p-lg flex flex-col gap-xs shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer ${
        alert
          ? 'bg-error-container/30 border-error/60 border-2'
          : 'border-outline-variant/40'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-sm">
        <div className={`p-sm rounded-xl ${alert ? 'bg-error/10' : 'bg-primary-container/10'}`}>
          <span className={`material-symbols-outlined ${alert ? 'text-error' : 'text-primary'}`}>{icon}</span>
        </div>
        {badge && (
          <span className={`text-label-md font-semibold px-sm py-xs rounded-full ${badgeCls}`}>
            {badge}
          </span>
        )}
        {alert && (
          <div className="animate-pulse flex items-center gap-xs">
            <div className="h-2 w-2 rounded-full bg-error" />
            <span className="text-label-md font-bold text-error">Alerta</span>
          </div>
        )}
      </div>
      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
      <h2 className={`text-headline-lg font-semibold ${alert ? 'text-on-error-container' : 'text-on-surface'}`}>{value}</h2>
      {sub && <p className={`text-body-sm mt-xs ${alert ? 'text-on-error-container' : 'text-on-surface-variant'}`}>{sub}</p>}
    </div>
  );
}

function BarChart({ data }) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-on-surface-variant">Sem dados</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  const nonZero = data.filter(d => d.value > 0);
  const display = nonZero.length > 0 ? nonZero : data.slice(0, 7);

  return (
    <div className="flex items-end justify-between gap-sm h-64 w-full">
      {display.map((d, i) => {
        const pct = Math.round((d.value / max) * 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-sm">
            <div
              className="w-full bg-primary/10 rounded-t-lg hover:bg-primary/25 transition-all cursor-pointer relative group"
              style={{ height: `${Math.max(pct, 4)}%` }}
            >
              <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs px-sm py-xs rounded whitespace-nowrap z-10">
                {d.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
            <span className="font-geist-mono text-mono-label text-on-surface-variant">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalVendas = vendas.reduce((s, v) => s + (v.valorTotal || 0), 0);
  const totalDescontos = vendas.reduce((s, v) => s + (v.desconto || 0), 0);
  const qtdVendas = vendas.length;
  const ticketMedio = qtdVendas > 0 ? totalVendas / qtdVendas : 0;
  const qtdNotas = notas.length;
  const qtdPendentes = pendentes.length;

  const porHora = Array.from({ length: 24 }, (_, h) => ({
    label: `${h}h`,
    value: vendas.filter(v => new Date(v.dataHora).getHours() === h).reduce((s, v) => s + (v.valorTotal || 0), 0),
  }));

  const ultimasVendas = [...vendas]
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
    .slice(0, 5);

  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtHora = dt => dt ? new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';

  if (loading) {
    return (
      <div className="p-xl flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-md text-on-surface-variant">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-md">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-xl space-y-xl">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-xl">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">Dashboard</h1>
          <p className="text-body-sm text-on-surface-variant mt-xs">Visão geral das operações de hoje</p>
        </div>
        <button
          onClick={() => navigate('venda')}
          className="flex items-center gap-sm px-lg py-md bg-primary text-on-primary rounded-xl text-label-md font-bold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined">point_of_sale</span>
          Ir para PDV
        </button>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <MetricCard
          icon="payments"
          label="Faturamento Hoje"
          value={fmt(totalVendas)}
          sub={`${qtdVendas} vendas concluídas`}
          badge="+12%"
          badgeCls="text-emerald-700 bg-emerald-100 border border-emerald-200"
          onClick={() => navigate('venda')}
        />
        <MetricCard
          icon="receipt"
          label="Ticket Médio"
          value={fmt(ticketMedio)}
          sub={`Desconto total: ${fmt(totalDescontos)}`}
          badge={`Meta: ${fmt(85)}`}
          badgeCls="text-on-surface-variant bg-surface-container border border-outline-variant"
        />
        <MetricCard
          icon="description"
          label="Notas Fiscais"
          value={qtdNotas}
          sub="NFC-e emitidas hoje"
          badge="100% Sinc."
          badgeCls="text-primary bg-primary-container/20 border border-primary/20 font-bold"
          onClick={() => navigate('notafiscal')}
        />
        <MetricCard
          icon="inventory_2"
          label="Entradas Pendentes"
          value={`${qtdPendentes} Notas`}
          sub="Aguardando conferência de estoque"
          alert={qtdPendentes > 0}
          onClick={() => navigate('entrada-mercadoria')}
        />
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch">
        {/* Chart */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant/40 rounded-2xl p-xl shadow-card flex flex-col">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h3 className="text-headline-md font-bold text-on-surface">Faturamento por Hora</h3>
              <p className="text-body-sm text-on-surface-variant mt-xs">Desempenho operacional do dia corrente</p>
            </div>
            <div className="flex gap-sm">
              <button className="px-md py-sm bg-surface-container border border-outline-variant text-on-surface rounded-xl text-label-md font-semibold hover:bg-surface-container-high transition-colors">
                Exportar
              </button>
              <select className="px-md py-sm bg-surface border border-outline-variant text-on-surface rounded-xl text-label-md font-semibold focus:ring-primary focus:outline-none">
                <option>Hoje</option>
                <option>Ontem</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <BarChart data={porHora} />
          </div>
        </div>

        {/* Recent sales table */}
        <div className="bg-surface border border-outline-variant/40 rounded-2xl p-xl shadow-card">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="text-headline-md font-bold text-on-surface">Últimas Vendas</h3>
            <button
              onClick={() => navigate('venda')}
              className="text-label-md font-semibold text-primary hover:underline"
            >
              Ver todas
            </button>
          </div>
          <div className="flex flex-col">
            {/* Table header */}
            <div className="grid grid-cols-4 pb-sm border-b border-outline-variant mb-sm">
              {['Ticket', 'Vendedor', 'Hora', 'Valor'].map(h => (
                <span key={h} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right last:text-right first:text-left">
                  {h}
                </span>
              ))}
            </div>
            {ultimasVendas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-xl gap-md text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-40">receipt_long</span>
                </div>
                <div>
                  <p className="text-label-md font-semibold text-on-surface">Nenhuma venda</p>
                  <p className="text-body-sm text-on-surface-variant mt-xs">Nenhuma venda registrada hoje</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-xs">
                {ultimasVendas.map((v, i) => (
                  <div
                    key={v.id}
                    className={`grid grid-cols-4 py-sm items-center rounded-lg px-xs cursor-pointer transition-colors ${i % 2 === 0 ? 'hover:bg-surface-container/50' : 'bg-surface-container-low/40 hover:bg-surface-container/50'}`}
                  >
                    <span className="font-geist-mono text-mono-label text-on-surface">#{v.ticket || v.id}</span>
                    <span className="text-body-sm text-on-surface-variant truncate">{v.nomeVendedor || '—'}</span>
                    <span className="text-body-sm text-on-surface-variant">{fmtHora(v.dataHora)}</span>
                    <span className="text-label-md font-semibold text-on-surface text-right">{fmt(v.valorTotal || 0)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warning banner */}
      {qtdPendentes > 0 && (
        <div className="bg-on-tertiary-fixed-variant p-lg rounded-2xl flex flex-col md:flex-row justify-between items-center gap-md border border-outline shadow-card">
          <div className="flex items-center gap-md">
            <div className="bg-tertiary-container text-on-tertiary-container h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined">priority_high</span>
            </div>
            <div>
              <h4 className="text-label-md font-bold text-white">Pendências de Transmissão</h4>
              <p className="text-body-sm text-white/80">
                Existem {qtdPendentes} Notas Fiscais pendentes. Risco de multa após 24h.
              </p>
            </div>
          </div>
          <div className="flex gap-md">
            <button
              onClick={() => navigate('entrada-mercadoria')}
              className="px-xl py-md bg-surface-container-lowest text-on-tertiary-fixed-variant text-label-md font-bold rounded-xl shadow-sm hover:bg-surface-container transition-all active:scale-95"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
