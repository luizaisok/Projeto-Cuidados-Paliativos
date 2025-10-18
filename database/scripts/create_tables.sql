-- Objetivo: Criar as tabelas do sistema de pacientes

USE `cuidados_paliativos_db`;

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario ENUM('PACIENTE', 'ACOMPANHANTE', 'ADMINISTRADOR') NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    sexo ENUM ('MASCULINO', 'FEMININO', 'OUTRO') NOT NULL,
    estado ENUM(
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ) NOT NULL
);

CREATE TABLE IF NOT EXISTS administrador (
    id_administrador INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nivel_acesso ENUM('BASICO', 'INTERMEDIARIO', 'AVANCADO') NOT NULL,
    area_conhecimento VARCHAR(100),
    CONSTRAINT fk_administrador_id_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS paciente (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    data_nascimento DATE NULL,
    tipo_sanguineo ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    condicoes_medicas JSON NOT NULL,
    medicacoes JSON NOT NULL,
    contatos_emergencia JSON NOT NULL,
    unidades_saude JSON NOT NULL,
    CONSTRAINT fk_paciente_id_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS acompanhante (
    id_acompanhante INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    parentesco ENUM(
        'PAI',
        'MAE',
        'FILHO',
        'FILHA',
        'IRMAO',
        'IRMA',
        'TIO',
        'TIA',
        'AVO',
        'PRIMO',
        'PRIMA',
        'SOGRO',
        'SOGRA',
        'GENRO',
        'NORA',
        'CONJUGE',
        'AMIGO',
        'VIZINHO',
        'CUIDADOR',
        'OUTRO'
    ) DEFAULT 'CUIDADOR',
    CONSTRAINT fk_acompanhante_id_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS vinculo_paciente_acompanhante (
    id_vinculo_pa INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_acompanhante INT NOT NULL,
    CONSTRAINT fk_vinculo_paciente_acompanhante_id_paciente
        FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_vinculo_paciente_acompanhante_id_acompanhante
        FOREIGN KEY (id_acompanhante) REFERENCES acompanhante(id_acompanhante)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS conteudo (
    id_conteudo INT AUTO_INCREMENT PRIMARY KEY,
    id_administrador INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    CONSTRAINT fk_conteudo_id_administrador
        FOREIGN KEY (id_administrador) REFERENCES administrador(id_administrador)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS sintoma (
    id_sintoma INT AUTO_INCREMENT PRIMARY KEY,
    sintomas JSON NOT NULL,
    tipo_alerta ENUM('VERDE', 'AMARELO', 'VERMELHO') NOT NULL
);

CREATE TABLE IF NOT EXISTS vinculo_paciente_sintoma (
    id_vinculo_ps INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_sintoma INT NOT NULL,
    CONSTRAINT fk_vinculo_paciente_sintoma_id_paciente
        FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_vinculo_paciente_sintoma_id_sintoma
        FOREIGN KEY (id_sintoma) REFERENCES sintoma(id_sintoma)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
