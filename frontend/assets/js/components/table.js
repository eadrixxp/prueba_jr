const Table = (() => {
  function render({ containerId, columns, data, emptyMessage = 'No hay registros' }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
          </div>
          <div class="empty-state__text">${emptyMessage}</div>
        </div>
      `;
      return;
    }

    const headers = columns.map(col => `<th>${col.label}</th>`).join('');

    const rows = data.map(row => {
      const cells = columns.map(col => {
        const value = typeof col.render === 'function'
          ? col.render(row)
          : (row[col.key] ?? '—');
        return `<td>${value}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    container.innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  return { render };
})();