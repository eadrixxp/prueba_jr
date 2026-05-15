const EquiposModule = (() => {
  let equipos = [];
  let editingId = null;

  const COLUMNS = [
    { label: 'País', key: 'nombre_pais', render: row => `<strong>${row.nombre_pais}</strong>` },
    { label: 'Código FIFA', key: 'codigo_fifa', render: row => `<span class="code-badge">${row.codigo_fifa}</span>` },
    { label: 'Director Técnico', key: 'director_tecnico' },
    { label: 'Ranking FIFA', key: 'ranking_fifa', render: row => `<span class="badge badge--blue">#${row.ranking_fifa}</span>` },
    { label: 'Jugadores', key: 'cantidad_jugadores' },
    { label: 'Estado', key: 'estado', render: row => row.estado
      ? '<span class="badge badge--success">Activo</span>'
      : '<span class="badge badge--danger">Inactivo</span>'
    },
    {
      label: 'Acciones',
      render: row => `
        <div class="td-actions">
          <button class="btn-icon-edit" onclick="EquiposModule.openEdit(${row.id})" title="Editar">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon-danger" onclick="EquiposModule.remove(${row.id}, '${row.nombre_pais}')" title="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      `,
    },
  ];

  async function load() {
    Spinner.show();
    try {
      const res = await client.get('/equipos');
      equipos = res.data;
      _render();
      _updateCounter();
    } catch (err) {
      Toast.error(err.message || 'Error al cargar los equipos');
    } finally {
      Spinner.hide();
    }
  }

  function _render() {
    Table.render({
      containerId: 'equipos-table',
      columns: COLUMNS,
      data: equipos,
      emptyMessage: 'No hay equipos registrados. Agrega uno con el botón de arriba.',
    });
  }

  function _updateCounter() {
    const el = document.getElementById('equipos-count');
    if (el) el.textContent = equipos.length;
  }

  function openCreate() {
    editingId = null;
    _resetForm();
    document.getElementById('modal-title').textContent = 'Nuevo Equipo';
    Modal.open('equipo-modal');
  }

  function openEdit(id) {
    const equipo = equipos.find(e => e.id === id);
    if (!equipo) return;
    editingId = id;

    document.getElementById('modal-title').textContent = 'Editar Equipo';
    document.getElementById('field-nombrePais').value        = equipo.nombre_pais;
    document.getElementById('field-codigoFifa').value        = equipo.codigo_fifa;
    document.getElementById('field-directorTecnico').value   = equipo.director_tecnico;
    document.getElementById('field-rankingFifa').value       = equipo.ranking_fifa;
    document.getElementById('field-cantidadJugadores').value = equipo.cantidad_jugadores;

    Modal.open('equipo-modal');
  }

  function remove(id, nombre) {
    Modal.confirm({
      title: 'Eliminar equipo',
      message: `¿Estás seguro de que deseas eliminar a <strong>${nombre}</strong>? Esta acción no se puede deshacer.`,
      onConfirm: () => _doDelete(id),
    });
  }

  async function _doDelete(id) {
    Spinner.show();
    try {
      await client.delete(`/equipos/${id}`);
      Toast.success('Equipo eliminado correctamente');
      await load();
    } catch (err) {
      Toast.error(err.message || 'Error al eliminar el equipo');
    } finally {
      Spinner.hide();
    }
  }

  async function _handleSubmit(e) {
    e.preventDefault();
    if (!_validateForm()) return;

    const payload = {
      nombrePais:        document.getElementById('field-nombrePais').value.trim(),
      codigoFifa:        document.getElementById('field-codigoFifa').value.trim().toUpperCase(),
      directorTecnico:   document.getElementById('field-directorTecnico').value.trim(),
      rankingFifa:       Number.parseInt(document.getElementById('field-rankingFifa').value, 10),
      cantidadJugadores: Number.parseInt(document.getElementById('field-cantidadJugadores').value, 10),
    };

    Spinner.show();
    try {
      if (editingId) {
        await client.put(`/equipos/${editingId}`, payload);
        Toast.success('Equipo actualizado correctamente');
      } else {
        await client.post('/equipos', payload);
        Toast.success('Equipo creado correctamente');
      }
      Modal.close('equipo-modal');
      await load();
    } catch (err) {
      if (err.errors) {
        err.errors.forEach(e => Toast.error(e.message));
      } else {
        Toast.error(err.message || 'Error al guardar el equipo');
      }
    } finally {
      Spinner.hide();
    }
  }

  function _validateForm() {
    let valid = true;

    const fields = [
      { id: 'field-nombrePais',        errorId: 'error-nombrePais',        check: v => v.trim() !== '', msg: 'El nombre del país es requerido' },
      { id: 'field-codigoFifa',        errorId: 'error-codigoFifa',        check: v => /^[A-Za-z]{3}$/.test(v.trim()), msg: 'Debe tener exactamente 3 letras' },
      { id: 'field-directorTecnico',   errorId: 'error-directorTecnico',   check: v => v.trim() !== '', msg: 'El director técnico es requerido' },
      { id: 'field-rankingFifa',       errorId: 'error-rankingFifa',       check: v => Number.parseInt(v, 10) > 0, msg: 'Debe ser un número mayor a 0' },
      { id: 'field-cantidadJugadores', errorId: 'error-cantidadJugadores', check: v => Number.parseInt(v, 10) >= 23 && Number.parseInt(v, 10) <= 26, msg: 'Debe estar entre 23 y 26' },
    ];

    fields.forEach(({ id, errorId, check, msg }) => {
      const input = document.getElementById(id);
      const error = document.getElementById(errorId);
      if (check(input.value)) {
        input.classList.remove('error');
        if (error) error.classList.remove('visible');
      } else {
        input.classList.add('error');
        if (error) { error.textContent = msg; error.classList.add('visible'); }
        valid = false;
      }
    });

    return valid;
  }

  function _resetForm() {
    const form = document.getElementById('equipo-form');
    if (form) form.reset();
    document.querySelectorAll('#equipo-modal .form-control').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('#equipo-modal .form-error').forEach(el => el.classList.remove('visible'));
  }

  function init() {
    load();

    document.getElementById('btn-nuevo-equipo')?.addEventListener('click', openCreate);
    document.getElementById('equipo-form')?.addEventListener('submit', _handleSubmit);

    document.querySelectorAll('#equipo-modal .form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = document.getElementById(`error-${input.id.replace('field-', '')}`);
        if (errorEl) errorEl.classList.remove('visible');
      });
    });
  }

  return { init, load, openEdit, remove };
})();