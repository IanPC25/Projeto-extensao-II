const { Pagamento } = require('../../models');

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
function criarPagamentoFormatado(pagamento) {
  pagamento.valorPago = floatParaString(pagamento.valorPago);
  return pagamento;
}

function criar(
  valorPago = '',
  dataPagamento = null,
  formaPagamento = '',
  responsavelPagamento = '',
  reservaId = ''
) {
  return { valorPago, dataPagamento, formaPagamento, responsavelPagamento, reservaId };
}

async function salvar(pagamento) {
  const errors = [];

  try {
    const novoPagamento = await Pagamento.create({
      valorPago: stringParaFloat(pagamento.valorPago),
      dataPagamento: pagamento.dataPagamento,
      formaPagamento: pagamento.formaPagamento,
      responsavelPagamento: pagamento.responsavelPagamento,
      reservaId: pagamento.reservaId,
    });

    return novoPagamento;
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
  const pagamento = Pagamento.findOne({ where: { id: id }, raw: true });
  const pagamentoFormatado = criarPagamentoFormatado(pagamento.valorPago);
  return pagamentoFormatado;
}

async function remover(id) {
  const pagamentoRemovido = await buscarPorId(id);
  await Pagamento.destroy({ where: { id: id } });
  return pagamentoRemovido;
}

async function buscarPagamentosDaReserva(reservaId) {
  const pagamentos = await Pagamento.findAll({
    where: { reservaId },
    order: [['dataPagamento', 'ASC']],
    raw: true,
  });

  const pagamentosFormatados = pagamentos.map((p) => criarPagamentoFormatado(p));
  return pagamentosFormatados;
}

module.exports = {
  criar,
  salvar,
  buscarPorId,
  remover,
  buscarPagamentosDaReserva,
  stringParaFloat,
};
