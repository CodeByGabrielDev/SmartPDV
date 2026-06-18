import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { estoqueService } from '../api/estoqueService';
import { entradaMercadoriaService } from '../api/entradaMercadoriaService';

export default function TopBar({ title }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const loginName = localStorage.getItem('login') || 'Admin';

  const [notifOpen, setNotifOpen] = useState(false);
  const [estoqueCritico, setEstoqueCritico] = useState([]);
  const [notasPendentes, setNotasPendentes] = useState([]);
  const notifRef = useRef(null);

  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : 'AD';

  useEffect(() => {
    const fetchNotificacoes = async () => {
      const [estoque, notas] = await Promise.allSettled([
        estoqueService.listarEstoque(),
        entradaMercadoriaService.listarNotasTransito(),
      ]);
      if (estoque.status === 'fulfilled') {
        setEstoqueCritico((estoque.value || []).filter(i => (i.quantidade_atual ?? 0) <= 5));
      }
      if (notas.status === 'fulfilled') {
        setNotasPendentes(notas.value || []);
      }
    };
    fetchNotificacoes();
  }, []);

  useEffect(() => {
    const handleClickFora = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [notifOpen]);

  const totalNotifs = estoqueCritico.length + notasPendentes.length;

  return (
    <header className="fixed top-0 right-0 z-40 flex justify-between items-center h-16 px-xl bg-surface border-b border-outline-variant w-[calc(100%-16rem)]">
      <h1 className="text-headline-md font-black text-primary">{title}</h1>

      <div className="flex items-center gap-lg">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-sm rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-on-surface"
          title="Alternar Tema"
        >
          <span className="material-symbols-outlined">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="p-sm hover:bg-surface-variant rounded-full transition-colors flex items-center relative"
            title="Notificações"
          >
            <span className="material-symbols-outlined text-primary">notifications</span>
            {totalNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {totalNotifs > 9 ? '9+' : totalNotifs}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-sm w-80 bg-surface border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
                <span className="text-label-md font-bold text-on-surface">Notificações</span>
                {totalNotifs > 0 && (
                  <span className="text-[10px] font-bold px-sm py-xs bg-error text-white rounded-full">
                    {totalNotifs}
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {totalNotifs === 0 ? (
                  <div className="flex flex-col items-center justify-center py-xl gap-sm text-center">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-30">
                      notifications_none
                    </span>
                    <p className="text-body-sm text-on-surface-variant">Tudo em ordem</p>
                  </div>
                ) : (
                  <>
                    {estoqueCritico.length > 0 && (
                      <div>
                        <p className="px-lg pt-md pb-xs text-[10px] font-bold text-error uppercase tracking-widest">
                          Estoque Crítico
                        </p>
                        {estoqueCritico.slice(0, 3).map(item => (
                          <button
                            key={item.id}
                            onClick={() => { navigate('/dashboard/estoque'); setNotifOpen(false); }}
                            className="w-full flex items-center gap-md px-lg py-sm hover:bg-surface-container transition-colors text-left"
                          >
                            <span className="material-symbols-outlined text-error text-[20px] flex-shrink-0">warning</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-label-md font-semibold text-on-surface truncate">{item.nome_produto}</p>
                              <p className="text-body-sm text-error">
                                {item.quantidade_atual ?? 0} unidade{(item.quantidade_atual ?? 0) !== 1 ? 's' : ''} restante{(item.quantidade_atual ?? 0) !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </button>
                        ))}
                        {estoqueCritico.length > 3 && (
                          <button
                            onClick={() => { navigate('/dashboard/estoque'); setNotifOpen(false); }}
                            className="w-full px-lg py-sm text-body-sm text-primary hover:underline text-left"
                          >
                            +{estoqueCritico.length - 3} produto(s) crítico(s) →
                          </button>
                        )}
                      </div>
                    )}

                    {notasPendentes.length > 0 && (
                      <div className={estoqueCritico.length > 0 ? 'border-t border-outline-variant/50' : ''}>
                        <p className="px-lg pt-md pb-xs text-[10px] font-bold text-yellow-600 uppercase tracking-widest">
                          Entrada Pendente
                        </p>
                        {notasPendentes.slice(0, 2).map((nota, i) => (
                          <button
                            key={nota.id ?? i}
                            onClick={() => { navigate('/dashboard/entrada-mercadoria'); setNotifOpen(false); }}
                            className="w-full flex items-center gap-md px-lg py-sm hover:bg-surface-container transition-colors text-left"
                          >
                            <span className="material-symbols-outlined text-yellow-600 text-[20px] flex-shrink-0">local_shipping</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-label-md font-semibold text-on-surface">
                                Nota #{nota.numeroNota || nota.id || 'N/A'}
                              </p>
                              <p className="text-body-sm text-on-surface-variant">Aguardando conferência</p>
                            </div>
                          </button>
                        ))}
                        {notasPendentes.length > 2 && (
                          <button
                            onClick={() => { navigate('/dashboard/entrada-mercadoria'); setNotifOpen(false); }}
                            className="w-full px-lg py-sm text-body-sm text-primary hover:underline text-left"
                          >
                            +{notasPendentes.length - 2} nota(s) pendente(s) →
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User info */}
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
  );
}
