const express = require('express');
const router = express.Router();
const AutenticacaoController = require('../../controllers/autenticacao/AutenticacaoController');

router.get('/formulario-autenticacao', AutenticacaoController.formularioAutenticacao);
router.post('/autenticar', AutenticacaoController.autenticar);
router.get('/pagina-sucesso', AutenticacaoController.paginaSucesso);
router.get('/sair', AutenticacaoController.sair);

module.exports = router;
