const eventoHelper = require('../../helpers/eventos/eventoHelper');
const patrocinioHelper = require('../../helpers/eventos/patrocinioHelper');
const eventoDataHelper = require('../../helpers/eventos/eventoDataHelper');

module.exports = class PatrocinioController {
  static async salvar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const {
        tipoPatrocinio,
        entidadePatrocinadora,
        valorPatrocinio,
        dataPagamento,
        formaPagamento,
        responsavelPeloPatrocinio,
        telefonePatrocinador,
        celularPatrocinador,
        eventoId,
      } = req.body;

      const patrocinioEnviadoPeloUsuario = patrocinioHelper.criar(
        tipoPatrocinio,
        entidadePatrocinadora,
        valorPatrocinio,
        dataPagamento,
        formaPagamento,
        responsavelPeloPatrocinio,
        telefonePatrocinador,
        celularPatrocinador,
        eventoId
      );

      const evento = await eventoHelper.buscarPorId(eventoId);
      const patrocinioSaveResult = await patrocinioHelper.salvar(patrocinioEnviadoPeloUsuario);
      const hasError = Array.isArray(patrocinioSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? patrocinioSaveResult.join('<br/>') : 'O patrocínio foi criado com sucesso!!'
      );

      const patrocinio = hasError ? patrocinioEnviadoPeloUsuario : patrocinioHelper.criar();

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        patrocinio,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.log('Erro ao salvar ao salvar patrocínio:' + err);
    }
  }

  static async remover(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    try {
      const { patrocinioId } = req.params;
      const { eventoId } = req.body;
      const patrocinioRemovido = await patrocinioHelper.remover(patrocinioId);

      req.flash(
        'sucesso',
        `O patrocínio da entidade ${patrocinioRemovido.entidadePatrocinadora} foi removido com sucesso!!`
      );

      const evento = await eventoHelper.buscarPorId(eventoId);

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.error('Erro ao remover patrocínio:' + err);
    }
  }
};
