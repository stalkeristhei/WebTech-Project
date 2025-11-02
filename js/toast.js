// Lightweight toast utility
// Usage: import { showToast } from './js/toast.js'

const TOAST_CONTAINER_ID = 'witty-toasts-container';

function ensureContainer() {
  let c = document.getElementById(TOAST_CONTAINER_ID);
  if (c) return c;
  c = document.createElement('div');
  c.id = TOAST_CONTAINER_ID;
  c.style.position = 'fixed';
  c.style.top = '1rem';
  c.style.right = '1rem';
  c.style.zIndex = 99999;
  c.style.display = 'flex';
  c.style.flexDirection = 'column';
  c.style.gap = '0.5rem';
  document.body.appendChild(c);
  // minimal styles for toasts
  const style = document.createElement('style');
  style.textContent = `
    .witty-toast{ min-width:220px; max-width:360px; padding:12px 16px; border-radius:10px; color:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.12); font-weight:600; font-family:Inter,system-ui,Segoe UI,Roboto,Arial; }
    .witty-toast.info{ background: linear-gradient(90deg,#4b6cb7,#182848); }
    .witty-toast.success{ background: linear-gradient(90deg,#11998e,#38ef7d); }
    .witty-toast.error{ background: linear-gradient(90deg,#e53935,#b71c1c); }
    .witty-toast .witty-close{ margin-left:8px; opacity:0.85; cursor:pointer; font-weight:700; }
  `;
  document.head.appendChild(style);
  return c;
}

export function showToast(message, type = 'info', timeout = 4000) {
  try {
    const container = ensureContainer();
    const t = document.createElement('div');
    t.className = `witty-toast ${type}`;
    t.setAttribute('role','status');
    t.innerHTML = `<span>${message}</span><span class="witty-close">✕</span>`;
    const closeBtn = t.querySelector('.witty-close');
    closeBtn.addEventListener('click', () => {
      t.remove();
    });
    container.appendChild(t);
    if (timeout > 0) {
      setTimeout(() => {
        if (t.parentNode) t.remove();
      }, timeout);
    }
    return t;
  } catch (err) {
    // Fallback to alert if something goes wrong
    try { alert(message); } catch (_) {}
  }
}

export default showToast;

// showConfirm returns a Promise<boolean> and shows a small modal-like confirm using the same styling system.
export function showConfirm(message, confirmText = 'Yes', cancelText = 'Cancel') {
  return new Promise((resolve) => {
    const container = ensureContainer();
    const modal = document.createElement('div');
    modal.className = 'witty-toast info';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.gap = '8px';
    modal.innerHTML = `<div style="font-weight:700">${message}</div>`;

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'flex-end';
    btnRow.style.gap = '8px';

    const cancel = document.createElement('button');
    cancel.textContent = cancelText;
    cancel.style.background = 'transparent';
    cancel.style.border = '1px solid rgba(255,255,255,0.18)';
    cancel.style.color = '#fff';
    cancel.style.padding = '6px 10px';
    cancel.style.borderRadius = '8px';
    cancel.style.cursor = 'pointer';

    const confirm = document.createElement('button');
    confirm.textContent = confirmText;
    confirm.style.background = 'rgba(0,0,0,0.08)';
    confirm.style.border = 'none';
    confirm.style.color = '#fff';
    confirm.style.padding = '6px 10px';
    confirm.style.borderRadius = '8px';
    confirm.style.cursor = 'pointer';

    btnRow.appendChild(cancel);
    btnRow.appendChild(confirm);
    modal.appendChild(btnRow);

    container.appendChild(modal);

    const cleanup = () => { if (modal.parentNode) modal.remove(); };

    cancel.addEventListener('click', () => { cleanup(); resolve(false); });
    confirm.addEventListener('click', () => { cleanup(); resolve(true); });
  });
}
