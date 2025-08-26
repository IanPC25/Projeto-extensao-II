const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const Periodo = sequelize.define(
    'periodos',
    {
      data: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'data',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Data para reservar'),
          },
        },
      },
      horarioInicio: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'horario_inicio',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Hora de início'),
          },
        },
      },
      horarioTermino: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'horario_termino',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Horário de término'),
          },
          isAfterStart(value) {
            if (this.horarioInicio && value <= this.horarioInicio) {
              throw new Error(
                validatorHelper.greaterThanMsg('Horário de término', 'Horário de início')
              );
            }
          },
        },
      },
      reservaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'reserva_id',
      },
      eventoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'evento_id',
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Periodo;
};
