const App = (() => {
  const PAGE_MODULES = {
    'equipos': EquiposModule,
    'grupos':  GruposModule,
    'formacion': FormacionModule,
  };

  function _detectPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '');
    return file || 'index';
  }

  function _setActiveNav() {
    const page = _detectPage();
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.includes(page) && page !== 'index') {
        link.classList.add('active');
      }
    });
  }

  function init() {
    _setActiveNav();

    const page   = _detectPage();
    const module = PAGE_MODULES[page];

    if (module && typeof module.init === 'function') {
      module.init();
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());