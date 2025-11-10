CREATE DATABASE cuidados_paliativos_db;

USE cuidados_paliativos_db;

CREATE TABLE IF NOT EXISTS pacientes (
  id_paciente INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  celular VARCHAR(30) NULL,
  genero VARCHAR(30) NULL,
  data_nascimento DATE NULL,
  estado VARCHAR(2) NULL,
  tipo_sanguineo VARCHAR(3) NULL,
  medicacao TEXT NULL,
  contato_emergencia VARCHAR(255) NULL,
  unidades_de_saude VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS acompanhante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_pessoa VARCHAR(20) NULL,
  nome_completo VARCHAR(120) NULL,
  nome_social VARCHAR(120) NULL,
  idade INT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(30) NULL,
  genero VARCHAR(30) NULL,
  data_nascimento DATE NULL,
  senha VARCHAR(255) NOT NULL,
  relacionamento VARCHAR(60) NULL
);

SELECT * FROM pacientes;

SELECT * FROM acompanhante;

-- DROP DATABASE cuidados_paliativos_db;