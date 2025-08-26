const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const hbsHelpers = require('./helpers/handlebarsHelpers');
const path = require('path');

const app = express();

const conn = require('./db/conn');

//routes
const autenticacaoRoutes = require('./routes/autenticacao/autenticacaoRoutes');

const reservaRoutes = require('./routes/reservas/reservaRoutes');
const responsavelRoutes = require('./routes/reservas/responsavelRoutes');
const pagamentoRoutes = require('./routes/reservas/pagamentoRoutes');

const eventoRoutes = require('./routes/eventos/eventoRoutes');
const produtoRoutes = require('./routes/eventos/produtoRoutes');
const doacaoIngressoRoutes = require('./routes/eventos/doacaoIngressoRoutes');
const vendaIngressoRoutes = require('./routes/eventos/vendaIngressoRoutes');
const patrocinioRoutes = require('./routes/eventos/patrocinioRoutes');

const periodoRoutes = require('./routes/periodos/periodoRoutes');

const relatorioRoutes = require('./routes/relatorios/relatorioRoutes');

app.engine(
  'hbs',
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: hbsHelpers,
  })
);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: 'segredo_supersecreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(req.session.userid);

  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use('/', autenticacaoRoutes);

app.use('/reservas', reservaRoutes);
app.use('/reservas/responsaveis', responsavelRoutes);
app.use('/reservas/pagamentos', pagamentoRoutes);

app.use('/eventos', eventoRoutes);
app.use('/eventos/produtos', produtoRoutes);
app.use('/eventos/doacao-ingressos', doacaoIngressoRoutes);
app.use('/eventos/venda-ingressos', vendaIngressoRoutes);
app.use('/eventos/patrocinios', patrocinioRoutes);

app.use('/periodos', periodoRoutes);

app.use('/relatorios', relatorioRoutes);

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
