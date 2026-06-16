import { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../contexts/ThemeContext';
import { useNotificacoes } from '../contexts/NotificacoesContext';

const PAGE_TITLES = {
  '/dashboard':                    'Dashboard Home',
  '/dashboard/venda':              'PDV Terminal',
  '/dashboard/caixa':              'Caixa',
  '/dashboard/cliente':            'Gestão de Clientes',
  '/dashboard/produtos':           'Produtos',
  '/dashboard/notafiscal':         'Nota Fiscal',
  '/dashboard/meios-pagamento':    'Meios de Pagamento',
  '/dashboard/entrada-mercadoria': 'Entrada de Mercadoria',
  '/dashboard/estoque':            'Gestão de Estoque',
  '/dashboard/excecao-imposto':    'Exceção de Impostos',
  '/dashboard/perfil':             'Configurações',
  '/dashboard/faq':                'Central de Ajuda',
  '/dashboard/sobre':              'Sobre o SmartPDV',
};

const TIPO_STYLES = {
  critico: { bg: 'bg-error-container/30',  icon: 'text-error',   dot: 'bg-error',   badge: 'bg-error text-on-error' },
  aviso:   { bg: 'bg-amber-50',            icon: 'text-amber-600', dot: 'bg-amber-500', badge: 'bg-amber-500 text-white' },
  info:    { bg: 'bg-primary/5',           icon: 'text-primary',  dot: 'bg-primary', badge: 'bg-primary text-on-primary' },
};

export default function Dashboard() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas, remover } = useNotificacoes();
  const [painelAberto, setPainelAberto] = useState(false);
  const painelRef = useRef(null);
  const isAuthenticated = !!localStorage.getItem('token');
  const loginName  = localStorage.getItem('login') || 'Admin';

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  // Fecha o painel ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (painelRef.current && !painelRef.current.contains(e.target)) {
        setPainelAberto(false);
      }
    };
    if (painelAberto) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [painelAberto]);

  const title = PAGE_TITLES[location.pathname] || 'SmartPDV';
  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : 'AD';

  const handleNotifClick = (notif) => {
    marcarLida(notif.id);
    setPainelAberto(false);
    navigate(notif.rota);
  };

  const fmtTempo = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60_000) return 'agora';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}min atrás`;
    return `${Math.floor(diff / 3_600_000)}h atrás`;
  };

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />

      {/* Top header */}
      <header className="fixed top-0 right-0 z-40 flex justify-between items-center h-16 px-xl frosted-panel border-b border-outline-variant/30 shadow-topbar w-[calc(100%-16rem)]">
        <h1 className="text-headline-md font-black text-primary">{title}</h1>

        <div className="flex items-center gap-md">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-sm rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
            title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
            aria-label="Alternar Tema"
          >
            <span className="material-symbols-outlined">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Notification bell */}
          <div className="relative" ref={painelRef}>
            <button
              onClick={() => setPainelAberto(v => !v)}
              className="relative p-sm hover:bg-surface-container rounded-xl transition-colors flex items-center"
              aria-label="Notificações"
            >
              <span className={`material-symbols-outlined ${naoLidas > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                notifications
              </span>
              {naoLidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </button>

            {/* Notification panel */}
            {painelAberto && (
              <div className="absolute right-0 top-12 w-[380px] frosted-panel border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant/30 bg-surface-container-low/60">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
                    <h3 className="text-label-md font-bold text-on-surface">Notificações</h3>
                    {naoLidas > 0 && (
                      <span className="px-sm py-xs rounded-full bg-error text-on-error text-[10px] font-bold">
                        {naoLidas} nova{naoLidas !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {naoLidas > 0 && (
                    <button
                      onClick={marcarTodasLidas}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                  {notificacoes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-xl gap-md text-center px-lg">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-2xl">notifications_off</span>
                      </div>
                      <div>
                        <p className="text-label-md font-semibold text-on-surface">Tudo tranquilo!</p>
                        <p className="text-body-sm text-on-surface-variant mt-xs">Nenhuma notificação pendente no momento.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-outline-variant/30">
                      {notificacoes.map(notif => {
                        const style = TIPO_STYLES[notif.tipo] || TIPO_STYLES.info;
                        return (
                          <div
                            key={notif.id}
                            className={`flex items-start gap-md px-lg py-md cursor-pointer transition-all hover:bg-surface-container-low ${notif.lida ? 'opacity-60' : style.bg}`}
                            onClick={() => handleNotifClick(notif)}
                          >
                            {/* Dot indicator */}
                            <div className="flex-shrink-0 flex items-center justify-center mt-xs">
                              {!notif.lida && (
                                <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                              )}
                              {notif.lida && (
                                <div className="w-2 h-2 rounded-full bg-outline-variant/50" />
                              )}
                            </div>

                            {/* Icon */}
                            <div className={`w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0`}>
                              <span className={`material-symbols-outlined text-[18px] ${style.icon}`}>{notif.icone}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-label-md font-semibold text-on-surface leading-snug">{notif.titulo}</p>
                              <p className="text-[11px] text-on-surface-variant mt-xs leading-relaxed line-clamp-2">{notif.descricao}</p>
                              <p className="text-[10px] text-on-surface-variant mt-xs opacity-60">{fmtTempo(notif.ts)}</p>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={e => { e.stopPropagation(); remover(notif.id); }}
                              className="p-xs hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                              title="Remover"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-lg py-md border-t border-outline-variant/30 bg-surface-container-low/60 flex justify-between items-center">
                  <p className="text-[11px] text-on-surface-variant">Atualiza automaticamente a cada minuto</p>
                  <button
                    onClick={() => { setPainelAberto(false); navigate('/dashboard/estoque'); }}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Ver Estoque →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex items-center gap-sm border-l border-outline-variant pl-md">
            <div className="text-right">
              <p className="text-label-md font-semibold text-on-surface">{loginName}</p>
              <p className="text-body-sm text-on-surface-variant">Operador</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm shadow-sm">
              {getInitials(loginName)}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)] bg-background">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="ml-64 w-[calc(100%-16rem)] py-md px-xl flex justify-between items-center bg-surface border-t border-outline-variant/30">
        <span className="text-label-md font-semibold text-on-surface-variant">v1.0.0 © SmartPDV — Todos os direitos reservados</span>
        <div className="flex gap-lg">
          <a href="/dashboard/faq" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Ajuda</a>
          <a href="/dashboard/sobre" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Sobre</a>
        </div>
      </footer>
    </div>
  );
}
