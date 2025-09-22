const express = require('express');
const router = express.Router();
const { getDbPool } = require('../db');

function ensureAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.perfil !== 'ADMIN') {
    return res.status(403).render('errors/403');
  }
  next();
}

router.get('/itens/novo', ensureAuth, ensureAdmin, async (req, res) => {
  const pool = getDbPool();
  const [cats] = await pool.query('SELECT id, nome FROM categorias ORDER BY nome');
  const [unds] = await pool.query('SELECT id, nome FROM unidades ORDER BY nome');
  const [forns] = await pool.query('SELECT id, nome FROM fornecedores ORDER BY nome');
  res.render('masterdata/itens_form', { cats, unds, forns });
});

router.post('/itens', ensureAuth, ensureAdmin, async (req, res, next) => {
  try {
    const { nome, codigo, categoria_id, unidade_id, fornecedor_id, estoque_minimo } = req.body;
    await getDbPool().query(
      `INSERT INTO itens (nome, codigo, categoria_id, unidade_id, fornecedor_id, estoque_minimo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, codigo, categoria_id, unidade_id, fornecedor_id, estoque_minimo]
    );
    res.redirect('/estoque');
  } catch (err) { next(err); }
});

router.get('/', ensureAuth, ensureAdmin, async (req, res, next) => {
  try {
    const pool = getDbPool();
    const [cats] = await pool.query('SELECT * FROM categorias ORDER BY nome');
    const [unds] = await pool.query('SELECT * FROM unidades ORDER BY nome');
    const [forns] = await pool.query('SELECT * FROM fornecedores ORDER BY nome');
    res.render('masterdata/cadastros', { cats, unds, forns });
  } catch (err) { next(err); }
});

router.post('/categorias', ensureAuth, ensureAdmin, async (req, res, next) => {
  try {
    const { nome } = req.body;
    await getDbPool().query('INSERT INTO categorias (nome) VALUES (?)', [nome]);
    res.redirect('/cadastros');
  } catch (err) { next(err); }
});

router.post('/unidades', ensureAuth, ensureAdmin, async (req, res, next) => {
  try {
    const { nome, sigla } = req.body;
    await getDbPool().query('INSERT INTO unidades (nome, sigla) VALUES (?, ?)', [nome, sigla]);
    res.redirect('/cadastros');
  } catch (err) { next(err); }
});

router.post('/fornecedores', ensureAuth, ensureAdmin, async (req, res, next) => {
  try {
    const { nome, cnpj, contato } = req.body;
    await getDbPool().query('INSERT INTO fornecedores (nome, cnpj, contato) VALUES (?, ?, ?)', [nome, cnpj, contato]);
    res.redirect('/cadastros');
  } catch (err) { next(err); }
});

module.exports = router;


