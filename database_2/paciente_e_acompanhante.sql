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

SELECT * FROM pacientes;

SELECT * FROM acompanhante;

SELECT * FROM acompanhante_paciente;

-- DROP DATABASE cuidados_paliativos_db;
