require('dotenv').config();
const bcrypt = require('bcrypt');
const { getDbPool } = require('../db');

(async () => {
  const pool = getDbPool();
  const email = process.env.ADMIN_EMAIL || 'admin@hospital.com';
  const nome = process.env.ADMIN_NOME || 'Administrador';
  const senha = process.env.ADMIN_SENHA || 'admin123';
  const senhaHash = await bcrypt.hash(senha, 10);
  const [exists] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (exists.length) {
    console.log('Usuário admin já existe.');
    process.exit(0);
  }
  await pool.query(
    'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, 'ADMIN']
  );
  console.log('Usuário admin criado:', email);
  process.exit(0);
})();


