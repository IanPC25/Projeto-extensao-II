const express = require('express');
const router = express.Router();
const ProdutoController = require('../../controllers/eventos/ProdutoController');

router.post('/adicionar', ProdutoController.salvar);
router.post('/remover/:produtoId', ProdutoController.remover);

module.exports = router;
