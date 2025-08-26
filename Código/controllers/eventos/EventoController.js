const eventoHelper = require('../../helpers/eventos/eventoHelper');
const eventoDataHelper = require('../../helpers/eventos/eventoDataHelper');
const faturamentoDataHelper = require('../../helpers/faturamentos/faturamentoDataHelper');

module.exports = class EventoController {
  static async formularioCadastro(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    return res.render('eventos/adicionar');
  }

  static async salvar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      if (!req.session.authenticated)
        return res.render('autenticacao/autenticar', { layout: false });
      const {
        titulo,
        objetivo,
        valorIngressoInteira,
        qtdIngressosParaVendaDisponibilizados,
        qtdIngressosGratuitosDisponibilizados,
        informacoesComplementares,
      } = req.body;

      const eventoEnviadoPeloUsuario = eventoHelper.criar(
        titulo,
        objetivo,
        valorIngressoInteira,
        qtdIngressosParaVendaDisponibilizados,
        qtdIngressosGratuitosDisponibilizados,
        informacoesComplementares
      );

      const eventoSaveResult = await eventoHelper.salvar(eventoEnviadoPeloUsuario);
      const hasError = Array.isArray(eventoSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? eventoSaveResult.join('<br/>') : 'O evento foi criada com sucesso!!'
      );

      const novoEventoId = hasError ? '' : eventoSaveResult.id;
      const evento = hasError ? eventoEnviadoPeloUsuario : eventoHelper.criar();

      res.render('eventos/adicionar', { novoEventoId, evento });
    } catch (err) {
      console.log('Erro ao salvar o evento' + err);
    }
  }

  static async atualizar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const {
        titulo,
        objetivo,
        valorIngressoInteira,
        qtdIngressosPagosDisponibilizados,
        qtdIngressosGratuitosDisponibilizados,
        informacoesComplementares,
        eventoId,
      } = req.body;

      const eventoEnviadoPeloUsuario = eventoHelper.criar(
        titulo,
        objetivo,
        valorIngressoInteira,
        qtdIngressosPagosDisponibilizados,
        qtdIngressosGratuitosDisponibilizados,
        informacoesComplementares
      );

      const eventoSaveResult = await eventoHelper.atualizar(eventoEnviadoPeloUsuario, eventoId);

      const hasError = Array.isArray(eventoSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? eventoSaveResult.join('<br/>') : 'O evento foi atualizado com sucesso!!'
      );

      let eventoResponse = null;

      if (hasError) {
        eventoResponse = await eventoHelper.buscarPorId(eventoId);
        eventoResponse.titulo = eventoEnviadoPeloUsuario.titulo;
        eventoResponse.objetivo = eventoEnviadoPeloUsuario.objetivo;
        eventoResponse.valorIngressoInteira = eventoEnviadoPeloUsuario.valorIngressoInteira;
        eventoResponse.informacoesComplementares =
          eventoEnviadoPeloUsuario.informacoesComplementares;
      } else {
        eventoResponse = eventoSaveResult;
      }

      res.render('eventos/gerenciar', {
        evento: eventoResponse,
        eventoId,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.error('Erro ao atualizar o evento:' + err);
    }
  }

  static async removerEventoEmAndamento(req, res) {
    try {
      const { eventoId } = req.params;
      const eventoRemovido = await eventoHelper.remover(eventoId);

      req.flash('sucesso', `O evento ${eventoRemovido.titulo} foi removido com sucesso!!`);

      const eventosEmAndamento = await eventoHelper.buscarEventosEmAndamento();
      return res.render('eventos/eventos_em_andamento', { eventosEmAndamento });
    } catch (err) {
      console.error('Erro ao remover evento: ' + err);
    }
  }

  static async removerEventoEncerrado(req, res) {
    try {
      const { eventoId } = req.params;
      const eventoRemovido = await eventoHelper.remover(eventoId);

      req.flash('sucesso', `O evento ${eventoRemovido.titulo} foi removido com sucesso!!`);

      const eventosEncerrados = await eventoHelper.buscarEventosEncerrados();
      return res.render('eventos/eventos_encerrados', { eventosEncerrados });
    } catch (err) {
      console.error('Erro ao remover evento:' + err);
    }
  }

  static async gerenciar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    const eventoId = req.params.eventoId;
    const evento = await eventoHelper.buscarPorId(eventoId);

    return res.render('eventos/gerenciar', {
      evento,
      eventoId,
      ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
    });
  }

  static async encerrar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { eventoId } = req.params;
      await eventoHelper.encerrar(eventoId);

      res.render('eventos/detalhes', {
        ...(await faturamentoDataHelper.faturamentosDoEvento(eventoId)),
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.error('Erro ao encerrar o evento:' + err);
    }
  }

  static async detalhes(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { eventoId } = req.params;

      res.render('eventos/detalhes', {
        ...(await faturamentoDataHelper.faturamentosDoEvento(eventoId)),
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.error('Erro ao construir a página de detalhes:' + err);
    }
  }

  static async listarEventosEmAndamento(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    const eventosEmAndamento = await eventoHelper.buscarEventosEmAndamento();
    return res.render('eventos/eventos_em_andamento', { eventosEmAndamento });
  }

  static async listarEventosEncerrados(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    const eventosEncerrados = await eventoHelper.buscarEventosEncerrados();
    return res.render('eventos/eventos_encerrados', { eventosEncerrados });
  }
};
