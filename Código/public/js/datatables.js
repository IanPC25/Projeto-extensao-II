$(document).ready(function () {
  $("table[data-options][data-labels]").each(function () {
    const $table = $(this);

    const lengthOptions = JSON.parse($table.attr("data-options"));
    const lengthLabels = JSON.parse($table.attr("data-labels"));

    $table.DataTable({
      lengthMenu: [lengthOptions, lengthLabels],
      pageLength: lengthOptions[0],
      language: {
        decimal: ",",
        thousands: ".",
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Nenhum registro encontrado.",
        info: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
        infoEmpty: "Nenhum registro",
        infoFiltered: "(filtrado de _MAX_ registros no total)",
        search: "Buscar:",
        paginate: {
          first: "Primeiro",
          last: "Último",
          next: "Próximo",
          previous: "Anterior",
        },
      },
    });
  });
});
