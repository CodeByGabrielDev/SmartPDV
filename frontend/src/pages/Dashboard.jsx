import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const loginName = localStorage.getItem('login') || 'Usuário';

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    navigate('/');
  };

  const navItems = [
    { to: 'venda',             icon: '💰', label: 'PDV / Venda' },
    { to: 'caixa',             icon: '💵', label: 'Caixa' },
    { to: 'cliente',           icon: '👥', label: 'Clientes' },
    { to: 'notafiscal',        icon: '🧾', label: 'Nota Fiscal' },
    { to: 'pagamento',         icon: '💳', label: 'Pagamento' },
    { to: 'entrada-mercadoria',icon: '📦', label: 'Entrada Merc.' },
    { to: 'excecao-imposto',   icon: '📊', label: 'Impostos' },
    { to: 'perfil',            icon: '⚙️', label: 'Configurações' },
  ];

  return (
    <div className={`dashboard-container ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Top Header Bar */}
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Alternar menu"
          >
            {sidebarOpen ? '◀' : '☰'}
          </button>
          <div className="logo-section">
            <span className="logo-icon">🛒</span>
            <span>SmartPDV</span>
          </div>
        </div>
        <div className="user-section">
          <button className="theme-toggle" onClick={toggleTheme} title="Alternar tema">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="user-info">
            <span className="user-label">Colaborador</span>
            <span className="user-name">{loginName}</span>
          </div>
          <div className="user-icon">{getInitial(loginName)}</div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav>
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-text">{label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          🚪 {sidebarOpen ? 'Sair' : ''}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}