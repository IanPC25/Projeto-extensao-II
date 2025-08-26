const validatorHelper = require('../helpers/validatorHelper');

module.exports = (sequelize, DataTypes) => {
  const Evento = sequelize.define(
    'eventos',
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
            msg: validatorHelper.selectMsg('Objetivo'),
          },
        },
      },
      valorIngressoInteira: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'valor_ingresso_inteira',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Valor'),
          },
        },
        set(value) {
          this.setDataValue('valorIngressoInteira', value);
          this.setDataValue('valorIngressoMeiaEntrada', value / 2);
        },
        get() {
          const raw = this.getDataValue('valorIngressoInteira');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      valorIngressoMeiaEntrada: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'valor_ingresso_meia_entrada',
        get() {
          const raw = this.getDataValue('valorIngressoMeiaEntrada');
          return raw === null ? 0 : parseFloat(raw);
        },
      },
      qtdIngressosParaVendaDisponibilizados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'qtd_ingressos_para_venda_disponibilizados',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Quantidade de ingressos para venda disponibilizados'),
          },
        },
        get() {
          const raw = this.getDataValue('qtdIngressosParaVendaDisponibilizados');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      qtdIngressosGratuitosDisponibilizados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'qtd_ingressos_gratuitos_disponibilizados',
        validate: {
          notEmpty: {
            msg: validatorHelper.requiredMsg('Quantidade de ingressos gratuitos disponibilizados'),
          },
        },
        get() {
          const raw = this.getDataValue('qtdIngressosGratuitosDisponibilizados');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      qtdIngressosParaVendaDisponiveis: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'qtd_ingressos_para_venda_disponiveis',
        get() {
          const raw = this.getDataValue('qtdIngressosParaVendaDisponiveis');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      qtdIngressosGratuitosDisponiveis: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'qtd_Ingressos_gratuitos_disponiveis',
        get() {
          const raw = this.getDataValue('qtdIngressosGratuitosDisponiveis');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      qtdIngressosVendidos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'qtd_ingressos_vendidos',
        validate: {
          menorOuIgualDisponibilizados(value) {
            if (value > this.qtdIngressosPagosDisponibilizados) {
              throw new Error(
                notGreaterThanMsg('ingressos vendidos', 'ingressos pagos disponibilizados')
              );
            }
          },
        },
        get() {
          const raw = this.getDataValue('qtdIngressosVendidos');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      qtdIngressosDoados: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'qtd_ingressos_doados',
        get() {
          const raw = this.getDataValue('qtdIngressosDoados');
          return raw === null ? 0 : parseInt(raw);
        },
      },
      informacoesComplementares: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'informacoes_complementares',
      },
      status: {
        type: DataTypes.BOOLEAN,
        field: 'status',
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Evento;
};
