const express = require('express');
const router = express.Router();
const { getDbPool } = require('../db');

function ensureAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

router.get('/', ensureAuth, async (req, res, next) => {
  try {
    const pool = getDbPool();
    const [itens] = await pool.query(
      `SELECT i.id, i.nome, i.codigo, i.estoque_atual, u.nome AS unidade, c.nome AS categoria
       FROM itens i
       JOIN unidades u ON u.id = i.unidade_id
       JOIN categorias c ON c.id = i.categoria_id
       ORDER BY i.nome`
    );
    res.render('inventory/index', { itens });
  } catch (err) { next(err); }
});

router.get('/movimentos', ensureAuth, async (req, res, next) => {
  try {
    const [movs] = await getDbPool().query(
      `SELECT m.id, m.tipo, m.quantidade, m.created_at, i.nome AS item, u.nome AS usuario
       FROM movimentos m
       JOIN itens i ON i.id = m.item_id
       JOIN usuarios u ON u.id = m.usuario_id
       ORDER BY m.created_at DESC
       LIMIT 100`
    );
    res.render('inventory/movimentos', { movimentos: movs });
  } catch (err) { next(err); }
});

router.post('/entrada', ensureAuth, async (req, res, next) => {
  const conn = await getDbPool().getConnection();
  try {
    const { item_id, quantidade } = req.body;
    await conn.beginTransaction();
    await conn.query('UPDATE itens SET estoque_atual = estoque_atual + ? WHERE id = ?', [quantidade, item_id]);
    await conn.query(
      'INSERT INTO movimentos (item_id, usuario_id, tipo, quantidade) VALUES (?, ?, ?, ?)',
      [item_id, req.session.user.id, 'ENTRADA', quantidade]
    );
    await conn.commit();
    res.redirect('/estoque');
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

router.post('/saida', ensureAuth, async (req, res, next) => {
  const conn = await getDbPool().getConnection();
  try {
    const { item_id, quantidade } = req.body;
    await conn.beginTransaction();
    await conn.query('UPDATE itens SET estoque_atual = estoque_atual - ? WHERE id = ?', [quantidade, item_id]);
    await conn.query(
      'INSERT INTO movimentos (item_id, usuario_id, tipo, quantidade) VALUES (?, ?, ?, ?)',
      [item_id, req.session.user.id, 'SAIDA', quantidade]
    );
    await conn.commit();
    res.redirect('/estoque');
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

module.exports = router;


