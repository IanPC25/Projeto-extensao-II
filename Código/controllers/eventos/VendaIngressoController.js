const eventoHelper = require('../../helpers/eventos/eventoHelper');
const vendaIngressoHelper = require('../../helpers/eventos/vendaIngressoHelper');
const eventoDataHelper = require('../../helpers/eventos/eventoDataHelper');

module.exports = class VendaIngressoController {
  static async salvar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const {
        tipoIngresso,
        nomeCliente,
        qtdIngressosVendidos,
        dataVenda,
        formaPagamento,
        eventoId,
      } = req.body;

      let evento = await eventoHelper.buscarPorId(eventoId);
      let vendaIngresso = null;
      let valorDoIngressoNaVenda = '';

      if (tipoIngresso === 'Inteira') valorDoIngressoNaVenda = evento.valorIngressoInteira;
      else valorDoIngressoNaVenda = evento.valorIngressoMeiaEntrada;

      const vendaIngressoEnviadoPeloUsuario = vendaIngressoHelper.criar(
        tipoIngresso,
        nomeCliente,
        qtdIngressosVendidos,
        dataVenda,
        formaPagamento,
        eventoId,
        valorDoIngressoNaVenda
      );

      if (
        vendaIngressoHelper.stringParaInteger(qtdIngressosVendidos) >
        vendaIngressoHelper.stringParaInteger(evento.qtdIngressosParaVendaDisponiveis)
      ) {
        req.flash(
          'erros',
          `Venda inválida!!! A quantidade de ingressos ultrapassa a quantidade de ingressos disponíveis.`
        );
        vendaIngresso = vendaIngressoEnviadoPeloUsuario;
      } else {
        const vendaIngressoSaveResult = await vendaIngressoHelper.salvar(
          vendaIngressoEnviadoPeloUsuario
        );
        const hasError = Array.isArray(vendaIngressoSaveResult);

        req.flash(
          hasError ? 'erros' : 'sucesso',
          hasError
            ? vendaIngressoSaveResult.join('<br/>')
            : `A venda de ingressos para o cliente ${vendaIngressoSaveResult.nomeCliente} foi cadastrada com sucesso!!`
        );

        vendaIngresso = hasError ? vendaIngressoEnviadoPeloUsuario : vendaIngressoHelper.criar();

        if (!hasError) {
          await eventoHelper.atualizarValoresIngressosParaVenda(
            evento.id,
            'venda',
            vendaIngressoHelper.stringParaInteger(qtdIngressosVendidos)
          );
        }
      }

      evento = await eventoHelper.buscarPorId(eventoId);

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        vendaIngresso,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.log('Erro ao salvar ao salvar a venda de ingressos:' + err);
    }
  }

  static async remover(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    try {
      const { vendaIngressoId } = req.params;
      const { eventoId } = req.body;
      const vendaIngressoRemovido = await vendaIngressoHelper.remover(vendaIngressoId);

      await eventoHelper.atualizarValoresIngressosParaVenda(
        eventoId,
        'devolucao',
        vendaIngressoHelper.stringParaInteger(vendaIngressoRemovido.qtdIngressosVendidos)
      );

      req.flash(
        'sucesso',
        `A venda de ingressos para o cliente ${vendaIngressoRemovido.nomeCliente} foi removida com sucesso!!`
      );

      const evento = await eventoHelper.buscarPorId(eventoId);

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.error('Erro ao remover a venda de ingressos:' + err);
    }
  }
};
