const express = require('express');
const router = express.Router();
const PeriodoController = require('../../controllers/periodos/PeriodoController');

router.post('/adicionar-para-reserva', PeriodoController.salvarPeriodoParaReserva);
router.post('/remover-da-reserva/:periodoId', PeriodoController.removerPeriodoDaReserva);
router.post('/adicionar-para-evento', PeriodoController.salvarPeriodoParaEvento);
router.post('/remover-do-evento/:periodoId', PeriodoController.removerPeriodoDoEvento);
module.exports = router;
