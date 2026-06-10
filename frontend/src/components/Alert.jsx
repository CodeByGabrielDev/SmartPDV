import { createRoot } from 'react-dom/client';

function AlertComponent({ message, type, onClose }) {
  const colors = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    error:   'bg-error-container text-on-error-container border-error',
    info:    'bg-surface-container text-on-surface border-outline-variant',
    warning: 'bg-amber-100 text-amber-800 border-amber-300',
  };
  const icons = {
    success: 'check_circle',
    error:   'error',
    info:    'info',
    warning: 'warning',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] flex items-center gap-sm px-lg py-md rounded-xl border shadow-lg max-w-sm ${colors[type] || colors.info}`}
      style={{ animation: 'slideIn 0.3s ease-out' }}
    >
      <span className="material-symbols-outlined">{icons[type] || icons.info}</span>
      <p className="text-label-md flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-sm hover:opacity-70 transition-opacity"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}

export function showAlert(message, type = 'info') {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const close = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  root.render(<AlertComponent message={message} type={type} onClose={close} />);
  setTimeout(close, 4000);
}
