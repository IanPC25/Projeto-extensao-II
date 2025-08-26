const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const relatorioHelper = require('../../helpers/relatorios/relatorioHelper');
require('../../helpers/handlebarsHelpers');

module.exports = class EventoController {
  static async formularioParaGeracaoRelatorioAgenda(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    return res.render('relatorios/formulario_geracao_agenda');
  }

  static async formularioParaGeracaoRelatorioFinanceiro(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });
    return res.render('relatorios/formulario_geracao_financeiro');
  }

  static async agendaPDF(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { agenda } = await relatorioHelper.buscarDadosAgenda();

      const templatePath = path.join(__dirname, '../../views/relatorios/relatorio_agenda.hbs');

      const templateHtml = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateHtml);
      const htmlFinal = template({ agenda });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(htmlFinal);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      await browser.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=relatorio.pdf',
        'Content-Length': pdfBuffer.length,
      });

      return res.send(pdfBuffer);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      res.status(500).send('Erro ao gerar relatório.');
    }
  }

  static async relatorioFinanceiroPDF(req, res) {
    if (!req.session.authenticated) return res.render('autenticacao/autenticar', { layout: false });

    try {
      const { dataInicial, dataFinal, tipoRelatorio } = req.query;

      // Validação das datas
      if (!dataInicial && !dataFinal) {
        req.flash('erros', 'As datas inicial e final devem ser informadas.');
        return res.render('relatorios/formulario_geracao_financeiro', { dataInicial, dataFinal });
      }

      if (!dataInicial) {
        req.flash('erros', 'A data inicial deve ser informada.');
        return res.render('relatorios/formulario_geracao_financeiro', { dataInicial, dataFinal });
      }

      if (!dataFinal) {
        req.flash('erros', 'A data final deve ser informada.');
        return res.render('relatorios/formulario_geracao_financeiro', { dataInicial, dataFinal });
      }

      const dtInicial = new Date(dataInicial);
      const dtFinal = new Date(dataFinal);

      if (dtInicial > dtFinal) {
        req.flash('erros', 'A data inicial deve ser inferior à data final.');
        return res.render('relatorios/formulario_geracao_financeiro', { dataInicial, dataFinal });
      }

      let templatePath = '';
      let htmlFinal = '';

      if (tipoRelatorio === 'Eventos') {
        templatePath = path.join(
          __dirname,
          '../../views/relatorios/relatorio_financeiro_eventos.hbs'
        );

        const {
          faturamentosPorTitulo,
          totalFaturamentoEventos,
          faturamentoTotalIngressosInteira,
          faturamentoTotalIngressosMeia,
          faturamentoTotalPatrociniosPrivado,
          faturamentoTotalPatrociniosPublico,
          faturamentoTotalProdutos,
        } = await relatorioHelper.buscarDadosFaturamentoEventosEncerrados(dtInicial, dtFinal);

        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);

        htmlFinal = template({
          dataInicial,
          dataFinal,
          faturamentosPorTitulo,
          totalFaturamentoEventos,
          faturamentoTotalIngressosInteira,
          faturamentoTotalIngressosMeia,
          faturamentoTotalPatrociniosPrivado,
          faturamentoTotalPatrociniosPublico,
          faturamentoTotalProdutos,
        });
      }

      if (tipoRelatorio === 'Produtos') {
        templatePath = path.join(
          __dirname,
          '../../views/relatorios/relatorio_financeiro_produtos_eventos.hbs'
        );

        const { faturamentoTotalProdutosPorTipo, faturamentoTotalProdutosPorNome } =
          await relatorioHelper.buscarDadosFaturamentoEventosEncerrados(dtInicial, dtFinal);

        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);

        htmlFinal = template({
          faturamentoTotalProdutosPorTipo,
          faturamentoTotalProdutosPorNome,
          dataInicial,
          dataFinal,
        });
      }

      if (tipoRelatorio === 'Reservas') {
        templatePath = path.join(
          __dirname,
          '../../views/relatorios/relatorio_financeiro_reservas.hbs'
        );

        const { faturamentoReservas, totalFaturamentoReservas } =
          await relatorioHelper.buscarDadosFaturamentoDasReservasEncerradas(dtInicial, dtFinal);

        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);

        htmlFinal = template({
          faturamentoReservas,
          totalFaturamentoReservas,
          dataInicial,
          dataFinal,
        });
      }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(htmlFinal);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      await browser.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=relatorio.pdf',
        'Content-Length': pdfBuffer.length,
      });

      return res.send(pdfBuffer);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      res.status(500).send('Erro ao gerar relatório.');
    }
  }
};
