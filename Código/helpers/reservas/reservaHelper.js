const { Reserva } = require('../../models');

//Função não exportada
function stringParaFloat(valor) {
  if (typeof valor === 'string') {
    return parseFloat(
      valor.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
    );
  }
  return parseFloat(valor);
}

function floatParaString(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return '';
  return parseFloat(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function criarReservaFormatada(reserva) {
  reserva.valorDaReserva = floatParaString(reserva.valorDaReserva);
  reserva.valorQuitadoDaReserva = floatParaString(reserva.valorQuitadoDaReserva);
  reserva.valorPendenteDaReserva = floatParaString(reserva.valorPendenteDaReserva);

  return reserva;
}

function criar(
  titulo = '',
  objetivo = '',
  valorDaReserva = '0,00',
  informacoesComplementares = ''
) {
  return {
    titulo,
    objetivo,
    valorDaReserva,
    informacoesComplementares,
  };
}

async function salvar(reserva) {
  const errors = [];

  try {
    const novaReserva = await Reserva.create({
      titulo: reserva.titulo,
      objetivo: reserva.objetivo,
      valorDaReserva: stringParaFloat(reserva.valorDaReserva),
      informacoesComplementares: reserva.informacoesComplementares,
      valorPendenteDaReserva: stringParaFloat(reserva.valorDaReserva),
    });

    return novaReserva;
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
  const reserva = await Reserva.findOne({ where: { id: id }, raw: true });
  const reservaFormatada = criarReservaFormatada(reserva);

  return reservaFormatada;
}

async function buscarReservasEmAndamento() {
  const reservas = await Reserva.findAll({
    where: { status: true },
    raw: true,
  });

  const reservasFormatadas = reservas.map((p) => criarReservaFormatada(p));

  return reservasFormatadas;
}

async function buscarReservasEncerradas() {
  const reservas = await Reserva.findAll({
    where: { status: false },
    raw: true,
  });

  const reservasFormatadas = reservas.map((p) => criarReservaFormatada(p));

  return reservasFormatadas;
}

async function atualizar(reserva, id) {
  const errors = [];

  try {
    const reservaParaAtualizacao = await Reserva.findByPk(id);
    if (!reservaParaAtualizacao) {
      errors.push('Reserva não encontrada.');
      return errors;
    }

    reservaParaAtualizacao.titulo = reserva.titulo;
    reservaParaAtualizacao.objetivo = reserva.objetivo;
    reservaParaAtualizacao.valorDaReserva = stringParaFloat(reserva.valorDaReserva);
    reservaParaAtualizacao.informacoesComplementares = reserva.informacoesComplementares;

    const reservaAtualizada = await reservaParaAtualizacao.save();
    return criarReservaFormatada(reservaAtualizada.get({ plain: true }));
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

async function encerrar(id) {
  const errors = [];

  try {
    const reservaParaEncerramento = await Reserva.findByPk(id);
    if (!reservaParaEncerramento) {
      errors.push('Reserva não encontrada.');
      return errors;
    }

    reservaParaEncerramento.status = false;

    await reservaParaEncerramento.save();
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

async function atualizarValoresDaReserva(reservaId, operacao, valor) {
  const errors = [];

  try {
    const reservaParaAtualizacao = await Reserva.findByPk(reservaId);
    if (!reservaParaAtualizacao) {
      errors.push('Reserva não encontrada.');
      return errors;
    }

    switch (operacao) {
      case 'soma':
        reservaParaAtualizacao.valorQuitadoDaReserva += valor;
        break;

      case 'desconto':
        reservaParaAtualizacao.valorQuitadoDaReserva -= valor;
        break;
    }

    reservaParaAtualizacao.valorPendenteDaReserva =
      reservaParaAtualizacao.valorDaReserva - reservaParaAtualizacao.valorQuitadoDaReserva;

    const reservaAtualizada = await reservaParaAtualizacao.save();
    return reservaAtualizada.get({ plain: true });
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

async function remover(id) {
  const reservaRemovida = await buscarPorId(id);
  await Reserva.destroy({ where: { id: id } });
  return reservaRemovida;
}

module.exports = {
  criar,
  salvar,
  buscarPorId,
  atualizar,
  remover,
  buscarReservasEmAndamento,
  encerrar,
  atualizarValoresDaReserva,
  buscarReservasEncerradas,
  floatParaString,
};
