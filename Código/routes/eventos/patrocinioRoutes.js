const express = require('express');
const router = express.Router();
const PatrocinioController = require('../../controllers/eventos/PatrocinioController');

router.post('/adicionar', PatrocinioController.salvar);
router.post('/remover/:patrocinioId', PatrocinioController.remover);

module.exports = router;
