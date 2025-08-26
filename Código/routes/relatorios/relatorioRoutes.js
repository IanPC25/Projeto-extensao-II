const express = require('express');
const router = express.Router();
const RelatorioController = require('../../controllers/relatorios/RelatorioController');

router.get('/formulario-geracao-agenda', RelatorioController.formularioParaGeracaoRelatorioAgenda);
router.get('/agenda-pdf', RelatorioController.agendaPDF);
router.get(
  '/formulario-geracao-relatorio-financeiro',
  RelatorioController.formularioParaGeracaoRelatorioFinanceiro
);
router.get('/financeiro-pdf', RelatorioController.relatorioFinanceiroPDF);
module.exports = router;
