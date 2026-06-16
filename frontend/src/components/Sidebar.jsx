import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard',                    icon: 'dashboard',              label: 'Dashboard' },
  { to: '/dashboard/venda',              icon: 'shopping_cart',          label: 'PDV/Venda' },
  { to: '/dashboard/caixa',              icon: 'account_balance_wallet', label: 'Caixa' },
  { to: '/dashboard/cliente',            icon: 'group',                  label: 'Clientes' },
  { to: '/dashboard/produtos',           icon: 'inventory_2',            label: 'Produtos' },
  { to: '/dashboard/notafiscal',         icon: 'description',            label: 'Nota Fiscal' },
  { to: '/dashboard/meios-pagamento',    icon: 'payments',               label: 'Meios Pgto.' },
  { to: '/dashboard/entrada-mercadoria', icon: 'input',                  label: 'Entrada Merc.' },
  { to: '/dashboard/estoque',            icon: 'warehouse',              label: 'Estoque' },
  { to: '/dashboard/excecao-imposto',    icon: 'receipt_long',           label: 'Impostos' },
  { to: '/dashboard/tickets',            icon: 'confirmation_number',    label: 'Tickets' },
  { to: '/dashboard/perfil',             icon: 'settings',               label: 'Configurações' },
];

const navSecondary = [
  { to: '/dashboard/faq',   icon: 'help',  label: 'Ajuda / FAQ' },
  { to: '/dashboard/sobre', icon: 'info',  label: 'Sobre o Sistema' },
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
      <div className="px-lg py-xl flex flex-col items-center gap-xs">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-xs shadow-lg">
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 26 }}>storefront</span>
        </div>
        <span className="text-headline-md font-bold text-primary">SmartPDV</span>
        <span className="text-label-md text-on-surface-variant">Venda &amp; Gestão</span>
      </div>

      {/* Divider */}
      <div className="mx-lg border-t border-outline-variant mb-sm" />

      {/* Main Nav items */}
      <nav className="flex-1 px-sm overflow-y-auto custom-scrollbar flex flex-col gap-xs py-sm">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-md bg-primary text-on-primary rounded-xl px-md py-sm transition-all duration-200 active:scale-95 shadow-sm'
                : 'flex items-center gap-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container px-md py-sm rounded-xl transition-all duration-200'
            }
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span className="text-label-md font-semibold">{label}</span>
          </NavLink>
        ))}

        {/* Secondary nav */}
        <div className="mx-sm mt-sm mb-xs border-t border-outline-variant/50" />
        <p className="px-md text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 mb-xs">Suporte</p>
        {navSecondary.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-md bg-primary text-on-primary rounded-xl px-md py-sm transition-all duration-200 shadow-sm'
                : 'flex items-center gap-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container px-md py-sm rounded-xl transition-all duration-200'
            }
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span className="text-label-md font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="mx-lg border-t border-outline-variant mt-sm" />
      <div className="p-md">
        <button
          onClick={handleLogout}
          className="flex items-center gap-md text-on-surface-variant hover:text-error hover:bg-error-container/20 w-full px-md py-sm transition-all rounded-xl"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-label-md font-semibold">Sair</span>
        </button>
      </div>
    </aside>
  );
}
