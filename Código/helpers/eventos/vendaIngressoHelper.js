const { VendaIngresso } = require('../../models');

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

//Função não exportada
function criarVendaIngressoFormatado(vendaIngresso) {
  vendaIngresso.qtdIngressosVendidos = integerParaString(vendaIngresso.qtdIngressosVendidos);
  vendaIngresso.ValorDoIngressoNaVenda = floatParaString(vendaIngresso.ValorDoIngressoNaVenda);
  vendaIngresso.valorTotalDaVenda = floatParaString(vendaIngresso.valorTotalDaVenda);

  return vendaIngresso;
}

function criar(
  tipoIngresso = '',
  nomeCliente = '',
  qtdIngressosVendidos = '',
  dataVenda = '',
  formaPagamento = '',
  eventoId = '',
  ValorDoIngressoNaVenda = '',
  valorTotalDaVenda = ''
) {
  return {
    tipoIngresso,
    nomeCliente,
    qtdIngressosVendidos,
    dataVenda,
    formaPagamento,
    eventoId,
    ValorDoIngressoNaVenda,
    valorTotalDaVenda,
  };
}

async function salvar(vendaIngresso) {
  const errors = [];

  try {
    const novaVendaIngresso = await VendaIngresso.create({
      tipoIngresso: vendaIngresso.tipoIngresso,
      nomeCliente: vendaIngresso.nomeCliente,
      qtdIngressosVendidos: stringParaInteger(vendaIngresso.qtdIngressosVendidos),
      dataVenda: vendaIngresso.dataVenda,
      formaPagamento: vendaIngresso.formaPagamento,
      eventoId: vendaIngresso.eventoId,
      ValorDoIngressoNaVenda: stringParaFloat(vendaIngresso.ValorDoIngressoNaVenda),
      valorTotalDaVenda:
        stringParaFloat(vendaIngresso.ValorDoIngressoNaVenda) *
        stringParaInteger(vendaIngresso.qtdIngressosVendidos),
    });

    return novaVendaIngresso;
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
  const vendaIngresso = await VendaIngresso.findOne({ where: { id: id }, raw: true });
  const vendaIngressoFormatado = criarVendaIngressoFormatado(vendaIngresso);

  return vendaIngressoFormatado;
}

async function remover(id) {
  const vendaIngressoRemovida = await buscarPorId(id);
  await VendaIngresso.destroy({ where: { id: id } });
  return vendaIngressoRemovida;
}

async function buscarVendasDeIngressosDoEvento(eventoId) {
  const vendasIngressos = await VendaIngresso.findAll({
    where: { eventoId },
    order: [['dataVenda', 'ASC']],
    raw: true,
  });
  const vendasIngressosFormatados = vendasIngressos.map((v) => criarVendaIngressoFormatado(v));
  return vendasIngressosFormatados;
}

async function faturamentoTotalComVendaDeIngressos(eventoId) {
  const vendasIngressos = await VendaIngresso.findAll({
    where: { eventoId },
    raw: true,
  });

  const valorTotalDaVenda = {
    quantidadeInteira: 0,
    faturamentoTotalComInteira: 0,
    quantidadeMeia: 0,
    faturamentoTotalComMeia: 0,
    quantidadeTotalIngressos: 0,
    faturamentoTotal: 0,
  };

  for (const venda of vendasIngressos) {
    if (venda.tipoIngresso === 'Inteira') {
      valorTotalDaVenda.quantidadeInteira += venda.qtdIngressosVendidos;
      valorTotalDaVenda.faturamentoTotalComInteira += parseFloat(venda.valorTotalDaVenda);
    } else if (venda.tipoIngresso === 'Meia') {
      valorTotalDaVenda.quantidadeMeia += venda.qtdIngressosVendidos;
      valorTotalDaVenda.faturamentoTotalComMeia += parseFloat(venda.valorTotalDaVenda);
    }
  }

  valorTotalDaVenda.quantidadeTotalIngressos =
    valorTotalDaVenda.quantidadeInteira + valorTotalDaVenda.quantidadeMeia;

  valorTotalDaVenda.faturamentoTotal =
    valorTotalDaVenda.faturamentoTotalComInteira + valorTotalDaVenda.faturamentoTotalComMeia;

  valorTotalDaVenda.faturamentoTotalComInteira = floatParaString(
    valorTotalDaVenda.faturamentoTotalComInteira
  );
  valorTotalDaVenda.faturamentoTotalComMeia = floatParaString(
    valorTotalDaVenda.faturamentoTotalComMeia
  );
  valorTotalDaVenda.faturamentoTotal = floatParaString(valorTotalDaVenda.faturamentoTotal);

  return valorTotalDaVenda;
}

module.exports = {
  criar,
  salvar,
  buscarPorId,
  remover,
  buscarVendasDeIngressosDoEvento,
  stringParaInteger,
  faturamentoTotalComVendaDeIngressos,
};
