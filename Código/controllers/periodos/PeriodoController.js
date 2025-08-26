const reservaHelper = require('../../helpers/reservas/reservaHelper');
const eventoHelper = require('../../helpers/eventos/eventoHelper');
const periodoHelper = require('../../helpers/periodos/periodoHelper');
const reservaDataHelper = require('../../helpers/reservas/reservaDataHelper');
const eventoDataHelper = require('../../helpers/eventos/eventoDataHelper');

module.exports = class PeriodoController {
  static async salvarPeriodoParaReserva(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { data, horarioInicio, horarioTermino, reservaId } = req.body;
      const periodoEnviadoPeloUsuario = periodoHelper.criar(
        data,
        horarioInicio,
        horarioTermino,
        reservaId
      );

      const reserva = await reservaHelper.buscarPorId(reservaId);
      const periodoSaveResult = await periodoHelper.salvarParaReserva(periodoEnviadoPeloUsuario);
      const hasError = Array.isArray(periodoSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? periodoSaveResult.join('<br/>') : 'O período foi criado com sucesso!!'
      );

      const periodo = hasError ? periodoEnviadoPeloUsuario : periodoHelper.criar();

      res.render('reservas/gerenciar', {
        reserva,
        reservaId,
        periodo,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.log('Erro ao salvar ao salvar Periodo da reserva' + err);
    }
  }

  static async salvarPeriodoParaEvento(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { data, horarioInicio, horarioTermino, eventoId } = req.body;
      const periodoEnviadoPeloUsuario = periodoHelper.criar(data, horarioInicio, horarioTermino);

      periodoEnviadoPeloUsuario.eventoId = eventoId;

      const evento = await eventoHelper.buscarPorId(eventoId);
      const periodoSaveResult = await periodoHelper.salvarParaEvento(periodoEnviadoPeloUsuario);
      const hasError = Array.isArray(periodoSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? periodoSaveResult.join('<br/>') : 'O período foi criado com sucesso!!'
      );

      const periodo = hasError ? periodoEnviadoPeloUsuario : periodoHelper.criar();

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        periodo,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.log('Erro ao salvar Periodo do evento:' + err);
    }
  }

  static async removerPeriodoDaReserva(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    try {
      const { periodoId } = req.params;
      const { reservaId } = req.body;
      await periodoHelper.remover(periodoId);

      req.flash('sucesso', 'O período foi removido com sucesso!!');

      const reserva = await reservaHelper.buscarPorId(reservaId);

      res.render('reservas/gerenciar', {
        reserva,
        reservaId,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.error('Erro ao remover Período:' + err);
    }
  }

  static async removerPeriodoDoEvento(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    try {
      const { periodoId } = req.params;
      const { eventoId } = req.body;
      await periodoHelper.remover(periodoId);

      req.flash('sucesso', 'O período foi removido com sucesso!!');

      const evento = await eventoHelper.buscarPorId(eventoId);

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.error('Erro ao remover Período:' + err);
    }
  }
};
