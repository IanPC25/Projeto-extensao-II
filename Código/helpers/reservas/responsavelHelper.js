const { Responsavel } = require('../../models');

function criar(
  nome = '',
  telefone = '',
  celular = '',
  email = '',
  uf = '',
  cidade = '',
  reservaId = ''
) {
  return {
    nome,
    telefone,
    celular,
    email,
    uf,
    cidade,
    reservaId,
  };
}

async function salvar(responsavel) {
  const errors = [];

  try {
    const novoResponsavel = await Responsavel.create({
      nome: responsavel.nome,
      telefone: responsavel.telefone,
      celular: responsavel.celular,
      email: responsavel.email,
      uf: responsavel.uf,
      cidade: responsavel.cidade,
      reservaId: responsavel.reservaId,
    });

    return novoResponsavel;
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
  return await Responsavel.findOne({ where: { id: id }, raw: true });
}

async function remover(id) {
  const responsavelRemovido = await buscarPorId(id);
  await Responsavel.destroy({ where: { id: id } });
  return responsavelRemovido;
}

async function buscarResponsaveisPelaReserva(reservaId) {
  return await Responsavel.findAll({
    where: { reservaId },
    raw: true,
  });
}

module.exports = {
  criar,
  salvar,
  buscarPorId,
  remover,
  buscarResponsaveisPelaReserva,
};
