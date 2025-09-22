-- Schema para MySQL - Controle de Estoque Hospital (insumos de escritório)
-- Assinatura: Hugo Leonardo soluções para sistemas

CREATE DATABASE IF NOT EXISTS `estoque_hospital` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `estoque_hospital`;

-- Tabelas de domínio
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(120) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `unidades` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(80) NOT NULL,
  `sigla` VARCHAR(10) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `fornecedores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `cnpj` VARCHAR(20) NULL,
  `contato` VARCHAR(120) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Usuários e autenticação
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `senha_hash` VARCHAR(255) NOT NULL,
  `perfil` ENUM('ADMIN','OPERADOR') NOT NULL DEFAULT 'OPERADOR',
  `ativo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Itens do estoque
CREATE TABLE IF NOT EXISTS `itens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(200) NOT NULL,
  `codigo` VARCHAR(60) NULL,
  `categoria_id` INT NOT NULL,
  `unidade_id` INT NOT NULL,
  `fornecedor_id` INT NULL,
  `estoque_atual` INT NOT NULL DEFAULT 0,
  `estoque_minimo` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_itens_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_itens_unidade` FOREIGN KEY (`unidade_id`) REFERENCES `unidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_itens_fornecedor` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Movimentações de estoque
CREATE TABLE IF NOT EXISTS `movimentos` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `item_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `tipo` ENUM('ENTRADA','SAIDA') NOT NULL,
  `quantidade` INT NOT NULL,
  `observacao` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mov_item` FOREIGN KEY (`item_id`) REFERENCES `itens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_mov_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Índices úteis
CREATE INDEX `idx_itens_nome` ON `itens`(`nome`);
CREATE INDEX `idx_itens_codigo` ON `itens`(`codigo`);
CREATE INDEX `idx_mov_item_created` ON `movimentos`(`item_id`, `created_at`);

-- Usuário admin inicial (senha: admin123, gere o hash e atualize)
-- Para desenvolvimento, você pode inserir um hash de bcrypt gerado pelo app setup.


