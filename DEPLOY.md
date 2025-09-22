## Deploy gratuito com Render (backend) e Git (auto-deploy)

Pré-requisitos:
- Conta no Render (gratuita)
- Repositório no GitHub/GitLab com este projeto
- MySQL gerenciado gratuito (PlanetScale) ou seu próprio MySQL acessível na internet

### 1) Banco de dados (PlanetScale)
1. Crie conta no PlanetScale (plano gratuito).
2. Crie um database `estoque-hospital`.
3. Crie um branch `main` e promova para produção.
4. Em "Connect", copie as credenciais (host, usuário, senha). Anote também o `DATABASE`.
5. Rode o `schema.sql` localmente apontando para o banco (via cliente MySQL) ou use um cliente GUI para executar o arquivo.

### 2) Backend no Render
1. Crie um novo "Web Service" a partir do seu repositório.
2. Defina:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Variáveis de ambiente (Environment):
   - `PORT` = 10000 (Render define automaticamente; pode deixar em branco)
   - `SESSION_SECRET` = um segredo forte
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` conforme o banco
   - `ADMIN_EMAIL`, `ADMIN_NOME`, `ADMIN_SENHA` (opcional para seed)
4. Após o primeiro deploy, abra um shell (se disponível) ou crie um Job/Worker temporário para rodar:
   - `node src/scripts/seed_admin.js`

Render fará auto-deploy a cada push no branch configurado.

### 3) Frontend estático
O frontend (EJS + Bootstrap) já é servido pelo próprio Express via `public/` e views. Não há necessidade de hospedagem separada.

### 4) Domínio e HTTPS
No Render, adicione um Custom Domain e siga as instruções de DNS. HTTPS é automático.


