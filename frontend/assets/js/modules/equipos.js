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
          <button class="btn-icon-edit" onclick="EquiposModule.openEdit(${row.id})" title="Editar">✏️</button>
          <button class="btn-icon-danger" onclick="EquiposModule.remove(${row.id}, '${row.nombre_pais}')" title="Eliminar">🗑️</button>
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
    document.getElementById('modal-title').textContent = '➕ Nuevo Equipo';
    Modal.open('equipo-modal');
  }

  function openEdit(id) {
    const equipo = equipos.find(e => e.id === id);
    if (!equipo) return;
    editingId = id;

    document.getElementById('modal-title').textContent = '✏️ Editar Equipo';
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
      rankingFifa:       parseInt(document.getElementById('field-rankingFifa').value, 10),
      cantidadJugadores: parseInt(document.getElementById('field-cantidadJugadores').value, 10),
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
      { id: 'field-rankingFifa',       errorId: 'error-rankingFifa',       check: v => parseInt(v) > 0, msg: 'Debe ser un número mayor a 0' },
      { id: 'field-cantidadJugadores', errorId: 'error-cantidadJugadores', check: v => parseInt(v) >= 23 && parseInt(v) <= 26, msg: 'Debe estar entre 23 y 26' },
    ];

    fields.forEach(({ id, errorId, check, msg }) => {
      const input = document.getElementById(id);
      const error = document.getElementById(errorId);
      if (!check(input.value)) {
        input.classList.add('error');
        if (error) { error.textContent = msg; error.classList.add('visible'); }
        valid = false;
      } else {
        input.classList.remove('error');
        if (error) error.classList.remove('visible');
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