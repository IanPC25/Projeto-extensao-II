const express = require('express');
const router = express.Router();
const EventoController = require('../../controllers/eventos/EventoController');

router.get('/adicionar', EventoController.formularioCadastro);
router.post('/adicionar', EventoController.salvar);
router.get('/gerenciar/:eventoId', EventoController.gerenciar);
router.post('/editar', EventoController.atualizar);
router.post('/encerrar/:eventoId', EventoController.encerrar);
router.get('/evento-encerrado/:eventoId', EventoController.detalhes);
router.post('/evento-em-andamento/remover/:eventoId', EventoController.removerEventoEmAndamento);
router.post('/evento-encerrado/remover/:eventoId', EventoController.removerEventoEncerrado);
router.get('/listar-eventos-em-andamento', EventoController.listarEventosEmAndamento);
router.get('/listar-eventos-encerrados', EventoController.listarEventosEncerrados);

module.exports = router;
