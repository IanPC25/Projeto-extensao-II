const reservaHelper = require('../../helpers/reservas/reservaHelper');
const reservaDataHelper = require('../../helpers/reservas/reservaDataHelper');

module.exports = class ReservaController {
  static async formularioCadastro(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    return res.render('reservas/adicionar');
  }

  static async salvar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      if (!req.session.authenticated)
        return res.render('autenticacao/autenticar', { layout: false });
      const { titulo, objetivo, valorDaReserva, informacoesComplementares } = req.body;

      const reservaEnviadaPeloUsuario = reservaHelper.criar(
        titulo,
        objetivo,
        valorDaReserva,
        informacoesComplementares
      );

      const reservaSaveResult = await reservaHelper.salvar(reservaEnviadaPeloUsuario);
      const hasError = Array.isArray(reservaSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? reservaSaveResult.join('<br/>') : 'A reserva foi criada com sucesso!!'
      );

      const novaReservaId = hasError ? '' : reservaSaveResult.id;
      const reserva = hasError ? reservaEnviadaPeloUsuario : reservaHelper.criar();

      res.render('reservas/adicionar', { novaReservaId, reserva });
    } catch (err) {
      console.log('Erro ao salvar a reserva' + err);
    }
  }

  static async atualizar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { titulo, objetivo, valorDaReserva, informacoesComplementares, reservaId } = req.body;

      const reservaEnviadaPeloUsuario = reservaHelper.criar(
        titulo,
        objetivo,
        valorDaReserva,
        informacoesComplementares
      );

      const reservaSaveResult = await reservaHelper.atualizar(reservaEnviadaPeloUsuario, reservaId);

      const hasError = Array.isArray(reservaSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? reservaSaveResult.join('<br/>') : 'A reserva foi atualizada com sucesso!!'
      );

      const reservaResponse = hasError ? reservaEnviadaPeloUsuario : reservaSaveResult;

      res.render('Reservas/gerenciar', {
        reserva: reservaResponse,
        reservaId,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.error('Erro ao atualizar a reserva:' + err);
    }
  }

  static async removerReservaEmAndamento(req, res) {
    try {
      const { reservaId } = req.params;
      const reservaRemovida = await reservaHelper.remover(reservaId);

      req.flash('sucesso', `A reserva ${reservaRemovida.titulo} foi removida com sucesso!!`);

      const reservasEmAndamento = await reservaHelper.buscarReservasEmAndamento();
      return res.render('reservas/reservas_em_andamento', { reservasEmAndamento });
    } catch (err) {
      console.error('Erro ao remover reserva:' + err);
    }
  }

  static async removerReservaEncerrada(req, res) {
    try {
      const { reservaId } = req.params;
      const reservaRemovida = await reservaHelper.remover(reservaId);

      req.flash('sucesso', `A reserva ${reservaRemovida.titulo} foi removida com sucesso!!`);

      const reservasEncerradas = await reservaHelper.buscarReservasEncerradas();
      return res.render('reservas/reservas_encerradas', { reservasEncerradas });
    } catch (err) {
      console.error('Erro ao remover reserva:' + err);
    }
  }

  static async gerenciar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    const reservaId = req.params.reservaId;
    const reserva = await reservaHelper.buscarPorId(reservaId);

    return res.render('reservas/gerenciar', {
      reserva,
      reservaId,
      ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
    });
  }

  static async encerrar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { reservaId } = req.params;
      await reservaHelper.encerrar(reservaId);

      const reservaEncerrada = await reservaHelper.buscarPorId(reservaId);

      res.render('reservas/detalhes', {
        reservaEncerrada,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.error('Erro ao encerrar reserva:' + err);
    }
  }

  static async detalhes(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { reservaId } = req.params;

      const reservaEncerrada = await reservaHelper.buscarPorId(reservaId);

      res.render('reservas/detalhes', {
        reservaEncerrada,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.error('Erro ao construir a página de detalhes:' + err);
    }
  }

  static async listarReservasEmAndamento(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    const reservasEmAndamento = await reservaHelper.buscarReservasEmAndamento();
    return res.render('reservas/reservas_em_andamento', { reservasEmAndamento });
  }

  static async listarReservasEncerradas(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    const reservasEncerradas = await reservaHelper.buscarReservasEncerradas();
    return res.render('reservas/reservas_encerradas', { reservasEncerradas });
  }
};
