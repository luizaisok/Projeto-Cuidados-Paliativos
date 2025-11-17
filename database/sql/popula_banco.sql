USE cuidados_paliativos_db;

SET NAMES utf8mb4;

-- Inserir administrador
-- INSERT INTO administrador (nome, email, senha)
-- VALUES ('Maicon', 'adm@email.com', 'adm1234');

-- Carregar pacientes
LOAD DATA LOCAL INFILE '../data/pacientes.csv'
INTO TABLE pacientes
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(email, senha, nome, nome_social, celular, genero, data_nascimento, cidade, estado, 
 tipo_sanguineo, condicoes_medicas, medicacao, contato_emergencia, unidades_de_saude);

-- Carregar acompanhantes
LOAD DATA LOCAL INFILE '../data/acompanhantes.csv'
INTO TABLE acompanhante
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(email, senha, nome_completo, nome_social, telefone, genero, data_nascimento);

-- Carregar vínculos
LOAD DATA LOCAL INFILE '../data/acompanhante_paciente.csv'
INTO TABLE acompanhante_paciente
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(acompanhante_id, paciente_id);

-- Carregar conteúdo
LOAD DATA LOCAL INFILE '../data/conteudo.csv'
INTO TABLE conteudo
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(titulo, descricao, texto, data_post, sinaisSintomas, sinaisAlerta);

-- Carregar sintomas
LOAD DATA LOCAL INFILE '../data/sintomas.csv'
INTO TABLE sintoma
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(nome_sintoma);
