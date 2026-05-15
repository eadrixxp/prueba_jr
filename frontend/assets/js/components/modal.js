const Modal = (() => {
  let overlay = null;

  function _getOverlay() {
    return document.getElementById('modal-overlay');
  }

  function open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    document.body.style.overflow = '';
  }

  function closeAll() {
    document.querySelectorAll('.modal-overlay.open').forEach(el => {
      el.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  function confirm({ title, message, onConfirm, confirmText = 'Eliminar', cancelText = 'Cancelar' }) {
    const existingId = 'confirm-modal';
    let existing = document.getElementById(existingId);
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = existingId;
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <div class="confirm-dialog__icon">🗑️</div>
        <div class="confirm-dialog__title">${title}</div>
        <div class="confirm-dialog__message">${message}</div>
        <div class="confirm-dialog__actions">
          <button class="btn btn--outline" id="confirm-cancel">${cancelText}</button>
          <button class="btn btn--danger" id="confirm-ok">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    document.getElementById('confirm-cancel').addEventListener('click', () => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 200);
    });

    document.getElementById('confirm-ok').addEventListener('click', () => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 200);
      onConfirm();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        setTimeout(() => overlay.remove(), 200);
      }
    });
  }

  function bindCloseButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal__close') || e.target.closest('.modal__close')) {
        const overlay = e.target.closest('.modal-overlay');
        if (overlay) {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
      if (e.target.matches('.modal-overlay')) {
        e.target.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  bindCloseButtons();

  return { open, close, closeAll, confirm };
})();