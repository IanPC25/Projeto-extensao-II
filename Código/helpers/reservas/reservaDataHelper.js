const responsavelHelper = require('../../helpers/reservas/responsavelHelper');
const pagamentoHelper = require('../../helpers/reservas/pagamentoHelper');
const periodoHelper = require('../../helpers/periodos/periodoHelper');

async function buscarDadosRelacionadosDaReserva(reservaId) {
  const [responsaveis, pagamentos, periodos] = await Promise.all([
    responsavelHelper.buscarResponsaveisPelaReserva(reservaId),
    pagamentoHelper.buscarPagamentosDaReserva(reservaId),
    periodoHelper.buscarPeriodosDaReserva(reservaId),
  ]);

  return { responsaveis, pagamentos, periodos };
}

module.exports = { buscarDadosRelacionadosDaReserva };
