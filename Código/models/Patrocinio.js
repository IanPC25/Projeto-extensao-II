const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const Patrocinio = sequelize.define(
    'patrocinios',
    {
      tipoPatrocinio: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tipo_patrocinio',
        validate: {
          isIn: {
            args: [['Privado', 'Publico']],
            msg: validatorHelper.selectMsg('Origem patrocínio'),
          },
        },
      },
      entidadePatrocinadora: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'entidade_patrocinadora',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Entidade'),
          },
        },
      },
      telefonePatrocinador: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'telefone_patrocinador',
      },
      celularPatrocinador: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'celular_patrocinador',
      },
      responsavelPeloPatrocinio: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'responsavel_pelo_patrocinio',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Responsável'),
          },
        },
      },
      valorPatrocinio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'valor_patrocinio',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Valor do patrocínio'),
          },
        },
        get() {
          const raw = this.getDataValue('valorPatrocinio');
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

  return Patrocinio;
};
