const express = require('express');
const router = express.Router();
const { getDbPool } = require('../db');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/estoque');
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const [rows] = await getDbPool().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.render('auth/login', { error: 'Credenciais inválidas' });
    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok) return res.render('auth/login', { error: 'Credenciais inválidas' });
    req.session.user = { id: user.id, nome: user.nome, perfil: user.perfil };
    res.redirect('/estoque');
  } catch (err) { next(err); }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;


