import { useTheme } from '../contexts/ThemeContext';

export default function TopBar({ title }) {
  const { theme, toggleTheme } = useTheme();
  const loginName = localStorage.getItem('login') || 'Admin';

  const getInitials = (name) =>
    name ? name.slice(0, 2).toUpperCase() : 'AD';

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
        <button className="p-sm hover:bg-surface-variant rounded-full transition-colors flex items-center">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>

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
