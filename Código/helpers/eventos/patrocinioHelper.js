const { Patrocinio } = require('../../models');

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

//Função não exportada
function criarPatrocinioFormatado(patrocinio) {
  patrocinio.valorPatrocinio = floatParaString(patrocinio.valorPatrocinio);

  return patrocinio;
}

function criar(
  tipoPatrocinio = '',
  entidadePatrocinadora = '',
  valorPatrocinio = '',
  dataPagamento = '',
  formaPagamento = '',
  responsavelPeloPatrocinio = '',
  telefonePatrocinador = '',
  celularPatrocinador = '',
  eventoId = ''
) {
  return {
    tipoPatrocinio,
    entidadePatrocinadora,
    valorPatrocinio,
    dataPagamento,
    formaPagamento,
    responsavelPeloPatrocinio,
    telefonePatrocinador,
    celularPatrocinador,
    eventoId,
  };
}

async function salvar(patrocinio) {
  const errors = [];

  try {
    const novoPatrocinio = await Patrocinio.create({
      tipoPatrocinio: patrocinio.tipoPatrocinio,
      entidadePatrocinadora: patrocinio.entidadePatrocinadora,
      valorPatrocinio: stringParaFloat(patrocinio.valorPatrocinio),
      dataPagamento: patrocinio.dataPagamento,
      formaPagamento: patrocinio.formaPagamento,
      responsavelPeloPatrocinio: patrocinio.responsavelPeloPatrocinio,
      telefonePatrocinador: patrocinio.telefonePatrocinador,
      celularPatrocinador: patrocinio.celularPatrocinador,
      eventoId: patrocinio.eventoId,
    });

    return novoPatrocinio;
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
  const patrocinio = await Patrocinio.findOne({ where: { id: id }, raw: true });
  const patrocinioFormatado = criarPatrocinioFormatado(patrocinio);

  return patrocinioFormatado;
}

async function remover(id) {
  const patrocinioRemovido = await buscarPorId(id);
  await Patrocinio.destroy({ where: { id: id } });
  return patrocinioRemovido;
}

async function buscarPatrociniosDoEvento(eventoId) {
  const patrocinios = await Patrocinio.findAll({
    where: { eventoId },
    order: [['dataPagamento', 'ASC']],
    raw: true,
  });
  const patrociniosFormatados = patrocinios.map((p) => criarPatrocinioFormatado(p));
  return patrociniosFormatados;
}

async function faturamentoTotalComPatrocinios(eventoId) {
  const patrocinios = await Patrocinio.findAll({
    where: { eventoId },
    raw: true,
  });

  const faturamento = {
    quantidadePrivado: 0,
    patrocinioPrivado: 0,
    quantidadePublico: 0,
    patrocinioPublico: 0,
    quantidadeTotal: 0,
    totalPatrocinios: 0,
  };

  for (const pat of patrocinios) {
    if (pat.tipoPatrocinio === 'Privado') {
      faturamento.quantidadePrivado++;
      faturamento.patrocinioPrivado += parseFloat(pat.valorPatrocinio);
    } else if (pat.tipoPatrocinio === 'Publico') {
      faturamento.quantidadePublico++;
      faturamento.patrocinioPublico += parseFloat(pat.valorPatrocinio);
    }
  }

  faturamento.quantidadeTotal = faturamento.quantidadePrivado + faturamento.quantidadePublico;
  faturamento.totalPatrocinios = faturamento.patrocinioPrivado + faturamento.patrocinioPublico;

  faturamento.patrocinioPrivado = floatParaString(faturamento.patrocinioPrivado);
  faturamento.patrocinioPublico = floatParaString(faturamento.patrocinioPublico);
  faturamento.totalPatrocinios = floatParaString(faturamento.totalPatrocinios);

  return faturamento;
}

module.exports = {
  criar,
  salvar,
  buscarPorId,
  remover,
  buscarPatrociniosDoEvento,
  faturamentoTotalComPatrocinios,
};
