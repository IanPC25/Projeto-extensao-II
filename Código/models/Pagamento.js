const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const Pagamento = sequelize.define(
    'pagamentos',
    {
      valorPago: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'valor_pago',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Valor a ser pago'),
          },
        },
        get() {
          const raw = this.getDataValue('valorPago');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      dataPagamento: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'data_pagamento',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Data do pagamento'),
          },
        },
      },
      formaPagamento: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'forma_pagamento',
        validate: {
          isIn: {
            args: [['Dinheiro', 'Pix', 'Debito', 'Credito']],
            msg: validatorHelper.selectMsg('Forma de pagamento'),
          },
        },
      },
      responsavelPagamento: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'responsavel_pagamento',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Responsável'),
          },
          len: {
            args: [3, 255],
            msg: validatorHelper.minCharsMsg('Responsável', 3),
          },
        },
      },
      reservaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'reserva_id',
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Pagamento;
};
