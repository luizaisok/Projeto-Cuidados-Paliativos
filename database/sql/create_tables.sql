USE cuidados_paliativos_db;

-- usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash CHAR(64) NOT NULL,
    tipo_usuario ENUM('paciente','cuidador','administrador') NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- pacientes
CREATE TABLE pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    sexo ENUM('M','F','Outro') NOT NULL,
    data_nascimento DATE NOT NULL,
    peso_kg DECIMAL(5,2) NOT NULL,
    altura_cm DECIMAL(5,2) NOT NULL,
    diagnostico_principal VARCHAR(255) NOT NULL,
    estagio_doenca ENUM('Inicial','Intermediário','Avançado','Terminal') NOT NULL,
    nivel_dor TINYINT NOT NULL CHECK (nivel_dor BETWEEN 0 AND 10),
    nivel_conforto TINYINT NOT NULL CHECK (nivel_conforto BETWEEN 0 AND 10),
    uso_morfina BOOLEAN NOT NULL,
    ultima_internacao DATE,
    risco_reinternacao BOOLEAN,
    CONSTRAINT fk_paciente_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- cuidadores
CREATE TABLE cuidadores (
    id_cuidador INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    sexo ENUM('M','F','Outro') NOT NULL,
    data_nascimento DATE NOT NULL,
    parentesco_paciente VARCHAR(50) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    CONSTRAINT fk_cuidador_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- paciente_cuidador (relacionamento N:N entre cuidadores e pacientes)
CREATE TABLE paciente_cuidador (
    id_relacao INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_cuidador INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    responsavel_principal BOOLEAN NOT NULL DEFAULT '0',
    CONSTRAINT fk_relacao_paciente
        FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_relacao_cuidador
        FOREIGN KEY (id_cuidador) REFERENCES cuidadores(id_cuidador)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_relacao UNIQUE (id_paciente, id_cuidador)
) ENGINE=InnoDB;
