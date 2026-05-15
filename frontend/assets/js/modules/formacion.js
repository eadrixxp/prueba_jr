const FormacionModule = (() => {
  let asignacionesPendientes = null;

  async function _loadEquipos() {
    try {
      const res = await client.get('/equipos');
      _renderEquiposPanel(res.data);
    } catch {
      document.getElementById('equipos-panel').innerHTML =
        '<div class="empty-state"><div class="empty-state__text">Error al cargar los equipos</div></div>';
    }
  }

  async function _loadGrupos() {
    try {
      const res = await client.get('/grupos');
      _renderGruposPanel(res.data);
      _updateMaxGrupos(res.data.length);
    } catch {
      document.getElementById('grupos-panel').innerHTML =
        '<div class="empty-state"><div class="empty-state__text">Error al cargar los grupos</div></div>';
    }
  }

  function _renderEquiposPanel(equipos) {
    const container = document.getElementById('equipos-panel');

    if (!equipos.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div class="empty-state__text">No hay equipos registrados</div>
        </div>
      `;
      return;
    }

    const items = equipos.map(e => `
      <div class="preview-card__item fade-up">
        <span class="code-badge">${e.codigo_fifa}</span>
        <span>${e.nombre_pais}</span>
        <span class="badge badge--blue" style="margin-left:auto">#${e.ranking_fifa}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="preview-card__list">${items}</div>
      <div style="padding:8px 16px 12px;font-size:12px;color:var(--color-text-muted)">
        Total: <strong>${equipos.length} equipos</strong>
      </div>
    `;
  }

  function _renderGruposPanel(grupos) {
    const container = document.getElementById('grupos-panel');

    if (!grupos.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          </div>
          <div class="empty-state__text">No hay grupos registrados</div>
        </div>
      `;
      return;
    }

    const items = grupos.map(g => `
      <div class="preview-card__item fade-up">
        <strong>${g.nombre}</strong>
        <span style="color:var(--color-text-muted);font-size:12px;margin-left:auto">${g.descripcion || ''}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="preview-card__list">${items}</div>
      <div style="padding:8px 16px 12px;font-size:12px;color:var(--color-text-muted)">
        Total: <strong>${grupos.length} grupos</strong>
      </div>
    `;
  }

  function _updateMaxGrupos(total) {
    const input = document.getElementById('field-cantidadGrupos');
    if (input) {
      input.max = total;
      input.placeholder = `Máx. ${total}`;
    }
  }

  async function _handleGenerar() {
    const input   = document.getElementById('field-cantidadGrupos');
    const errorEl = document.getElementById('error-cantidadGrupos');
    const cantidad = Number.parseInt(input.value, 10);

    if (!cantidad || cantidad < 2) {
      input.classList.add('error');
      if (errorEl) { errorEl.textContent = 'Ingresa al menos 2 grupos'; errorEl.classList.add('visible'); }
      return;
    }

    input.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');

    Spinner.show();
    try {
      const res = await client.post('/formacion/preview', { cantidadGrupos: cantidad });
      asignacionesPendientes = res.data.asignaciones;
      _renderPreview(res.data.formacion);
      _showSaveBar(cantidad);
      Toast.show('Vista previa generada. Revisa la distribución y guarda cuando estés conforme.', 'warning');
    } catch (err) {
      Toast.error(err.message || 'Error al generar la vista previa');
    } finally {
      Spinner.hide();
    }
  }

  async function _handleGuardar() {
    if (!asignacionesPendientes) {
      Toast.error('Genera una vista previa antes de guardar');
      return;
    }

    Spinner.show();
    try {
      await client.post('/formacion/guardar', { asignaciones: asignacionesPendientes });
      asignacionesPendientes = null;
      Toast.success('Formación guardada correctamente');
      _hideSaveBar();
    } catch (err) {
      Toast.error(err.message || 'Error al guardar la formación');
    } finally {
      Spinner.hide();
    }
  }

  function _renderPreview(formacion) {
    const container = document.getElementById('preview-container');
    const section   = document.getElementById('preview-section');

    if (!formacion?.length) {
      container.innerHTML = '<div class="empty-state__text">No hay datos para mostrar</div>';
      return;
    }

    const cards = formacion.map((grupo, i) => {
      const equipos = grupo.equipos.map(e => `
        <div class="preview-card__item">
          <span class="code-badge">${e.codigo_fifa}</span>
          <span>${e.nombre_pais}</span>
          <span class="badge badge--gray" style="margin-left:auto">#${e.ranking_fifa}</span>
        </div>
      `).join('');

      return `
        <div class="preview-card fade-up" style="animation-delay:${i * 60}ms">
          <div class="preview-card__header">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            ${grupo.grupo}
          </div>
          <div class="preview-card__list">${equipos}</div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="preview-grid">${cards}</div>`;
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function _showSaveBar(cantidad) {
    const bar = document.getElementById('save-bar');
    if (!bar) return;
    const info = bar.querySelector('.save-bar__info');
    if (info) {
      info.innerHTML = `Vista previa con <strong>${cantidad} grupos</strong>. La distribución <strong>aún no está guardada</strong>.`;
    }
    bar.style.display = 'flex';
    const btnGuardar = document.getElementById('btn-guardar-formacion');
    if (btnGuardar) btnGuardar.disabled = false;
  }

  function _hideSaveBar() {
    const bar = document.getElementById('save-bar');
    if (!bar) return;
    const info = bar.querySelector('.save-bar__info');
    if (info) info.innerHTML = 'Formación guardada correctamente.';
    const btnGuardar = document.getElementById('btn-guardar-formacion');
    if (btnGuardar) btnGuardar.disabled = true;
  }

  async function _handleVerActual() {
    Spinner.show();
    try {
      const res = await client.get('/formacion');
      if (!res.data.length) {
        Toast.warning('No hay ninguna formación guardada todavía');
        return;
      }
      _renderPreview(res.data);
      document.getElementById('preview-section').scrollIntoView({ behavior: 'smooth' });
      const bar  = document.getElementById('save-bar');
      if (bar) bar.style.display = 'none';
    } catch (err) {
      Toast.error(err.message || 'Error al cargar la formación actual');
    } finally {
      Spinner.hide();
    }
  }

  async function init() {
    Spinner.show();
    await Promise.all([_loadEquipos(), _loadGrupos()]);
    Spinner.hide();

    document.getElementById('btn-generar')?.addEventListener('click', _handleGenerar);
    document.getElementById('btn-ver-actual')?.addEventListener('click', _handleVerActual);
    document.getElementById('btn-guardar-formacion')?.addEventListener('click', _handleGuardar);

    const input = document.getElementById('field-cantidadGrupos');
    input?.addEventListener('input', () => {
      input.classList.remove('error');
      const err = document.getElementById('error-cantidadGrupos');
      if (err) err.classList.remove('visible');
    });
  }

  return { init };
})();
