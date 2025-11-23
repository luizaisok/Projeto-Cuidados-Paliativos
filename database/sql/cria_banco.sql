CREATE DATABASE IF NOT EXISTS cuidados_paliativos_db
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE cuidados_paliativos_db;

SET NAMES utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS acompanhante_paciente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  acompanhante_id INT NOT NULL,
  paciente_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unq_acomp_pac (acompanhante_id, paciente_id),
  CONSTRAINT fk_vinculo_acompanhante
    FOREIGN KEY (acompanhante_id) REFERENCES acompanhante(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_vinculo_paciente
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id_paciente)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE conteudo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    texto VARCHAR(150) NOT NULL,
    data_post DATE,
    SinaisSintomas VARCHAR(150),
    SinaisAlerta VARCHAR(150)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sintoma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_sintoma VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE registro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    sintoma_id INT NOT NULL,
    intensidade INT,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (paciente_id) REFERENCES pacientes(id_paciente) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sintoma_id) REFERENCES sintoma(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;