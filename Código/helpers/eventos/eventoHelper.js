const { Evento } = require('../../models');

//Função não exportada
function stringParaFloat(valor) {
  if (typeof valor === 'string') {
    return parseFloat(
      valor.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
    );
  }
  return parseFloat(valor);
}

//Função não exportada
function floatParaString(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return '';
  return parseFloat(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function stringParaInteger(valor) {
  if (valor == '') return '';
  if (typeof valor === 'string') {
    valor = valor.trim();
  }
  const parsed = parseInt(valor, 10);

  return parsed;
}

//Função não exportada
function integerParaString(valor) {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return '';
  }
  return String(valor);
}

//Função exportada
function criarEventoFormatado(evento) {
  evento.valorIngressoInteira = floatParaString(evento.valorIngressoInteira);

  evento.valorIngressoMeiaEntrada = floatParaString(evento.valorIngressoMeiaEntrada);

  evento.qtdIngressosParaVendaDisponibilizados = integerParaString(
    evento.qtdIngressosParaVendaDisponibilizados
  );

  evento.qtdIngressosGratuitosDisponibilizados = integerParaString(
    evento.qtdIngressosGratuitosDisponibilizados
  );

  evento.qtdIngressosParaVendaDisponiveis = integerParaString(
    evento.qtdIngressosParaVendaDisponiveis
  );

  evento.qtdIngressosGratuitosDisponiveis = integerParaString(
    evento.qtdIngressosGratuitosDisponiveis
  );

  evento.qtdIngressosVendidos = integerParaString(evento.qtdIngressosVendidos);

  evento.qtdIngressosDoados = integerParaString(evento.qtdIngressosDoados);
  return evento;
}

function criar(
  titulo = '',
  objetivo = '',
  valorIngressoInteira = '',
  qtdIngressosParaVendaDisponibilizados = '',
  qtdIngressosGratuitosDisponibilizados = '',
  informacoesComplementares = ''
) {
  return {
    titulo,
    objetivo,
    valorIngressoInteira,
    qtdIngressosParaVendaDisponibilizados,
    qtdIngressosGratuitosDisponibilizados,
    informacoesComplementares,
  };
}

async function salvar(evento) {
  const errors = [];

  try {
    const novoEvento = await Evento.create({
      titulo: evento.titulo,
      objetivo: evento.objetivo,
      valorIngressoInteira: stringParaFloat(evento.valorIngressoInteira),
      qtdIngressosParaVendaDisponibilizados: stringParaInteger(
        evento.qtdIngressosParaVendaDisponibilizados
      ),
      qtdIngressosGratuitosDisponibilizados: stringParaInteger(
        evento.qtdIngressosGratuitosDisponibilizados
      ),
      qtdIngressosParaVendaDisponiveis: stringParaInteger(
        evento.qtdIngressosParaVendaDisponibilizados
      ),
      qtdIngressosGratuitosDisponiveis: stringParaInteger(
        evento.qtdIngressosGratuitosDisponibilizados
      ),
      informacoesComplementares: evento.informacoesComplementares,
    });

    return novoEvento;
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
  const evento = await Evento.findOne({ where: { id: id }, raw: true });
  const eventoFormatado = criarEventoFormatado(evento);

  return eventoFormatado;
}

async function buscarEventosEmAndamento() {
  const eventos = await Evento.findAll({
    where: { status: true },
    raw: true,
  });

  const eventosFormatados = eventos.map((p) => criarEventoFormatado(p));

  return eventosFormatados;
}

async function buscarEventosEncerrados() {
  const eventos = await Evento.findAll({
    where: { status: false },
    raw: true,
  });

  const eventosFormatados = eventos.map((e) => criarEventoFormatado(e));

  return eventosFormatados;
}

async function atualizar(evento, id) {
  const errors = [];

  try {
    const eventoParaAtualizacao = await Evento.findByPk(id);
    if (!eventoParaAtualizacao) {
      errors.push('Evento não encontrado.');
      return errors;
    }

    eventoParaAtualizacao.titulo = evento.titulo;
    eventoParaAtualizacao.objetivo = evento.objetivo;
    eventoParaAtualizacao.valorIngressoInteira = stringParaFloat(evento.valorIngressoInteira);

    eventoParaAtualizacao.informacoesComplementares = evento.informacoesComplementares;

    const eventoAtualizado = await eventoParaAtualizacao.save();
    return criarEventoFormatado(eventoAtualizado.get({ plain: true }));
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
    const eventoParaEncerramento = await Evento.findByPk(id);
    if (!eventoParaEncerramento) {
      errors.push('Evento não encontrado.');
      return errors;
    }

    eventoParaEncerramento.status = false;

    await eventoParaEncerramento.save();
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

async function atualizarValoresIngressosParaVenda(eventoId, operacao, valor) {
  const errors = [];

  try {
    const eventoParaAtualizacao = await Evento.findByPk(eventoId);
    if (!eventoParaAtualizacao) {
      errors.push('Evento não encontrado.');
      return errors;
    }

    switch (operacao) {
      case 'venda':
        eventoParaAtualizacao.qtdIngressosVendidos += valor;
        eventoParaAtualizacao.qtdIngressosParaVendaDisponiveis -= valor;
        break;

      case 'devolucao':
        eventoParaAtualizacao.qtdIngressosVendidos -= valor;
        eventoParaAtualizacao.qtdIngressosParaVendaDisponiveis += valor;
        break;
    }

    const eventoAtualizado = await eventoParaAtualizacao.save();
    return eventoAtualizado.get({ plain: true });
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

async function atualizarValoresIngressosGratuitos(eventoId, operacao, valor) {
  const errors = [];

  try {
    const eventoParaAtualizacao = await Evento.findByPk(eventoId);
    if (!eventoParaAtualizacao) {
      errors.push('Evento não encontrado.');
      return errors;
    }

    switch (operacao) {
      case 'doacao':
        eventoParaAtualizacao.qtdIngressosDoados += valor;
        eventoParaAtualizacao.qtdIngressosGratuitosDisponiveis -= valor;
        break;

      case 'cancelamento':
        eventoParaAtualizacao.qtdIngressosDoados -= valor;
        eventoParaAtualizacao.qtdIngressosGratuitosDisponiveis += valor;
        break;
    }

    const eventoAtualizado = await eventoParaAtualizacao.save();
    return eventoAtualizado.get({ plain: true });
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
  const eventoRemovida = await buscarPorId(id);
  await Evento.destroy({ where: { id: id } });
  return eventoRemovida;
}

module.exports = {
  criar,
  salvar,
  buscarPorId,
  atualizar,
  remover,
  buscarEventosEmAndamento,
  encerrar,
  atualizarValoresIngressosParaVenda,
  atualizarValoresIngressosGratuitos,
  buscarEventosEncerrados,
  stringParaInteger,
  criarEventoFormatado,
};
