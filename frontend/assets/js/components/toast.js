const Toast = (() => {
  let container = null;

  const ICONS = {
    success: '✓',
    error:   '✕',
    warning: '⚠',
  };

  function _init() {
    if (container) return;
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  function _remove(el) {
    el.classList.add('removing');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  function show(message, type = 'success', duration = 3500) {
    _init();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${ICONS[type] || ICONS.success}</span>
      <span class="toast__message">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => _remove(toast), duration);
  }

  function success(message) { show(message, 'success'); }
  function error(message)   { show(message, 'error', 4500); }
  function warning(message) { show(message, 'warning', 4000); }

  return { show, success, error, warning };
})();