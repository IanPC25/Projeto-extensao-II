const { DoacaoIngresso } = require('../../models');

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

//Função não exportada
function criarDoacaoIngressoFormatado(doacaoIngresso) {
  doacaoIngresso.qtdIngressosDoados = integerParaString(doacaoIngresso.qtdIngressosDoados);

  return doacaoIngresso;
}

function criar(
  dataDoacao = null,
  nomeLocalContemplado = '',
  responsavelPelaDistribuicao = '',
  telefoneResponsavelPelaDistribuicao = '',
  celularResponsavelPelaDistribuicao = '',
  qtdIngressosDoados = '',
  eventoId = ''
) {
  return {
    dataDoacao,
    nomeLocalContemplado,
    responsavelPelaDistribuicao,
    telefoneResponsavelPelaDistribuicao,
    celularResponsavelPelaDistribuicao,
    qtdIngressosDoados,
    eventoId,
  };
}

async function salvar(doacaoIngresso) {
  const errors = [];

  try {
    const novaDoacaoIngresso = await DoacaoIngresso.create({
      dataDoacao: doacaoIngresso.dataDoacao,
      nomeLocalContemplado: doacaoIngresso.nomeLocalContemplado,
      responsavelPelaDistribuicao: doacaoIngresso.responsavelPelaDistribuicao,
      telefoneResponsavelPelaDistribuicao: doacaoIngresso.telefoneResponsavelPelaDistribuicao,
      celularResponsavelPelaDistribuicao: doacaoIngresso.celularResponsavelPelaDistribuicao,
      qtdIngressosDoados: stringParaInteger(doacaoIngresso.qtdIngressosDoados),
      eventoId: doacaoIngresso.eventoId,
    });

    return novaDoacaoIngresso;
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
  const doacaoIngresso = await DoacaoIngresso.findOne({ where: { id: id }, raw: true });
  const doacaoIngressoFormatado = criarDoacaoIngressoFormatado(doacaoIngresso);

  return doacaoIngressoFormatado;
}

async function remover(id) {
  const doacaoIngressoRemovido = await buscarPorId(id);
  await DoacaoIngresso.destroy({ where: { id: id } });
  return doacaoIngressoRemovido;
}

async function buscarDoacoesIngressosDoEvento(eventoId) {
  const doacaoIngressos = await DoacaoIngresso.findAll({
    where: { eventoId },
    order: [['dataDoacao', 'ASC']],
    raw: true,
  });
  const doacaoIngressosFormatados = doacaoIngressos.map((p) => criarDoacaoIngressoFormatado(p));
  return doacaoIngressosFormatados;
}

module.exports = {
  criar,
  salvar,
  buscarPorId,
  remover,
  buscarDoacoesIngressosDoEvento,
  stringParaInteger,
};
