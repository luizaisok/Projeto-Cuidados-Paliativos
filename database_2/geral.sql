create DATABASE cuidados_paliativos_db

create table conteudo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    texto VARCHAR(150) NOT NULL,
    data_post DATE
)

INSERT INTO cuidados_paliativos (titulo, descricao, texto, data_post) VALUES
('Dor Crônica em Cuidados Paliativos', 'Reconhecendo a dor persistente', 'A dor é um dos sintomas mais comuns e deve ser avaliada de forma contínua.', '2025-10-01'),
('Fadiga Intensa no Paciente Terminal', 'Identificando sinais de esgotamento', 'A fadiga pode afetar a qualidade de vida e requer manejo multidisciplinar.', '2025-09-18'),
('Falta de Apetite e Perda de Peso', 'Anorexia e caquexia em estágios avançados', 'Esses sintomas são frequentes e demandam suporte nutricional adequado.', '2025-09-05'),
('Dispneia e Dificuldade para Respirar', 'Sinais de desconforto respiratório', 'A sensação de falta de ar é comum e pode ser aliviada com oxigênio e posicionamento adequado.', '2025-08-20'),
('Ansiedade e Angústia Emocional', 'Aspectos psicológicos do paciente', 'O apoio emocional e espiritual é essencial no manejo paliativo.', '2025-08-01'),
('Náuseas e Vômitos em Cuidados Paliativos', 'Identificando causas e controle', 'Podem estar relacionados a medicamentos ou à progressão da doença.', '2025-07-15'),
('Confusão Mental e Delirium', 'Alterações cognitivas frequentes', 'É importante identificar causas reversíveis e oferecer ambiente calmo e seguro.', '2025-07-02'),
('Insônia e Distúrbios do Sono', 'Impactos na qualidade de vida', 'A falta de sono pode agravar sintomas físicos e emocionais.', '2025-06-25'),
('Feridas e Lesões de Pele', 'Cuidados com integridade cutânea', 'As lesões exigem manejo adequado para evitar dor e infecção.', '2025-06-10'),
('Comunicação com a Família', 'Reconhecendo sinais de sofrimento familiar', 'A equipe deve apoiar e orientar familiares sobre o processo de fim de vida.', '2025-05-30');

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