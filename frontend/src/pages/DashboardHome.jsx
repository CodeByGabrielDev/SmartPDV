import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../api/dashboardService';

function MetricCard({ icon, label, value, sub, badge, badgeCls, alert, onClick }) {
  return (
    <div
      className={`bento-card p-xl rounded-xl border cursor-pointer ${
        alert
          ? 'bg-error-container/30 border-2 border-error'
          : 'bg-surface border-outline-variant'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-md">
        <div className={`p-sm rounded-lg ${alert ? 'bg-error/10' : 'bg-primary-container/10'}`}>
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
      <p className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider mb-xs">{label}</p>
      <h2 className={`text-headline-lg font-semibold ${alert ? 'text-on-error-container' : 'text-on-surface'}`}>{value}</h2>
      {sub && <p className={`text-body-sm mt-sm ${alert ? 'text-on-error-container' : 'text-on-surface-variant'}`}>{sub}</p>}
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
              className="w-full bg-primary-container/20 rounded-t-lg hover:bg-primary-container transition-all cursor-pointer relative group"
              style={{ height: `${Math.max(pct, 4)}%` }}
            >
              <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs px-sm py-xs rounded whitespace-nowrap">
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
      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <MetricCard
          icon="payments"
          label="Faturamento Hoje"
          value={fmt(totalVendas)}
          sub={`${qtdVendas} vendas concluídas`}
          badge="+12%"
          badgeCls="text-emerald-600 bg-emerald-50"
          onClick={() => navigate('venda')}
        />
        <MetricCard
          icon="receipt"
          label="Ticket Médio"
          value={fmt(ticketMedio)}
          sub={`Desconto total: ${fmt(totalDescontos)}`}
          badge={`Meta: ${fmt(85)}`}
          badgeCls="text-on-surface-variant"
        />
        <MetricCard
          icon="description"
          label="Notas Fiscais"
          value={qtdNotas}
          sub="NFC-e emitidas hoje"
          badge="100% Sinc."
          badgeCls="text-primary font-bold"
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
        <div className="lg:col-span-2 bg-surface p-xl rounded-xl border border-outline-variant flex flex-col">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h3 className="text-headline-md font-semibold text-on-surface">Faturamento por Hora</h3>
              <p className="text-body-sm text-on-surface-variant">Desempenho operacional do dia corrente</p>
            </div>
            <div className="flex gap-sm">
              <button className="px-md py-sm bg-surface-variant text-on-surface rounded-lg text-label-md font-semibold hover:bg-outline-variant transition-colors">
                Exportar
              </button>
              <select className="px-md py-sm bg-surface border-outline-variant text-on-surface rounded-lg text-label-md font-semibold focus:ring-primary">
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
        <div className="bg-surface p-xl rounded-xl border border-outline-variant">
          <div className="flex justify-between items-center mb-xl">
            <h3 className="text-headline-md font-semibold text-on-surface">Últimas Vendas</h3>
            <button
              onClick={() => navigate('venda')}
              className="text-label-md font-semibold text-primary hover:underline"
            >
              Ver todas
            </button>
          </div>
          <div className="flex flex-col">
            <div className="grid grid-cols-4 pb-sm border-b border-outline-variant mb-sm">
              {['Ticket', 'Vendedor', 'Hora', 'Valor'].map(h => (
                <span key={h} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right last:text-right first:text-left">
                  {h}
                </span>
              ))}
            </div>
            {ultimasVendas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-sm opacity-30">receipt_long</span>
                <p className="text-body-sm">Nenhuma venda hoje</p>
              </div>
            ) : (
              <div className="flex flex-col gap-xs">
                {ultimasVendas.map(v => (
                  <div key={v.id} className="grid grid-cols-4 py-sm items-center hover:bg-surface-container-low transition-colors rounded px-xs cursor-pointer">
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
        <div className="bg-on-tertiary-fixed-variant p-lg rounded-xl flex flex-col md:flex-row justify-between items-center gap-md border border-outline">
          <div className="flex items-center gap-md">
            <div className="bg-tertiary-container text-on-tertiary-container h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0">
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
              className="px-xl py-md bg-white text-on-tertiary-fixed-variant text-label-md font-bold rounded-lg shadow-sm hover:bg-white/90 transition-all active:scale-95"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
