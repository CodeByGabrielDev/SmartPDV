import { useState, useEffect } from 'react';

export function Alert({ message, type = 'error', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    error: '⚠️',
    success: '✅',
    warning: '⚡',
    info: 'ℹ️'
  };

  const colors = {
    error: '#dc2626',
    success: '#16a34a',
    warning: '#ca8a04',
    info: '#2563eb'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#fff',
      borderLeft: `4px solid ${colors[type]}`,
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      padding: '16px 20px',
      maxWidth: '400px',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>{icons[type]}</span>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: type === 'error' ? '600' : '500',
            color: '#1f2937',
            fontSize: '14px'
          }}>
            {type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : type === 'warning' ? 'Atenção' : 'Info'}
          </div>
          <div style={{ color: '#4b5563', fontSize: '14px', marginTop: '4px' }}>
            {message}
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '4px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function showAlert(message, type = 'error', duration = 5000) {
  const container = document.getElementById('alert-container') || createAlertContainer();
  const alertId = Date.now();
  const alertDiv = document.createElement('div');
  alertDiv.id = `alert-${alertId}`;
  container.appendChild(alertDiv);

  const render = (msg) => {
    alertDiv.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fff;
      border-left: 4px solid ${type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : type === 'warning' ? '#ca8a04' : '#2563eb'};
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 16px 20px;
      max-width: 400px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    const icon = type === 'error' ? '⚠️' : type === 'success' ? '✅' : type === 'warning' ? '⚡' : 'ℹ️';
    const title = type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : type === 'warning' ? 'Atenção' : 'Info';
    
    wrapper.innerHTML = `
      <style>@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }</style>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">${icon}</span>
        <div style="flex: 1;">
          <div style="font-weight: ${type === 'error' ? '600' : '500'}; color: #1f2937; font-size: 14px;">${title}</div>
          <div style="color: #4b5563; font-size: 14px; margin-top: 4px;">${msg}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280; padding: 4px;">×</button>
      </div>
    `;
    alertDiv.appendChild(wrapper);
  };

  render(message);

  if (duration > 0) {
    setTimeout(() => alertDiv.remove(), duration);
  }
}

function createAlertContainer() {
  const container = document.createElement('div');
  container.id = 'alert-container';
  document.body.appendChild(container);
  return container;
}