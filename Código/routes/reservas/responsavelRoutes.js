const express = require('express');
const router = express.Router();
const ResponsavelController = require('../../controllers/reservas/ResponsavelController');

router.post('/adicionar', ResponsavelController.salvar);
router.post('/remover/:responsavelId', ResponsavelController.remover);

module.exports = router;
