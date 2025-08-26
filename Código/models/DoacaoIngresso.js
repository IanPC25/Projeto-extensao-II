const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const DoacaoIngresso = sequelize.define(
    'doacao_ingressos',
    {
      nomeLocalContemplado: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nome_local_contemplado',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Local contemplado'),
          },
        },
      },
      responsavelPelaDistribuicao: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'responsavel_pela_distribuicao',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Responsável'),
          },
        },
      },
      telefoneResponsavelPelaDistribuicao: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'telefone_responsavel_pela_distribuicao',
      },
      celularResponsavelPelaDistribuicao: {
        type: DataTypes.STRING,
        field: 'celular_responsavel_pela_distribuicao',
        allowNull: true,
      },
      qtdIngressosDoados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'qtd_ingressos_doados',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Quantidade ingressos fornecidos'),
          },
        },
        get() {
          const raw = this.getDataValue('qtdIngressosDoados');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      dataDoacao: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'data_doacao',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Data da doação'),
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

  return DoacaoIngresso;
};
