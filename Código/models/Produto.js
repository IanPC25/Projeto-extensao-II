const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define(
    'produtos',
    {
      tipoProduto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tipo_produto',
        validate: {
          isIn: {
            args: [
              [
                'Alimentação',
                'Apetrecho',
                'Brinquedo',
                'Cerveja',
                'Decoração',
                'Livro',
                'Refrigerante',
                'Roupa',
              ],
            ],
            msg: validatorHelper.selectMsg('Tipo de produto'),
          },
        },
      },
      nomeProduto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nome_produto',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Produto'),
          },
          len: {
            args: [3, 255],
            msg: validatorHelper.minCharsMsg('Produto', 3),
          },
        },
      },
      precoVenda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'preco_venda',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Preço de venda'),
          },
        },
        get() {
          const raw = this.getDataValue('precoVenda');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      qtdUnidadesVendidas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'qtd_unidades_vendidas',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Quantidade de unidades vendidas'),
          },
        },
        get() {
          const raw = this.getDataValue('qtdUnidadesVendidas');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      valorFaturado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'valor_faturado',
        get() {
          const raw = this.getDataValue('valorFaturado');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      dataVendas: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'data_vendas',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Data das vendas realizadas'),
          },
        },
      },
      eventoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'evento_id',
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Produto;
};
