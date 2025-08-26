const { Periodo } = require('../../models');

function criar(
  data = null,
  horarioInicio = null,
  horarioTermino = null,
  reservaId = '',
  eventoId = ''
) {
  return { data, horarioInicio, horarioTermino, reservaId, eventoId };
}

async function salvarParaReserva(periodo) {
  const errors = [];

  try {
    const novoPeriodo = await Periodo.create({
      data: periodo.data,
      horarioInicio: periodo.horarioInicio,
      horarioTermino: periodo.horarioTermino,
      reservaId: periodo.reservaId,
    });

    return novoPeriodo;
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      errors.push(...error.errors.map((e) => e.message));
      return errors;
    }
    throw error;
  }
}

async function salvarParaEvento(periodo) {
  const errors = [];

  try {
    const novoPeriodo = await Periodo.create({
      data: periodo.data,
      horarioInicio: periodo.horarioInicio,
      horarioTermino: periodo.horarioTermino,
      eventoId: periodo.eventoId,
    });

    return novoPeriodo;
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      errors.push(...error.errors.map((e) => e.message));
      return errors;
    }
    throw error;
  }
}

async function buscarPorId(id) {
  const periodo = Periodo.findOne({ where: { id: id }, raw: true });
  return periodo;
}

async function remover(id) {
  const periodoRemovido = await buscarPorId(id);
  await Periodo.destroy({ where: { id: id } });
  return periodoRemovido;
}

async function buscarPeriodosDaReserva(reservaId) {
  const periodos = await Periodo.findAll({
    where: { reservaId },
    order: [['data', 'ASC']],
    raw: true,
  });

  return periodos;
}

async function buscarPeriodosDoEvento(eventoId) {
  const periodos = await Periodo.findAll({
    where: { eventoId },
    order: [['data', 'ASC']],
    raw: true,
  });

  return periodos;
}

module.exports = {
  criar,
  salvarParaReserva,
  salvarParaEvento,
  buscarPorId,
  remover,
  buscarPeriodosDaReserva,
  buscarPeriodosDoEvento,
};
