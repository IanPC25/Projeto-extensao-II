const eventoHelper = require('../../helpers/eventos/eventoHelper');
const doacaoIngressoHelper = require('../../helpers/eventos/doacaoIngressoHelper');
const eventoDataHelper = require('../../helpers/eventos/eventoDataHelper');

module.exports = class DoacaoIngressoController {
  static async salvar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const {
        dataDoacao,
        nomeLocalContemplado,
        responsavelPelaDistribuicao,
        telefoneResponsavelPelaDistribuicao,
        celularResponsavelPelaDistribuicao,
        qtdIngressosDoados,
        eventoId,
      } = req.body;

      const doacaoIngressoEnviadoPeloUsuario = doacaoIngressoHelper.criar(
        dataDoacao,
        nomeLocalContemplado,
        responsavelPelaDistribuicao,
        telefoneResponsavelPelaDistribuicao,
        celularResponsavelPelaDistribuicao,
        qtdIngressosDoados,
        eventoId
      );

      let evento = await eventoHelper.buscarPorId(eventoId);
      let doacaoIngresso = null;

      if (
        doacaoIngressoHelper.stringParaInteger(qtdIngressosDoados) >
        doacaoIngressoHelper.stringParaInteger(evento.qtdIngressosGratuitosDisponiveis)
      ) {
        req.flash(
          'erros',
          `Doação inválida!!! A doação ultrapassa a quantidade de ingressos disponíveis.`
        );
        doacaoIngresso = doacaoIngressoEnviadoPeloUsuario;
      } else {
        const doacaoIngressoSaveResult = await doacaoIngressoHelper.salvar(
          doacaoIngressoEnviadoPeloUsuario
        );
        const hasError = Array.isArray(doacaoIngressoSaveResult);

        req.flash(
          hasError ? 'erros' : 'sucesso',
          hasError
            ? doacaoIngressoSaveResult.join('<br/>')
            : `A doação de ingressos para o local ${doacaoIngressoSaveResult.nomeLocalContemplado} foi cadastrada com sucesso!!`
        );

        doacaoIngresso = hasError ? doacaoIngressoEnviadoPeloUsuario : doacaoIngressoHelper.criar();

        if (!hasError) {
          await eventoHelper.atualizarValoresIngressosGratuitos(
            evento.id,
            'doacao',
            doacaoIngressoHelper.stringParaInteger(qtdIngressosDoados)
          );
        }
      }

      evento = await eventoHelper.buscarPorId(eventoId);

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        doacaoIngresso,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.log('Erro ao salvar ao salvar doação de ingressos:' + err);
    }
  }

  static async remover(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    try {
      const { doacaoIngressoId } = req.params;
      const { eventoId } = req.body;
      const doacaoIngressoRemovido = await doacaoIngressoHelper.remover(doacaoIngressoId);

      await eventoHelper.atualizarValoresIngressosGratuitos(
        eventoId,
        'cancelamento',
        doacaoIngressoHelper.stringParaInteger(doacaoIngressoRemovido.qtdIngressosDoados)
      );

      req.flash(
        'sucesso',
        `A doação de ingressos para o local ${doacaoIngressoRemovido.nomeLocalContemplado} foi removida com sucesso!!`
      );

      const evento = await eventoHelper.buscarPorId(eventoId);

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.error('Erro ao remover a doação de ingressos:' + err);
    }
  }
};
