import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { estoqueService } from '../api/estoqueService';
import { dashboardService } from '../api/dashboardService';
import { caixaService } from '../api/caixaService';

const NotificacoesContext = createContext();

export const useNotificacoes = () => {
  const ctx = useContext(NotificacoesContext);
  if (!ctx) throw new Error('useNotificacoes must be used within NotificacoesProvider');
  return ctx;
};

const INTERVALO_MS = 60_000; // atualiza a cada 60 segundos

function gerarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function NotificacoesProvider({ children }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const lidas = useRef(new Set()); // IDs já lidos pelo usuário

  const marcarLida = useCallback((id) => {
    lidas.current.add(id);
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  }, []);

  const marcarTodasLidas = useCallback(() => {
    setNotificacoes(prev => prev.map(n => { lidas.current.add(n.id); return { ...n, lida: true }; }));
  }, []);

  const remover = useCallback((id) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  }, []);

  const verificar = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // não autendicado

    const novas = [];

    try {
      // 1. Estoque crítico
      const estoque = await estoqueService.listarEstoque();
      const criticos = (estoque || []).filter(i => (i.quantidade_atual ?? 0) <= 5);
      const baixos   = (estoque || []).filter(i => (i.quantidade_atual ?? 0) > 5 && (i.quantidade_atual ?? 0) <= 20);

      if (criticos.length > 0) {
        novas.push({
          id: `estoque-critico-${criticos.length}`,
          tipo: 'critico',
          titulo: `${criticos.length} produto${criticos.length !== 1 ? 's' : ''} com estoque crítico`,
          descricao: criticos.slice(0, 3).map(i => i.nome_produto).join(', ') + (criticos.length > 3 ? '...' : ''),
          icone: 'error',
          rota: '/dashboard/estoque',
          lida: lidas.current.has(`estoque-critico-${criticos.length}`),
          ts: Date.now(),
        });
      }

      if (baixos.length > 0) {
        novas.push({
          id: `estoque-baixo-${baixos.length}`,
          tipo: 'aviso',
          titulo: `${baixos.length} produto${baixos.length !== 1 ? 's' : ''} com estoque baixo`,
          descricao: baixos.slice(0, 3).map(i => i.nome_produto).join(', ') + (baixos.length > 3 ? '...' : ''),
          icone: 'warning',
          rota: '/dashboard/estoque',
          lida: lidas.current.has(`estoque-baixo-${baixos.length}`),
          ts: Date.now(),
        });
      }
    } catch { /* silencioso */ }

    try {
      // 2. NF-e pendentes
      const pendentes = await dashboardService.notasPendentes();
      if ((pendentes || []).length > 0) {
        novas.push({
          id: `nfe-pendentes-${pendentes.length}`,
          tipo: 'aviso',
          titulo: `${pendentes.length} Nota${pendentes.length !== 1 ? 's' : ''} Fiscal${pendentes.length !== 1 ? 'is' : ''} pendente${pendentes.length !== 1 ? 's' : ''}`,
          descricao: 'Aguardando conferência e entrada no estoque. Risco de multa após 24h.',
          icone: 'description',
          rota: '/dashboard/entrada-mercadoria',
          lida: lidas.current.has(`nfe-pendentes-${pendentes.length}`),
          ts: Date.now(),
        });
      }
    } catch { /* silencioso */ }

    try {
      // 3. Caixa aberto há mais de 10 horas
      const caixa = await caixaService.buscarCaixaAberto();
      if (caixa?.horario_abertura) {
        const horasAberto = (Date.now() - new Date(caixa.horario_abertura).getTime()) / 3_600_000;
        if (horasAberto >= 10) {
          novas.push({
            id: `caixa-longo`,
            tipo: 'info',
            titulo: 'Caixa aberto há mais de 10 horas',
            descricao: `Lembre-se de fechar o caixa ao final do turno. ${Math.floor(horasAberto)}h abertas.`,
            icone: 'account_balance_wallet',
            rota: '/dashboard/caixa',
            lida: lidas.current.has('caixa-longo'),
            ts: Date.now(),
          });
        }
      }
    } catch { /* silencioso */ }

    setNotificacoes(novas);
  }, []);

  // Primeira verificação + intervalo
  useEffect(() => {
    verificar();
    const interval = setInterval(verificar, INTERVALO_MS);
    return () => clearInterval(interval);
  }, [verificar]);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <NotificacoesContext.Provider value={{ notificacoes, naoLidas, marcarLida, marcarTodasLidas, remover, verificar }}>
      {children}
    </NotificacoesContext.Provider>
  );
}
