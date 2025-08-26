const express = require('express');
const router = express.Router();
const VendaIngressoController = require('../../controllers/eventos/VendaIngressoController');

router.post('/adicionar', VendaIngressoController.salvar);
router.post('/remover/:vendaIngressoId', VendaIngressoController.remover);

module.exports = router;
