CREATE DATABASE cuidados_paliativos_db;

USE cuidados_paliativos_db;

CREATE TABLE IF NOT EXISTS pacientes (
  id_paciente INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(120) NULL,
  nome_social VARCHAR(120) NULL,
  celular VARCHAR(30) NULL,
  genero VARCHAR(30) NULL,
  data_nascimento DATE NULL,
  cidade VARCHAR(120) NULL,
  estado VARCHAR(2) NULL,
  tipo_sanguineo VARCHAR(3) NULL,
  condicoes_medicas TEXT NULL,
  medicacao TEXT NULL,
  contato_emergencia  VARCHAR(255) NULL,
  unidades_de_saude VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS acompanhante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nome_completo VARCHAR(120) NULL,
  nome_social VARCHAR(120) NULL,
  telefone VARCHAR(30) NULL,
  genero VARCHAR(30) NULL,
  data_nascimento DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS acompanhante_paciente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  acompanhante_id INT NOT NULL,
  paciente_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unq_acomp_pac (acompanhante_id, paciente_id),
  CONSTRAINT fk_acompanhante
    FOREIGN KEY (acompanhante_id) REFERENCES acompanhante(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_paciente
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id_paciente)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS administrador (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  nome_social VARCHAR(120) NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  data_nascimento DATE NULL,
  genero VARCHAR(30) NULL,
  telefone VARCHAR(30) NULL,
  conselho_profissional VARCHAR(50) NULL,
  formacao VARCHAR(120) NULL,
  registro_profissional VARCHAR(50) NULL,
  especialidade VARCHAR(120) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO administrador (nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade)
VALUES ('Administrador Sistema', 'Admin', 'admin@palivida.com', 'admin123', '1990-01-01', 'Não informado', '(00) 00000-0000', 'N/A', 'Administração', 'N/A', 'Gestão');

CREATE TABLE registro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    intensidade INT NOT NULL
);

CREATE TABLE sintoma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_sintoma VARCHAR(255) NOT NULL
);

INSERT INTO sintoma (nome_sintoma) VALUES
('Dor de cabeça'),
('Náusea'),
('Tontura'),
('Cansaço'),
('Falta de apetite'),
('Insônia'),
('Falta de ar'),
('Febre');

SELECT * FROM pacientes;

SELECT * FROM acompanhante;

SELECT * FROM acompanhante_paciente;

SELECT * FROM administrador;

SELECT * FROM conteudo;

SELECT * FROM registro;

SELECT * FROM sintoma;

-- DROP DATABASE cuidados_paliativos_db;