/* ============================================================
   Toast — tiny queue, auto-dismiss, accessible.
   ============================================================ */
(function (global) {
  'use strict';
  const root = () => document.getElementById('toast-root');

  function show(message, kind = 'default', ttl = 3200) {
    const el = document.createElement('div');
    el.className = 'toast' + (kind === 'success' ? ' toast--success' : kind === 'error' ? ' toast--error' : '');
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.textContent = message;
    root().appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 200ms ease, transform 200ms ease';
      setTimeout(() => el.remove(), 220);
    }, ttl);
  }

  global.Toast = { show };
})(window);