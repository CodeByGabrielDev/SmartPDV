import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../contexts/ThemeContext';

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

export default function Dashboard() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = !!localStorage.getItem('token');
  const loginName  = localStorage.getItem('login') || 'Admin';

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const title = PAGE_TITLES[location.pathname] || 'SmartPDV';

  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : 'AD';

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />

      {/* Top header */}
      <header className="fixed top-0 right-0 z-40 flex justify-between items-center h-16 px-xl bg-surface border-b border-outline-variant w-[calc(100%-16rem)]">
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
          <button className="p-sm hover:bg-surface-container rounded-xl transition-colors flex items-center" aria-label="Notificações">
            <span className="material-symbols-outlined text-primary">notifications</span>
          </button>

          {/* User info */}
          <div className="flex items-center gap-sm border-l border-outline-variant pl-md">
            <div className="text-right">
              <p className="text-label-md font-semibold text-on-surface">{loginName}</p>
              <p className="text-body-sm text-on-surface-variant">Operador</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-sm shadow-sm">
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
      <footer className="ml-64 w-[calc(100%-16rem)] py-md px-xl flex justify-between items-center bg-surface border-t border-outline-variant">
        <span className="text-label-md font-semibold text-on-surface-variant">v1.0.0 © SmartPDV — Todos os direitos reservados</span>
        <div className="flex gap-lg">
          <a href="#" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Suporte</a>
          <a href="#" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Documentação</a>
        </div>
      </footer>
    </div>
  );
}
