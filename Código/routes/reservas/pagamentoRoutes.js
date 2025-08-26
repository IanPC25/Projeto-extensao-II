const express = require('express');
const router = express.Router();
const PagamentoController = require('../../controllers/reservas/PagamentoController');

router.post('/adicionar', PagamentoController.salvar);
router.post('/remover/:pagamentoId', PagamentoController.remover);

module.exports = router;
