const vendaIngressoHelper = require('../../helpers/eventos/vendaIngressoHelper');
const patrocinioHelper = require('../../helpers/eventos/patrocinioHelper');
const produtoHelper = require('../../helpers/eventos/produtoHelper');
const eventoHelper = require('../../helpers/eventos/eventoHelper');

async function faturamentosDoEvento(eventoId) {
  const [
    eventoEncerrado,
    faturamentosComIngressos,
    faturamentosComPatrocinios,
    faturamentosComProdutos,
  ] = await Promise.all([
    eventoHelper.buscarPorId(eventoId),
    vendaIngressoHelper.faturamentoTotalComVendaDeIngressos(eventoId),
    patrocinioHelper.faturamentoTotalComPatrocinios(eventoId),
    produtoHelper.faturamentoTotalComVendaDeProdutos(eventoId),
  ]);

  return {
    eventoEncerrado,
    faturamentosComIngressos,
    faturamentosComPatrocinios,
    faturamentosComProdutos,
  };
}

module.exports = { faturamentosDoEvento };
