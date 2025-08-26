const reservaHelper = require('../../helpers/reservas/reservaHelper');
const responsavelHelper = require('../../helpers/reservas/responsavelHelper');
const reservaDataHelper = require('../../helpers/reservas/reservaDataHelper');

module.exports = class ResponsavelController {
  static async salvar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { nome, telefone, celular, email, uf, cidade, reservaId } = req.body;
      const responsavelEnviadoPeloUsuario = responsavelHelper.criar(
        nome,
        telefone,
        celular,
        email,
        uf,
        cidade,
        reservaId
      );

      const reserva = await reservaHelper.buscarPorId(reservaId);
      const responsavelSaveResult = await responsavelHelper.salvar(responsavelEnviadoPeloUsuario);
      const hasError = Array.isArray(responsavelSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? responsavelSaveResult.join('<br/>') : 'O responsável foi criado com sucesso!!'
      );

      const responsavel = hasError ? responsavelEnviadoPeloUsuario : responsavelHelper.criar();

      res.render('reservas/gerenciar', {
        reserva,
        reservaId,
        responsavel,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.log('Erro ao salvar ao salvar Responsável' + err);
    }
  }

  static async remover(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    try {
      const { responsavelId } = req.params;
      const { reservaId } = req.body;
      const responsavelRemovido = await responsavelHelper.remover(responsavelId);

      req.flash('sucesso', `O responsável ${responsavelRemovido.nome} foi removido com sucesso!!`);

      const reserva = await reservaHelper.buscarPorId(reservaId);

      res.render('reservas/gerenciar', {
        reserva,
        reservaId,
        ...(await reservaDataHelper.buscarDadosRelacionadosDaReserva(reservaId)),
      });
    } catch (err) {
      console.error('Erro ao remover responsável:' + err);
    }
  }
};
