const periodoHelper = require('../../helpers/periodos/periodoHelper');
const produtoHelper = require('../../helpers/eventos/produtoHelper');
const doacaoIngressoHelper = require('../../helpers/eventos/doacaoIngressoHelper');
const patrocinioHelper = require('../../helpers/eventos/patrocinioHelper');
const vendaIngressoHelper = require('./vendaIngressoHelper');

async function buscarDadosRelacionadosDoEvento(eventoId) {
  const [periodos, produtos, doacaoIngressos, patrocinios, vendasIngressos] = await Promise.all([
    periodoHelper.buscarPeriodosDoEvento(eventoId),
    produtoHelper.buscarProdutosVendidosDoEvento(eventoId),
    doacaoIngressoHelper.buscarDoacoesIngressosDoEvento(eventoId),
    patrocinioHelper.buscarPatrociniosDoEvento(eventoId),
    vendaIngressoHelper.buscarVendasDeIngressosDoEvento(eventoId),
  ]);

  return { periodos, produtos, doacaoIngressos, patrocinios, vendasIngressos };
}

module.exports = { buscarDadosRelacionadosDoEvento };
