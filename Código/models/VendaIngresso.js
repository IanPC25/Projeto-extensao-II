const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const VendaIngresso = sequelize.define(
    'venda_ingressos',
    {
      tipoIngresso: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tipo_ingresso',
        validate: {
          isIn: {
            args: [['Inteira', 'Meia']],
            msg: validatorHelper.selectMsg('Tipo de ingresso'),
          },
        },
      },
      nomeCliente: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nome_cliente',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Responsável pelo pagamento'),
          },
        },
      },
      qtdIngressosVendidos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'qtd_ingressos_vendidos',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Quantidade de ingressos vendidos'),
          },
        },
        get() {
          const raw = this.getDataValue('qtdIngressosVendidos');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      ValorDoIngressoNaVenda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'valor_do_ingresso_na_venda',
        get() {
          const raw = this.getDataValue('ValorDoIngressoNaVenda');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      valorTotalDaVenda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'valor_total_da_venda',
        get() {
          const raw = this.getDataValue('valorTotalDaVenda');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      dataVenda: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'data_venda',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Data da venda'),
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
    { createdAt: 'created_at', updatedAt: 'updated_at' }
  );

  return VendaIngresso;
};
