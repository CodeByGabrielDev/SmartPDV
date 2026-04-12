import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    navigate('/');
  };

  return (
    <div className={`dashboard-container ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>🛒 SmartPDV</h2>
        </div>
        <nav>
          <Link to="venda" className="nav-item">
            <span className="nav-icon">💰</span>
            <span className="nav-text">PDV / Venda</span>
          </Link>
          <Link to="caixa" className="nav-item">
            <span className="nav-icon">💵</span>
            <span className="nav-text">Caixa</span>
          </Link>
          <Link to="cliente" className="nav-item">
            <span className="nav-icon">👥</span>
            <span className="nav-text">Clientes</span>
          </Link>
          <Link to="notafiscal" className="nav-item">
            <span className="nav-icon">🧾</span>
            <span className="nav-text">Nota Fiscal</span>
          </Link>
          <Link to="pagamento" className="nav-item">
            <span className="nav-icon">💳</span>
            <span className="nav-text">Pagamento</span>
          </Link>
          <Link to="entrada-mercadoria" className="nav-item">
            <span className="nav-icon">📦</span>
            <span className="nav-text">Entrada Merc.</span>
          </Link>
          <Link to="excecao-imposto" className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Impostos</span>
          </Link>
          <Link to="perfil" className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Configurações</span>
          </Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Sair
        </button>
      </aside>
      <main className="main-content">
        <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '◀' : '☰'}
        </button>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}