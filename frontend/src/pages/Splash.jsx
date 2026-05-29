import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <span className="splash-logo-icon">🛒</span>
        </div>
        <h1 className="splash-title">SmartPDV</h1>
        <p className="splash-subtitle">Sistema de Ponto de Venda</p>
        <div className="splash-bar">
          <div className="splash-bar-fill" />
        </div>
      </div>
      <footer className="splash-footer">
        Desenvolvido por <strong>Gabriel Lima</strong> &mdash; TrueUnion &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
