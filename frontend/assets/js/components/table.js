const Table = (() => {
  function render({ containerId, columns, data, emptyMessage = 'No hay registros' }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">📭</div>
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