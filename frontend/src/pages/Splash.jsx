import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 geometric-pattern" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-container/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-lg text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30">
          <span className="material-symbols-outlined text-on-primary text-4xl">bolt</span>
        </div>

        <div>
          <h1 className="text-headline-xl font-black text-primary tracking-tight">SmartPDV</h1>
          <p className="text-body-lg text-on-surface-variant mt-xs">Ponto de Venda Inteligente</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-surface-container rounded-full overflow-hidden mt-lg">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              animation: 'progressBar 2s ease-out forwards',
            }}
          />
        </div>

        <p className="text-body-sm text-on-surface-variant animate-pulse">Carregando o sistema...</p>
      </div>

      <footer className="absolute bottom-lg text-body-sm text-on-surface-variant opacity-50">
        v1.0.0 © SmartPDV — Todos os direitos reservados
      </footer>

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
