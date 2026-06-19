import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../api/dashboardService';

function MetricCard({ icon, label, value, sub, badge, badgeCls, alert, onClick }) {
  return (
    <div
      className={`bg-surface border rounded-2xl p-lg flex flex-col gap-xs shadow-card hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${
        alert
          ? 'bg-error-container/30 border-error border-2'
          : 'border-outline-variant'
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

const HORAS_COMERCIAIS = Array.from({ length: 17 }, (_, i) => i + 6); // 6h até 22h

function BarChart({ data, horaAtual }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-on-surface-variant">
        Sem dados para exibir
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex items-end justify-between gap-1 h-56 w-full">
      {data.map((d, i) => {
        const pct = Math.round((d.value / max) * 100);
        const isAtual = d.hora === horaAtual;
        const temVenda = d.value > 0;

        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-xs">
            <div
              className={`w-full rounded-t-md transition-all relative group ${
                isAtual
                  ? 'bg-primary shadow-sm'
                  : temVenda
                  ? 'bg-primary/40 hover:bg-primary/60'
                  : 'bg-surface-container hover:bg-surface-container-high'
              }`}
              style={{ height: `${temVenda ? Math.max(pct, 6) : 4}%` }}
            >
              {temVenda && (
                <div className="hidden group-hover:flex absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs px-sm py-xs rounded-lg whitespace-nowrap z-10 items-center gap-xs shadow-lg">
                  <span className="material-symbols-outlined text-[14px]">payments</span>
                  {d.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              )}
            </div>
            <span className={`text-[10px] font-mono ${isAtual ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function exportarCSV(vendas, periodo) {
  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const totalVendas = vendas.reduce((s, v) => s + (v.valorTotal || 0), 0);
  const totalDescontos = vendas.reduce((s, v) => s + (v.desconto || 0), 0);
  const ticketMedio = vendas.length > 0 ? totalVendas / vendas.length : 0;

  const porHora = HORAS_COMERCIAIS.map(h => ({
    hora: `${h}h`,
    valor: vendas.filter(v => new Date(v.dataHora).getHours() === h).reduce((s, v) => s + (v.valorTotal || 0), 0),
  }));

  const COLS = 5;
  const pad = row => [...row, ...Array(COLS - row.length).fill('')].slice(0, COLS);

  const linhas = [
    pad([`Exportação do Dashboard — ${periodo}`]),
    pad([`Gerado em: ${new Date().toLocaleString('pt-BR')}`]),
    pad([]),
    pad(['RESUMO DO DIA']),
    pad(['Faturamento Total', fmt(totalVendas)]),
    pad(['Ticket Médio', fmt(ticketMedio)]),
    pad(['Total de Descontos', fmt(totalDescontos)]),
    pad(['Quantidade de Vendas', vendas.length]),
    pad([]),
    pad(['FATURAMENTO POR HORA']),
    pad(['Hora', 'Faturamento (R$)']),
    ...porHora.map(h => pad([h.hora, h.valor.toFixed(2).replace('.', ',')])),
    pad([]),
    pad(['VENDAS REALIZADAS']),
    pad(['Ticket', 'Vendedor', 'Data/Hora', 'Valor (R$)', 'Desconto (R$)']),
    ...vendas.map(v => pad([
      v.ticket || v.id,
      v.nomeVendedor || '—',
      v.dataHora ? new Date(v.dataHora).toLocaleString('pt-BR') : '—',
      (v.valorTotal || 0).toFixed(2).replace('.', ','),
      (v.desconto || 0).toFixed(2).replace('.', ','),
    ])),
  ];

  const csv = linhas.map(l => l.join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dashboard_${periodo.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('Hoje');

  const horaAtual = new Date().getHours();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const fetchVendas = periodo === 'Hoje'
          ? dashboardService.vendasHoje()
          : dashboardService.vendasOntem();

        const [v, n, p] = await Promise.allSettled([
          fetchVendas,
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
  }, [periodo]);

  const totalVendas = vendas.reduce((s, v) => s + (v.valorTotal || 0), 0);
  const totalDescontos = vendas.reduce((s, v) => s + (v.desconto || 0), 0);
  const qtdVendas = vendas.length;
  const ticketMedio = qtdVendas > 0 ? totalVendas / qtdVendas : 0;
  const qtdNotas = notas.length;
  const qtdPendentes = pendentes.length;

  const porHora = HORAS_COMERCIAIS.map(h => ({
    hora: h,
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
          <p className="text-body-sm text-on-surface-variant mt-xs">Visão geral das operações de {periodo === 'Hoje' ? 'hoje' : 'ontem'}</p>
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
          label="Faturamento"
          value={fmt(totalVendas)}
          sub={`${qtdVendas} venda${qtdVendas !== 1 ? 's' : ''} concluída${qtdVendas !== 1 ? 's' : ''}`}
          onClick={() => navigate('tickets')}
        />
        <MetricCard
          icon="receipt"
          label="Ticket Médio"
          value={fmt(ticketMedio)}
          sub={`Desconto total: ${fmt(totalDescontos)}`}
        />
        <MetricCard
          icon="description"
          label="Notas Fiscais"
          value={qtdNotas}
          sub="NF-e emitidas"
          onClick={() => navigate('notafiscal')}
        />
        <MetricCard
          icon="inventory_2"
          label="Entradas Pendentes"
          value={`${qtdPendentes} Nota${qtdPendentes !== 1 ? 's' : ''}`}
          sub="Aguardando conferência de estoque"
          alert={qtdPendentes > 0}
          onClick={() => navigate('entrada-mercadoria')}
        />
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch">
        {/* Chart */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-2xl p-xl shadow-card flex flex-col">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h3 className="text-headline-md font-bold text-on-surface">Faturamento por Hora</h3>
              <p className="text-body-sm text-on-surface-variant mt-xs">Horário comercial (6h–22h)</p>
            </div>
            <div className="flex gap-sm">
              <button
                onClick={() => exportarCSV(vendas, periodo)}
                className="px-md py-sm bg-surface-container border border-outline-variant text-on-surface rounded-xl text-label-md font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Exportar
              </button>
              <select
                value={periodo}
                onChange={e => setPeriodo(e.target.value)}
                className="px-md py-sm bg-surface border border-outline-variant text-on-surface rounded-xl text-label-md font-semibold focus:ring-primary focus:outline-none cursor-pointer"
              >
                <option>Hoje</option>
                <option>Ontem</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <BarChart data={porHora} horaAtual={periodo === 'Hoje' ? horaAtual : -1} />
          </div>
          {periodo === 'Hoje' && (
            <div className="flex items-center gap-lg mt-md pt-md border-t border-outline-variant/50">
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-body-sm text-on-surface-variant">Hora atual</span>
              </div>
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-sm bg-primary/40" />
                <span className="text-body-sm text-on-surface-variant">Com vendas</span>
              </div>
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-sm bg-surface-container" />
                <span className="text-body-sm text-on-surface-variant">Sem vendas</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent sales table */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-xl shadow-card">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="text-headline-md font-bold text-on-surface">Últimas Vendas</h3>
            <button
              onClick={() => navigate('tickets')}
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
              <div className="flex flex-col items-center justify-center py-xl gap-md text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-40">receipt_long</span>
                </div>
                <div>
                  <p className="text-label-md font-semibold text-on-surface">Nenhuma venda</p>
                  <p className="text-body-sm text-on-surface-variant mt-xs">Nenhuma venda registrada {periodo === 'Hoje' ? 'hoje' : 'ontem'}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-xs">
                {ultimasVendas.map((v, i) => (
                  <div
                    key={v.id}
                    className={`grid grid-cols-4 py-sm items-center rounded-lg px-xs ${i % 2 === 0 ? 'hover:bg-surface-container/50' : 'bg-surface-container-low/40 hover:bg-surface-container/50'}`}
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
              <h4 className="text-label-md font-bold text-white">Entradas de Mercadoria Pendentes</h4>
              <p className="text-body-sm text-white/80">
                {qtdPendentes} nota{qtdPendentes !== 1 ? 's' : ''} aguardando conferência de estoque.
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
