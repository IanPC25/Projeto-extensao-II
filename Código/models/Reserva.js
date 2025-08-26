const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define(
    'reservas',
    {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'titulo',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Título'),
          },
          len: {
            args: [3, 255],
            msg: validatorHelper.minCharsMsg('Título', 3),
          },
        },
      },
      objetivo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'objetivo',
        validate: {
          isIn: {
            args: [['Filme', 'Palestra', 'Show', 'Teatro', 'Treinamento']],
            msg: validatorHelper.selectMsg('Objetivo da reserva'),
          },
        },
      },
      valorDaReserva: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'valor_da_reserva',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Valor'),
          },
        },
        get() {
          const raw = this.getDataValue('valorDaReserva');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      valorQuitadoDaReserva: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'valor_quitado_da_reserva',
        allowNull: true,
        defaultValue: 0.0,
        get() {
          const raw = this.getDataValue('valorQuitadoDaReserva');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      valorPendenteDaReserva: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'valor_pendente_da_reserva',
        allowNull: true,
        defaultValue: 0.0,
        get() {
          const raw = this.getDataValue('valorPendenteDaReserva');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      informacoesComplementares: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'informacoes_complementares',
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'status',
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Reserva;
};
