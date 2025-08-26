const USUARIO = 'admin';
const SENHA = '123';

module.exports = class AutenticacaoController {
  static async formularioAutenticacao(req, res) {
    res.render('autenticacao/autenticar', { layout: false });
  }

  static async autenticar(req, res) {
    const { nomeUsuario, senhaUsuario } = req.body;

    let mensagemParaUsuario = '';
    req.session.authenticated = false;

    if (nomeUsuario === USUARIO && senhaUsuario === SENHA) {
      mensagemParaUsuario = 'Você está logado';
      req.session.authenticated = true;
    } else if (nomeUsuario === '' && senhaUsuario === '')
      mensagemParaUsuario = 'Usuário e senha não informados!';
    else if (nomeUsuario === '') mensagemParaUsuario = 'Usuário não informado!';
    else if (senhaUsuario === '') mensagemParaUsuario = 'Senha não informada!';
    else if (nomeUsuario !== USUARIO) mensagemParaUsuario = 'Usuário inválido!';
    else if (senhaUsuario !== SENHA) mensagemParaUsuario = 'Senha incorreta!';

    req.flash('message', mensagemParaUsuario);
    req.session.authenticated
      ? res.render('autenticacao/pagina_sucesso')
      : res.render('autenticacao/autenticar', { layout: false, nomeUsuario, senhaUsuario });
  }

  static sair(req, res) {
    req.session.destroy();
    res.redirect('/formulario-autenticacao');
  }

  static async paginaSucesso(req, res) {
    if (!req.session.authenticated) {
      res.render('autenticacao/autenticar', { layout: false });
    } else {
      req.flash('message', 'Você está logado');
      res.render('autenticacao/pagina_sucesso');
    }
  }
};
