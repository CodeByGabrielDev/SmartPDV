import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard',              icon: 'dashboard',              label: 'Dashboard' },
  { to: '/dashboard/venda',        icon: 'shopping_cart',          label: 'PDV/Venda' },
  { to: '/dashboard/caixa',        icon: 'account_balance_wallet', label: 'Caixa' },
  { to: '/dashboard/cliente',      icon: 'group',                  label: 'Clientes' },
  { to: '/dashboard/produtos',     icon: 'inventory_2',            label: 'Produtos' },
  { to: '/dashboard/notafiscal',   icon: 'description',            label: 'Nota Fiscal' },
  { to: '/dashboard/meios-pagamento', icon: 'payments',            label: 'Meios Pgto.' },
  { to: '/dashboard/entrada-mercadoria', icon: 'input',            label: 'Entrada Merc.' },
  { to: '/dashboard/estoque',      icon: 'warehouse',              label: 'Estoque' },
  { to: '/dashboard/excecao-imposto', icon: 'receipt_long',        label: 'Impostos' },
  { to: '/dashboard/perfil',       icon: 'settings',               label: 'Configurações' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 flex flex-col border-r border-outline-variant bg-surface w-64 z-50">
      {/* Brand */}
      <div className="px-md py-xl flex flex-col items-center gap-xs">
        <span className="text-headline-md font-bold text-primary">SmartPDV</span>
        <span className="text-label-md text-on-surface-variant">Venda &amp; Gestão</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-sm overflow-y-auto custom-scrollbar flex flex-col gap-xs py-md">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-sm bg-primary-container text-on-primary-container rounded-lg px-md py-sm transition-all duration-200 active:scale-95'
                : 'flex items-center gap-sm text-on-surface-variant hover:text-on-surface hover:bg-secondary-container/50 px-md py-sm rounded-lg transition-all duration-200'
            }
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="text-label-md font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-md border-t border-outline-variant">
        <button
          onClick={handleLogout}
          className="flex items-center gap-sm text-on-surface-variant hover:text-error w-full px-md py-sm transition-colors rounded-lg"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-label-md font-semibold">Sair</span>
        </button>
      </div>
    </aside>
  );
}
