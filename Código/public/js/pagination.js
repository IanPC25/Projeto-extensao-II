function setupPagination(tableContainerId, paginationId, rowsPerPage = 10) {
  const tableContainer = document.getElementById(tableContainerId);
  const pagination = document.getElementById(paginationId);
  const rows = tableContainer.getElementsByClassName('row');
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  let currentPage = 1;

  function showPage(page) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.display = i >= (page - 1) * rowsPerPage && i < page * rowsPerPage ? '' : 'none';
    }

    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const link = document.createElement('a');
      link.innerText = i;
      link.href = '#';
      link.style.margin = '0 5px';
      link.style.textDecoration = i === page ? 'underline' : 'none';
      link.style.fontSize = '25px';
      link.onclick = (e) => {
        e.preventDefault();
        currentPage = i;
        showPage(i);
      };
      pagination.appendChild(link);
    }
  }

  showPage(currentPage);
}

setupPagination('table_ticket_sales', 'pagination_ticket_sales');
setupPagination('table_free_event', 'pagination_free_event');
setupPagination('table_sponsorship', 'pagination_sponsorship');
setupPagination('table_billing', 'pagination_billing');
setupPagination('table_responsible', 'pagination_responsible');
setupPagination('tabelaReponsaveisDaReserva', 'paginacaoReponsaveisDaReserva');
