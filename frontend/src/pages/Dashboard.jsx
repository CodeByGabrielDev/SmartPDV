import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

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
  '/dashboard/tickets':            'Tickets de Venda',
  '/dashboard/perfil':             'Configurações',
  '/dashboard/faq':                'Central de Ajuda',
  '/dashboard/sobre':              'Sobre o SmartPDV',
};

export default function Dashboard() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const title = PAGE_TITLES[location.pathname] || 'SmartPDV';

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      <TopBar title={title} />

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
