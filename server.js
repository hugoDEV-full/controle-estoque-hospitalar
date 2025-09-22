require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const morgan = require('morgan');

const { getDbPool } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

// Locals
app.use((req, res, next) => {
  res.locals.appName = 'Controle de Estoque - Hugo Leonardo soluções para sistemas';
  res.locals.session = req.session;
  next();
});

// Routes
const authRoutes = require('./src/routes/auth.routes');
const inventoryRoutes = require('./src/routes/inventory.routes');
const masterdataRoutes = require('./src/routes/masterdata.routes');

app.use('/', authRoutes);
app.use('/estoque', inventoryRoutes);
app.use('/cadastros', masterdataRoutes);

app.get('/', (req, res) => {
  res.redirect('/estoque');
});

// Health
app.get('/health', async (req, res) => {
  try {
    const pool = getDbPool();
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('errors/500', { error: err });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});


