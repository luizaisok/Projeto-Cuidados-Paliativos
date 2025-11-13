create DATABASE cuidados_paliativos_db

create table conteudo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    texto VARCHAR(150) NOT NULL,
    data_post DATE,
    SinaisSintomas VARCHAR(150),
    SinaisAlerta VARCHAR(150)
)

INSERT INTO conteudo (titulo, descricao, texto, data_post, sinaisSintomas, sinaisAlerta) VALUES
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

CREATE TABLE administrador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nome_social VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    genero VARCHAR(50) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    conselho_profissional VARCHAR(100) NOT NULL,
    formacao VARCHAR(255) NOT NULL,
    registro_profissional VARCHAR(100) NOT NULL,
    especialidade VARCHAR(255) NOT NULL
);

INSERT INTO administrador 
(nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade)
VALUES
('Maria Clara Silva', 'Clara Silva', 'clara.silva@example.com', 'senha123', '1990-05-12', 'Feminino', '11987654321', 'COREN', 'Enfermagem', '123456-ENF', 'Cuidados Paliativos'),
('João Pedro Santos', 'JP Santos', 'joao.santos@example.com', 'senha456', '1988-02-20', 'Masculino', '11999998888', 'CRM', 'Medicina', '432198-MED', 'Medicina Paliativa'),
('Aline Rodrigues', 'Aline R.', 'aline.rodrigues@example.com', 'senha789', '1995-11-03', 'Feminino', '11912233445', 'CRP', 'Psicologia', '987654-PSI', 'Psicologia Hospitalar'),
('Fernando Lima', 'Fernando L.', 'fernando.lima@example.com', 'admin123', '1982-08-17', 'Masculino', '11977776666', 'CREFITO', 'Fisioterapia', '556677-FIS', 'Reabilitação em Pacientes Terminais'),
('Beatriz Moura', 'Bia Moura', 'beatriz.moura@example.com', 'pass1234', '1993-03-29', 'Feminino', '11933334444', 'CRN', 'Nutrição', '889900-NUT', 'Nutrição em Cuidados Paliativos');

CREATE TABLE registro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_registro DATETIME DEFAULT CURRENT_TIME,
    intensidade INT NOT NULL
);

INSERT INTO registro (data_registro, intensidade) VALUES
('2025-11-12 08:30:00', 3),
('2025-11-12 12:15:00', 5),
('2025-11-13 09:00:00', 2),
('2025-11-13 18:45:00', 7),
('2025-11-14 10:20:00', 6),
('2025-11-14 15:40:00', 4),
('2025-11-15 07:55:00', 8),
('2025-11-15 20:10:00', 1);

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
