const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const Responsavel = sequelize.define(
    'responsaveis',
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nome',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Nome'),
          },
        },
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'telefone',
      },
      celular: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'celular',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'email',
      },
      uf: {
        type: DataTypes.STRING(2),
        allowNull: false,
        field: 'uf',
        validate: {
          isIn: {
            args: [
              [
                'AC',
                'AL',
                'AP',
                'AM',
                'BA',
                'CE',
                'DF',
                'ES',
                'GO',
                'MA',
                'MT',
                'MS',
                'MG',
                'PA',
                'PB',
                'PR',
                'PE',
                'PI',
                'RJ',
                'RN',
                'RS',
                'RO',
                'RR',
                'SC',
                'SP',
                'SE',
                'TO',
              ],
            ],
            msg: validatorHelper.selectMsg('Estado (UF)'),
          },
        },
      },
      cidade: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cidade',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Cidade'),
          },
          len: {
            args: [3, 255],
            msg: validatorHelper.minCharsMsg('Cidade', 3),
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

  return Responsavel;
};
