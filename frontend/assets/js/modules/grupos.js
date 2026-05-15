const GruposModule = (() => {
  let grupos = [];
  let editingId = null;

  const COLUMNS = [
    { label: 'Nombre', key: 'nombre', render: row => `<strong>${row.nombre}</strong>` },
    { label: 'Descripción', key: 'descripcion', render: row => row.descripcion || '<span style="color:var(--color-text-muted)">—</span>' },
    { label: 'Estado', key: 'estado', render: row => row.estado
      ? '<span class="badge badge--success">Activo</span>'
      : '<span class="badge badge--danger">Inactivo</span>'
    },
    {
      label: 'Acciones',
      render: row => `
        <div class="td-actions">
          <button class="btn-icon-edit" onclick="GruposModule.openEdit(${row.id})" title="Editar">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon-danger" onclick="GruposModule.remove(${row.id}, '${row.nombre}')" title="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      `,
    },
  ];

  async function load() {
    Spinner.show();
    try {
      const res = await client.get('/grupos');
      grupos = res.data;
      _render();
      _updateCounter();
    } catch (err) {
      Toast.error(err.message || 'Error al cargar los grupos');
    } finally {
      Spinner.hide();
    }
  }

  function _render() {
    Table.render({
      containerId: 'grupos-table',
      columns: COLUMNS,
      data: grupos,
      emptyMessage: 'No hay grupos registrados. Agrega uno con el botón de arriba.',
    });
  }

  function _updateCounter() {
    const el = document.getElementById('grupos-count');
    if (el) el.textContent = grupos.length;
  }

  function openCreate() {
    editingId = null;
    _resetForm();
    document.getElementById('modal-title').textContent = 'Nuevo Grupo';
    Modal.open('grupo-modal');
  }

  function openEdit(id) {
    const grupo = grupos.find(g => g.id === id);
    if (!grupo) return;
    editingId = id;

    document.getElementById('modal-title').textContent = 'Editar Grupo';
    document.getElementById('field-nombre').value      = grupo.nombre;
    document.getElementById('field-descripcion').value = grupo.descripcion || '';

    Modal.open('grupo-modal');
  }

  function remove(id, nombre) {
    Modal.confirm({
      title: 'Eliminar grupo',
      message: `¿Estás seguro de que deseas eliminar el grupo <strong>${nombre}</strong>?`,
      onConfirm: () => _doDelete(id),
    });
  }

  async function _doDelete(id) {
    Spinner.show();
    try {
      await client.delete(`/grupos/${id}`);
      Toast.success('Grupo eliminado correctamente');
      await load();
    } catch (err) {
      Toast.error(err.message || 'Error al eliminar el grupo');
    } finally {
      Spinner.hide();
    }
  }

  async function _handleSubmit(e) {
    e.preventDefault();
    if (!_validateForm()) return;

    const payload = {
      nombre:      document.getElementById('field-nombre').value.trim(),
      descripcion: document.getElementById('field-descripcion').value.trim() || undefined,
    };

    Spinner.show();
    try {
      if (editingId) {
        await client.put(`/grupos/${editingId}`, payload);
        Toast.success('Grupo actualizado correctamente');
      } else {
        await client.post('/grupos', payload);
        Toast.success('Grupo creado correctamente');
      }
      Modal.close('grupo-modal');
      await load();
    } catch (err) {
      if (err.errors) {
        err.errors.forEach(e => Toast.error(e.message));
      } else {
        Toast.error(err.message || 'Error al guardar el grupo');
      }
    } finally {
      Spinner.hide();
    }
  }

  function _validateForm() {
    let valid = true;

    const nombre  = document.getElementById('field-nombre');
    const errorEl = document.getElementById('error-nombre');

    if (!nombre.value.trim()) {
      nombre.classList.add('error');
      if (errorEl) { errorEl.textContent = 'El nombre del grupo es requerido'; errorEl.classList.add('visible'); }
      valid = false;
    } else if (nombre.value.trim().length > 10) {
      nombre.classList.add('error');
      if (errorEl) { errorEl.textContent = 'Máximo 10 caracteres'; errorEl.classList.add('visible'); }
      valid = false;
    } else {
      nombre.classList.remove('error');
      if (errorEl) errorEl.classList.remove('visible');
    }

    return valid;
  }

  function _resetForm() {
    const form = document.getElementById('grupo-form');
    if (form) form.reset();
    document.querySelectorAll('#grupo-modal .form-control').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('#grupo-modal .form-error').forEach(el => el.classList.remove('visible'));
  }

  function init() {
    load();
    document.getElementById('btn-nuevo-grupo')?.addEventListener('click', openCreate);
    document.getElementById('grupo-form')?.addEventListener('submit', _handleSubmit);

    document.querySelectorAll('#grupo-modal .form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = document.getElementById(`error-${input.id.replace('field-', '')}`);
        if (errorEl) errorEl.classList.remove('visible');
      });
    });
  }

  return { init, load, openEdit, remove };
})();