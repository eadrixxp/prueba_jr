const App = (() => {
  function _detectPage() {
    const path = globalThis.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const file = segments.at(-1) || 'index';
    return file.replace('.html', '');
  }

  function _setActiveNav() {
    const page = _detectPage();
    document.querySelectorAll('.sidebar__link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href') || '';
      if (href.includes(page) && page !== 'index') {
        link.classList.add('active');
      }
    });
  }

  function init() {
    _setActiveNav();
    const page = _detectPage();
    const PAGE_MODULES = {
      'equipos':   typeof EquiposModule   === 'undefined' ? null : EquiposModule,
      'grupos':    typeof GruposModule    === 'undefined' ? null : GruposModule,
      'formacion': typeof FormacionModule === 'undefined' ? null : FormacionModule,
    };
    const module = PAGE_MODULES[page];
    if (module && typeof module.init === 'function') {
      module.init();
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());