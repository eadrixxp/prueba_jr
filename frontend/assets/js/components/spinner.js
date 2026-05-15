const Spinner = (() => {
  let overlay = null;

  function _init() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'spinner-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
  }

  function show() {
    _init();
    overlay.classList.add('visible');
  }

  function hide() {
    if (!overlay) return;
    overlay.classList.remove('visible');
  }

  return { show, hide };
})();