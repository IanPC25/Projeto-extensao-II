const express = require('express');
const router = express.Router();
const ReservaController = require('../../controllers/reservas/ReservaController');

router.get('/adicionar', ReservaController.formularioCadastro);
router.post('/adicionar', ReservaController.salvar);
router.get('/gerenciar/:reservaId', ReservaController.gerenciar);
router.post('/editar', ReservaController.atualizar);
router.post('/encerrar/:reservaId', ReservaController.encerrar);
router.get('/reserva-encerrada/:reservaId', ReservaController.detalhes);
router.post(
  '/reserva-em-andamento/remover/:reservaId',
  ReservaController.removerReservaEmAndamento
);
router.post('/reserva-encerrada/remover/:reservaId', ReservaController.removerReservaEncerrada);
router.get('/listar-reservas-em-andamento', ReservaController.listarReservasEmAndamento);
router.get('/listar-reservas-encerradas', ReservaController.listarReservasEncerradas);

module.exports = router;
