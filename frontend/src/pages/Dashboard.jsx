import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Page title map
const PAGE_TITLES = {
  '/dashboard':                   'Dashboard Home',
  '/dashboard/venda':             'PDV Terminal',
  '/dashboard/caixa':             'Caixa',
  '/dashboard/cliente':           'Gestão de Clientes',
  '/dashboard/produtos':          'Produtos',
  '/dashboard/notafiscal':        'Nota Fiscal',
  '/dashboard/meios-pagamento':   'Meios de Pagamento',
  '/dashboard/entrada-mercadoria':'Entrada de Mercadoria',
  '/dashboard/estoque':           'Gestão de Estoque',
  '/dashboard/excecao-imposto':   'Exceção de Impostos',
  '/dashboard/perfil':            'Configurações',
};

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const loginName = localStorage.getItem('login') || 'Admin';

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
        <div className="flex items-center gap-lg">
          <button className="p-sm hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined text-primary">notifications</span>
          </button>
          <div className="flex items-center gap-sm border-l border-outline-variant pl-lg">
            <div className="text-right">
              <p className="text-label-md font-semibold text-on-surface">{loginName}</p>
              <p className="text-body-sm text-on-surface-variant">Operador</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm border border-outline-variant">
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
      <footer className="ml-64 w-[calc(100%-16rem)] py-md px-xl flex justify-between items-center bg-background border-t border-outline-variant">
        <span className="text-label-md font-semibold text-secondary">v1.0.0 © SmartPDV - Todos os direitos reservados</span>
        <div className="flex gap-lg">
          <a href="#" className="text-label-md font-semibold text-on-surface-variant hover:text-on-surface transition-colors">Suporte</a>
          <a href="#" className="text-label-md font-semibold text-on-surface-variant hover:text-on-surface transition-colors">Documentação</a>
        </div>
      </footer>
    </div>
  );
}
