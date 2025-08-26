const eventoHelper = require('../../helpers/eventos/eventoHelper');
const reservaHelper = require('../../helpers/reservas/reservaHelper');
const reservaDataHelper = require('../../helpers/reservas/reservaDataHelper');
const eventoDataHelper = require('../../helpers/eventos/eventoDataHelper');
const periodoHelper = require('../../helpers/periodos/periodoHelper');

//Função não exportada
function floatParaString(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return '';
  return parseFloat(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

//Função não exportada
function stringParaFloat(valor) {
  if (typeof valor === 'string') {
    return parseFloat(
      valor.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
    );
  }
  return parseFloat(valor);
}

async function buscarDadosAgenda() {
  const [reservas, eventos] = await Promise.all([
    reservaHelper.buscarReservasEmAndamento(),
    eventoHelper.buscarEventosEmAndamento(),
  ]);

  const criarAcontecimentos = async (itens, tipo, buscarPeriodos) => {
    const resultados = [];
    for (const item of itens) {
      const periodos = await buscarPeriodos(item.id);
      for (const p of periodos) {
        const dataObj = new Date(p.data);
        const [hora, minuto] = p.horarioInicio.split(':').map(Number);

        resultados.push({
          tipo,
          titulo: item.titulo,
          objetivo: item.objetivo,
          data: dataObj,
          horarioInicio: p.horarioInicio,
          horarioTermino: p.horarioTermino,
          ordem:
            dataObj.getFullYear() * 1000000 +
            (dataObj.getMonth() + 1) * 10000 +
            dataObj.getDate() * 100 +
            hora * 1 +
            minuto / 60,
        });
      }
    }
    return resultados;
  };

  const agendaReservas = await criarAcontecimentos(
    reservas,
    'Reserva',
    periodoHelper.buscarPeriodosDaReserva
  );
  const agendaEventos = await criarAcontecimentos(
    eventos,
    'Evento',
    periodoHelper.buscarPeriodosDoEvento
  );

  const agenda = [...agendaReservas, ...agendaEventos];
  agenda.sort((a, b) => a.ordem - b.ordem);
  agenda.forEach((a) => delete a.ordem);

  return { agenda };
}

async function buscarDadosFaturamentoDasReservasEncerradas(dataInicial, dataFinal) {
  const reservasEncerradas = await reservaHelper.buscarReservasEncerradas();
  const faturamentoReservas = [];
  let totalFaturamentoReservas = 0;

  for (const reserva of reservasEncerradas) {
    const { pagamentos } = await reservaDataHelper.buscarDadosRelacionadosDaReserva(reserva.id);

    const pagamentosNoPeriodo = pagamentos.filter((p) => {
      const dataPagamento = new Date(p.dataPagamento);
      return dataPagamento >= dataInicial && dataPagamento <= dataFinal;
    });

    if (pagamentosNoPeriodo.length > 0) {
      for (const pagamento of pagamentosNoPeriodo) {
        totalFaturamentoReservas += stringParaFloat(pagamento.valorPago);

        faturamentoReservas.push({
          titulo: reserva.titulo,
          objetivo: reserva.objetivo,
          dataPagamento: pagamento.dataPagamento,
          valorPago: pagamento.valorPago,
        });
      }
    }
  }

  faturamentoReservas.sort((a, b) => new Date(a.dataPagamento) - new Date(b.dataPagamento));

  return {
    faturamentoReservas,
    totalFaturamentoReservas: floatParaString(totalFaturamentoReservas),
  };
}

async function buscarDadosFaturamentoEventosEncerrados(dataInicial, dataFinal) {
  const eventosEncerrados = await eventoHelper.buscarEventosEncerrados();

  const faturamentosPorTitulo = [];
  let totalFaturamentoEventos = 0;

  let faturamentoTotalIngressosInteira = 0;
  let faturamentoTotalIngressosMeia = 0;
  let faturamentoTotalPatrociniosPrivado = 0;
  let faturamentoTotalPatrociniosPublico = 0;

  const faturamentoTotalProdutosPorTipo = {};
  const faturamentoTotalProdutosPorNome = {};

  for (const evento of eventosEncerrados) {
    const { vendasIngressos, patrocinios, produtos } =
      await eventoDataHelper.buscarDadosRelacionadosDoEvento(evento.id);

    const faturamentoPorTipo = {};
    let faturamentoProdutosDoEvento = 0;

    for (const venda of vendasIngressos) {
      const dataVenda = new Date(venda.dataVenda);
      if (dataVenda >= dataInicial && dataVenda <= dataFinal) {
        const tipoFaturamento = `Ingresso-${venda.tipoIngresso}`;
        const valor = stringParaFloat(venda.valorTotalDaVenda);

        if (!faturamentoPorTipo[tipoFaturamento]) {
          faturamentoPorTipo[tipoFaturamento] = {
            titulo: evento.titulo,
            objetivo: evento.objetivo,
            tipoFaturamento,
            faturamento: 0,
          };
        }

        faturamentoPorTipo[tipoFaturamento].faturamento += valor;
        totalFaturamentoEventos += valor;

        if (venda.tipoIngresso === 'Inteira') faturamentoTotalIngressosInteira += valor;
        else if (venda.tipoIngresso === 'Meia') faturamentoTotalIngressosMeia += valor;
      }
    }

    for (const patrocinio of patrocinios) {
      const dataPagamento = new Date(patrocinio.dataPagamento);
      if (dataPagamento >= dataInicial && dataPagamento <= dataFinal) {
        const tipoFaturamento = `Patrocínio-${patrocinio.tipoPatrocinio}`;
        const valor = stringParaFloat(patrocinio.valorPatrocinio);

        if (!faturamentoPorTipo[tipoFaturamento]) {
          faturamentoPorTipo[tipoFaturamento] = {
            titulo: evento.titulo,
            objetivo: evento.objetivo,
            tipoFaturamento,
            faturamento: 0,
          };
        }

        faturamentoPorTipo[tipoFaturamento].faturamento += valor;
        totalFaturamentoEventos += valor;

        if (patrocinio.tipoPatrocinio === 'Privado') faturamentoTotalPatrociniosPrivado += valor;
        else if (patrocinio.tipoPatrocinio === 'Publico')
          faturamentoTotalPatrociniosPublico += valor;
      }
    }

    for (const produto of produtos) {
      const dataVenda = new Date(produto.dataVendas);
      if (dataVenda >= dataInicial && dataVenda <= dataFinal) {
        const valor = stringParaFloat(produto.precoVenda) * Number(produto.qtdUnidadesVendidas);

        faturamentoProdutosDoEvento += valor;
        totalFaturamentoEventos += valor;

        if (!faturamentoTotalProdutosPorTipo[produto.tipoProduto]) {
          faturamentoTotalProdutosPorTipo[produto.tipoProduto] = 0;
        }
        faturamentoTotalProdutosPorTipo[produto.tipoProduto] += valor;

        if (!faturamentoTotalProdutosPorNome[produto.nomeProduto]) {
          faturamentoTotalProdutosPorNome[produto.nomeProduto] = {
            tipoProduto: produto.tipoProduto,
            nomeProduto: produto.nomeProduto,
            qtdVendida: 0,
            faturamentoTotal: 0,
          };
        }

        faturamentoTotalProdutosPorNome[produto.nomeProduto].qtdVendida += parseInt(
          produto.qtdUnidadesVendidas,
          10
        );

        faturamentoTotalProdutosPorNome[produto.nomeProduto].faturamentoTotal += valor;
      }
    }

    if (faturamentoProdutosDoEvento > 0) {
      faturamentoPorTipo['Produtos'] = {
        titulo: evento.titulo,
        objetivo: evento.objetivo,
        tipoFaturamento: 'Produtos',
        faturamento: faturamentoProdutosDoEvento,
      };
    }

    faturamentosPorTitulo.push(
      ...Object.values(faturamentoPorTipo).map((f) => ({
        ...f,
        faturamento: floatParaString(f.faturamento),
      }))
    );
  }

  faturamentosPorTitulo.sort((a, b) => {
    const tituloCompare = a.titulo.localeCompare(b.titulo);
    if (tituloCompare !== 0) return tituloCompare;
    return a.tipoFaturamento.localeCompare(b.tipoFaturamento);
  });

  const faturamentoTotalProdutos = Object.values(faturamentoTotalProdutosPorTipo).reduce(
    (acc, v) => acc + (v || 0),
    0
  );

  const faturamentoTotalProdutosPorNomeOrdenado = Object.entries(faturamentoTotalProdutosPorNome)
    .sort(([nomeA, a], [nomeB, b]) => {
      const tipoCompare = a.tipoProduto.localeCompare(b.tipoProduto);
      if (tipoCompare !== 0) return tipoCompare;
      return b.qtdVendida - a.qtdVendida;
    })
    .map(([nome, { tipoProduto, qtdVendida, faturamentoTotal }]) => ({
      nomeProduto: nome,
      tipoProduto,
      qtdVendida,
      faturamentoTotal: floatParaString(faturamentoTotal),
    }));

  return {
    faturamentosPorTitulo,
    totalFaturamentoEventos: floatParaString(totalFaturamentoEventos),
    faturamentoTotalIngressosInteira: floatParaString(faturamentoTotalIngressosInteira),
    faturamentoTotalIngressosMeia: floatParaString(faturamentoTotalIngressosMeia),
    faturamentoTotalPatrociniosPrivado: floatParaString(faturamentoTotalPatrociniosPrivado),
    faturamentoTotalPatrociniosPublico: floatParaString(faturamentoTotalPatrociniosPublico),
    faturamentoTotalProdutosPorTipo: Object.fromEntries(
      Object.entries(faturamentoTotalProdutosPorTipo).map(([k, v]) => [k, floatParaString(v)])
    ),
    faturamentoTotalProdutosPorNome: faturamentoTotalProdutosPorNomeOrdenado,
    faturamentoTotalProdutos: floatParaString(faturamentoTotalProdutos),
  };
}

module.exports = {
  buscarDadosAgenda,
  buscarDadosFaturamentoDasReservasEncerradas,
  buscarDadosFaturamentoEventosEncerrados,
};
