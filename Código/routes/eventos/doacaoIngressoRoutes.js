const express = require('express');
const router = express.Router();
const DoacaoIngressoController = require('../../controllers/eventos/DoacaoIngressoController');

router.post('/adicionar', DoacaoIngressoController.salvar);
router.post('/remover/:doacaoIngressoId', DoacaoIngressoController.remover);

module.exports = router;
