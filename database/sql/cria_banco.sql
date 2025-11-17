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
  CONSTRAINT fk_vinculo_acompanhante
    FOREIGN KEY (acompanhante_id) REFERENCES acompanhante(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_vinculo_paciente
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id_paciente)
    ON DELETE CASCADE
    ON UPDATE CASCADE
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

INSERT INTO administrador (nome, email, senha)
VALUES ('Maicon', 'adm@email.com', 'adm1234');

create table conteudo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    texto VARCHAR(150) NOT NULL,
    data_post DATE,
    SinaisSintomas VARCHAR(150),
    SinaisAlerta VARCHAR(150)
)

INSERT INTO conteudo (titulo, descricao, texto, data_post, sinaisSintomas, sinaisAlerta)
VALUES
  ('Dor Crônica em Cuidados Paliativos', 'Reconhecendo a dor persistente', 'A dor é um dos sintomas mais comuns e deve ser avaliada de forma contínua.', '2025-10-01', 'Dor contínua, limitação de movimento', 'Dor súbita intensa, perda de consciência'),
  ('Fadiga Intensa no Paciente Terminal', 'Identificando sinais de esgotamento', 'A fadiga pode afetar a qualidade de vida e requer manejo multidisciplinar.', '2025-09-18', 'Cansaço extremo, fraqueza', 'Incapacidade de realizar atividades básicas'),
  ('Falta de Apetite e Perda de Peso', 'Anorexia e caquexia em estágios avançados', 'Esses sintomas são frequentes e demandam suporte nutricional adequado.', '2025-09-05', 'Apetite reduzido, emagrecimento', 'Perda de peso acelerada, desidratação'),
  ('Dispneia e Dificuldade para Respirar', 'Sinais de desconforto respiratório', 'A sensação de falta de ar é comum e pode ser aliviada com oxigênio e posicionamento adequado.', '2025-08-20', 'Falta de ar leve, respiração acelerada', 'Cianose, respiração muito dificultada'),
  ('Ansiedade e Angústia Emocional', 'Aspectos psicológicos do paciente', 'O apoio emocional e espiritual é essencial no manejo paliativo.', '2025-08-01', 'Preocupação constante, inquietação', 'Crises de pânico, agitação grave'),
  ('Náuseas e Vômitos em Cuidados Paliativos', 'Identificando causas e controle', 'Podem estar relacionados a medicamentos ou à progressão da doença.', '2025-07-15', 'Enjoo, mal-estar', 'Vômitos persistentes, sinais de desidratação'),
  ('Confusão Mental e Delirium', 'Alterações cognitivas frequentes', 'É importante identificar causas reversíveis e oferecer ambiente calmo e seguro.', '2025-07-02', 'Desorientação leve, lapsos de memória', 'Alucinações, agitação intensa'),
  ('Insônia e Distúrbios do Sono', 'Impactos na qualidade de vida', 'A falta de sono pode agravar sintomas físicos e emocionais.', '2025-06-25', 'Dificuldade para dormir, despertares frequentes', 'Vigília prolongada, exaustão intensa'),
  ('Feridas e Lesões de Pele', 'Cuidados com integridade cutânea', 'As lesões exigem manejo adequado para evitar dor e infecção.', '2025-06-10', 'Vermelhidão, dor localizada', 'Infecção, mau odor, secreção'),
  ('Comunicação com a Família', 'Reconhecendo sinais de sofrimento familiar', 'A equipe deve apoiar e orientar familiares sobre o processo de fim de vida.', '2025-05-30', 'Tristeza, preocupação', 'Conflitos graves, desesperação');


CREATE TABLE sintoma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_sintoma VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sintoma (nome_sintoma) 
VALUES
  ('Dor de cabeça'),
  ('Náusea'),
  ('Tontura'),
  ('Cansaço'),
  ('Falta de apetite'),
  ('Insônia'),
  ('Falta de ar'),
  ('Febre');

CREATE TABLE registro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    intensidade INT NOT NULL
);

SELECT * FROM pacientes;

SELECT * FROM acompanhante;

SELECT * FROM acompanhante_paciente;

SELECT * FROM administrador;

SELECT * FROM conteudo;

SELECT * FROM registro;

SELECT * FROM sintoma;

-- DROP DATABASE cuidados_paliativos_db;