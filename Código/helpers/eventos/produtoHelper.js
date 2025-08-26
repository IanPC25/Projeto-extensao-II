const { Produto } = require('../../models');

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
function criarProdutoFormatado(produto) {
  produto.precoVenda = floatParaString(produto.precoVenda);
  produto.qtdUnidadesVendidas = integerParaString(produto.qtdUnidadesVendidas);
  produto.valorFaturado = floatParaString(produto.valorFaturado);

  return produto;
}

function criar(
  tipoProduto = '',
  nomeProduto = '',
  precoVenda = '',
  qtdUnidadesVendidas = '',
  dataVendas = '',
  eventoId = '',
  valorFaturado = ''
) {
  return {
    tipoProduto,
    nomeProduto,
    precoVenda,
    qtdUnidadesVendidas,
    dataVendas,
    eventoId,
    valorFaturado,
  };
}

async function salvar(produto) {
  const errors = [];

  try {
    const novoProduto = await Produto.create({
      tipoProduto: produto.tipoProduto,
      nomeProduto: produto.nomeProduto,
      precoVenda: stringParaFloat(produto.precoVenda),
      qtdUnidadesVendidas: stringParaInteger(produto.qtdUnidadesVendidas),
      dataVendas: produto.dataVendas,
      valorFaturado:
        stringParaFloat(produto.precoVenda) * stringParaInteger(produto.qtdUnidadesVendidas),
      eventoId: produto.eventoId,
    });

    return novoProduto;
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
  const produto = await Produto.findOne({ where: { id: id }, raw: true });
  const produtoFormatado = criarProdutoFormatado(produto);

  return produtoFormatado;
}

async function remover(id) {
  const produtoRemovido = await buscarPorId(id);
  await Produto.destroy({ where: { id: id } });
  return produtoRemovido;
}

async function buscarProdutosVendidosDoEvento(eventoId) {
  const produtos = await Produto.findAll({
    where: { eventoId },
    order: [['dataVendas', 'ASC']],
    raw: true,
  });
  const produtosFormatados = produtos.map((p) => criarProdutoFormatado(p));
  return produtosFormatados;
}

async function faturamentoTotalComVendaDeProdutos(eventoId) {
  const produtos = await Produto.findAll({
    where: { eventoId },
    raw: true,
  });

  const tipos = [
    'Alimentação',
    'Apetrecho',
    'Brinquedo',
    'Cerveja',
    'Decoração',
    'Livro',
    'Refrigerante',
    'Roupa',
  ];

  const valorFaturado = {
    produtos: tipos.map((tipo) => ({
      tipoProduto: tipo,
      quantidade: 0,
      valorFaturado: 0,
    })),
    valorFaturadoTotal: 0,
  };

  for (const prod of produtos) {
    const categoria = valorFaturado.produtos.find((p) => p.tipoProduto === prod.tipoProduto);
    if (categoria) {
      categoria.quantidade += prod.qtdUnidadesVendidas;
      categoria.valorFaturado += prod.valorFaturado;
    }
  }

  valorFaturado.valorFaturadoTotal = valorFaturado.produtos.reduce(
    (acc, p) => parseFloat(acc) + parseFloat(p.valorFaturado),
    0
  );

  valorFaturado.valorFaturadoTotal = floatParaString(valorFaturado.valorFaturadoTotal);

  const produtosFormatado = valorFaturado.produtos
    .filter((p) => p.valorFaturado > 0)
    .map((p) => ({
      tipoProduto: p.tipoProduto,
      quantidade: p.quantidade,
      valorFaturado: floatParaString(p.valorFaturado),
    }));

  valorFaturado.produtos = produtosFormatado;

  return valorFaturado;
}

module.exports = {
  criar,
  salvar,
  buscarPorId,
  remover,
  buscarProdutosVendidosDoEvento,
  faturamentoTotalComVendaDeProdutos,
};
