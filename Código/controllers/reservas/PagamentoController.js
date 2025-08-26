const reservaHelper = require('../../helpers/reservas/reservaHelper');
const pagamentoHelper = require('../../helpers/reservas/pagamentoHelper');
const reservaDataHelper = require('../../helpers/reservas/reservaDataHelper');

module.exports = class PagamentoController {
  static async salvar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { valorPago, dataPagamento, formaPagamento, responsavelPagamento, reservaId } =
        req.body;
      const pagamentoEnviadoPeloUsuario = pagamentoHelper.criar(
        valorPago,
        dataPagamento,
        formaPagamento,
        responsavelPagamento,
        reservaId
      );

      let reserva = await reservaHelper.buscarPorId(reservaId);
      let pagamento = null;

      if (
        pagamentoHelper.stringParaFloat(valorPago) >
        pagamentoHelper.stringParaFloat(reserva.valorPendenteDaReserva)
      ) {
        req.flash('erros', `Pagamento inválido!!! Pagamento somado ultrapassa o valor da reserva.`);
        pagamento = pagamentoEnviadoPeloUsuario;
      } else {
        const pagamentoSaveResult = await pagamentoHelper.salvar(pagamentoEnviadoPeloUsuario);
        const hasError = Array.isArray(pagamentoSaveResult);

        req.flash(
          hasError ? 'erros' : 'sucesso',
          hasError ? pagamentoSaveResult.join('<br/>') : 'Pagamento criado com sucesso!!'
        );

        pagamento = hasError ? pagamentoEnviadoPeloUsuario : pagamentoHelper.criar();

        if (!hasError) {
          await reservaHelper.atualizarValoresDaReserva(
            reserva.id,
            'soma',
            pagamentoHelper.stringParaFloat(valorPago)
          );
        }
      }

      reserva = await reservaHelper.buscarPorId(reservaId);

      res.render('reservas/gerenciar', {
        reserva,
        reservaId,
        pagamento,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.log('Erro ao salvar ao salvar pagamento:' + err);
    }
  }

  static async remover(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { pagamentoId } = req.params;
      const { reservaId } = req.body;
      const pagamentoRemovido = await pagamentoHelper.remover(pagamentoId);
      await reservaHelper.atualizarValoresDaReserva(
        reservaId,
        'desconto',
        pagamentoRemovido.valorPago
      );

      req.flash(
        'sucesso',
        `O pagamento do ${pagamentoRemovido.responsavelPagamento} foi removido com sucesso!!`
      );

      const reserva = await reservaHelper.buscarPorId(reservaId);

      res.render('reservas/gerenciar', {
        reserva,
        reservaId,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.error('Erro ao remover pagamento:' + err);
    }
  }
};
