const eventoHelper = require('../../helpers/eventos/eventoHelper');
const produtoHelper = require('../../helpers/eventos/produtoHelper');
const eventoDataHelper = require('../../helpers/eventos/eventoDataHelper');

module.exports = class ProdutoController {
  static async salvar(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { tipoProduto, nomeProduto, precoVenda, qtdUnidadesVendidas, dataVendas, eventoId } =
        req.body;

      const produtoEnviadoPeloUsuario = produtoHelper.criar(
        tipoProduto,
        nomeProduto,
        precoVenda,
        qtdUnidadesVendidas,
        dataVendas,
        eventoId
      );

      const evento = await eventoHelper.buscarPorId(eventoId);
      const produtoSaveResult = await produtoHelper.salvar(produtoEnviadoPeloUsuario);
      const hasError = Array.isArray(produtoSaveResult);

      req.flash(
        hasError ? 'erros' : 'sucesso',
        hasError ? produtoSaveResult.join('<br/>') : 'O produto foi criado com sucesso!!'
      );

      const responsavel = hasError ? produtoEnviadoPeloUsuario : produtoHelper.criar();

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        responsavel,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.log('Erro ao salvar produto: ' + err);
    }
  }

  static async remover(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    try {
      const { produtoId } = req.params;
      const { eventoId } = req.body;
      const produtoRemovido = await produtoHelper.remover(produtoId);

      req.flash('sucesso', `O produto ${produtoRemovido.nomeProduto} foi removido com sucesso!!`);

      const evento = await eventoHelper.buscarPorId(eventoId);

      res.render('eventos/gerenciar', {
        evento,
        eventoId,
        ...(await eventoDataHelper.buscarDadosRelacionadosDoEvento(eventoId)),
      });
    } catch (err) {
      console.error('Erro ao remover produto:' + err);
    }
  }
};
