const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

// importar funções dos modelos
const ReservaModel = require('./Reserva');
const ResponsavelModel = require('./Responsavel');
const PagamentoModel = require('./Pagamento');
const PeriodoModel = require('./Periodo');
const EventoModel = require('./Evento');
const ProdutoModel = require('./Produto');
const DoacaoIngressoModel = require('./DoacaoIngresso');
const PatrocinioModel = require('./Patrocinio');
const VendaIngressoModel = require('./VendaIngresso');

// instanciar os modelos
const Reserva = ReservaModel(sequelize, DataTypes);
const Responsavel = ResponsavelModel(sequelize, DataTypes);
const Pagamento = PagamentoModel(sequelize, DataTypes);
const Periodo = PeriodoModel(sequelize, DataTypes);
const Evento = EventoModel(sequelize, DataTypes);
const Produto = ProdutoModel(sequelize, DataTypes);
const DoacaoIngresso = DoacaoIngressoModel(sequelize, DataTypes);
const Patrocinio = PatrocinioModel(sequelize, DataTypes);
const VendaIngresso = VendaIngressoModel(sequelize, DataTypes);

/*----------------------------N:1--------------------------------*/
Reserva.hasMany(Responsavel, { foreignKey: 'reserva_id', as: 'responsaveis' });
Responsavel.belongsTo(Reserva, { foreignKey: 'reserva_id', onDelete: 'CASCADE', as: 'reserva' });

Reserva.hasMany(Pagamento, { foreignKey: 'reserva_id', as: 'pagamentos' });
Pagamento.belongsTo(Reserva, { foreignKey: 'reserva_id', onDelete: 'CASCADE', as: 'reserva' });

Reserva.hasMany(Periodo, { foreignKey: 'reserva_id', as: 'periodos' });
Periodo.belongsTo(Reserva, { foreignKey: 'reserva_id', onDelete: 'CASCADE', as: 'reserva' });

Evento.hasMany(Periodo, { foreignKey: 'evento_id', as: 'periodos' });
Periodo.belongsTo(Evento, { foreignKey: 'evento_id', onDelete: 'CASCADE', as: 'evento' });

Evento.hasMany(Produto, { foreignKey: 'evento_id', as: 'produtos' });
Produto.belongsTo(Evento, { foreignKey: 'evento_id', onDelete: 'CASCADE', as: 'evento' });

Evento.hasMany(DoacaoIngresso, { foreignKey: 'evento_id', as: 'doacao_ingressos' });
DoacaoIngresso.belongsTo(Evento, { foreignKey: 'evento_id', onDelete: 'CASCADE', as: 'evento' });

Evento.hasMany(Patrocinio, { foreignKey: 'evento_id', as: 'patrocinios' });
Patrocinio.belongsTo(Evento, { foreignKey: 'evento_id', onDelete: 'CASCADE', as: 'evento' });

Evento.hasMany(VendaIngresso, { foreignKey: 'evento_id', as: 'venda_ingressos' });
VendaIngresso.belongsTo(Evento, { foreignKey: 'evento_id', onDelete: 'CASCADE', as: 'evento' });

module.exports = {
  sequelize,
  Reserva,
  Responsavel,
  Pagamento,
  Periodo,
  Evento,
  Produto,
  DoacaoIngresso,
  Patrocinio,
  VendaIngresso,
};
