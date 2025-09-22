## Tutorial de uso

Bem-vindo ao Controle de Estoque de Insumos de Escritório para Hospital.
Assinatura: Hugo Leonardo soluções para sistemas.

### Acesso
- Abra o sistema e acesse com seu e-mail e senha.
- Um usuário administrador inicial pode ser criado pelo responsável de TI usando o script de seed.

### Perfis
- ADMIN: gerencia cadastros, cria itens e usuários (via DB), realiza movimentos.
- OPERADOR: realiza entradas e saídas e consulta relatórios.

### Cadastros básicos (ADMIN)
1. Acesse Menu Cadastros.
2. Adicione Categorias (ex.: Papelaria, Impressão, Higiene).
3. Adicione Unidades (ex.: Unidade, Caixa, Pacote) e siglas (UN, CX, PC).
4. Adicione Fornecedores (opcional).
5. Crie Itens: informe nome, código (opcional), categoria, unidade, fornecedor e estoque mínimo.

### Movimentações
- Na página de Itens, informe uma quantidade e clique Entrada ou Saída.
- Entradas somam ao estoque, Saídas subtraem.
- Toda movimentação é registrada com usuário, data e tipo.

### Relatórios
- Em Movimentos você vê os últimos 100 lançamentos.
- Para relatórios customizados, extraia do banco (tabela `movimentos`).

### Boas práticas
- Mantenha categorias e unidades padronizadas.
- Cadastre estoque mínimo por item para acompanhamento.
- Restrinja contas ADMIN apenas a responsáveis pelo estoque.


