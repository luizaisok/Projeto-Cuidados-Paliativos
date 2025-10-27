-- Objetivo: popular banco a partir de CSVs

USE `cuidados_paliativos_db`;

-- Permite carregar arquivos CSV locais
SET GLOBAL local_infile = 1;
SET SESSION sql_mode = '';

-- SET SESSION character_set_database = utf8mb4;
-- SET SESSION character_set_connection = utf8mb4;
-- SET SESSION character_set_results = utf8mb4;

LOAD DATA LOCAL INFILE 'database/data/usuario.csv'
INTO TABLE usuario
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(tipo_usuario, nome_completo, email, senha_hash, telefone, sexo, estado);

LOAD DATA LOCAL INFILE 'database/data/administrador.csv'
INTO TABLE administrador
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_usuario, nivel_acesso, area_conhecimento);

LOAD DATA LOCAL INFILE 'database/data/paciente.csv'
INTO TABLE paciente
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_usuario, data_nascimento, tipo_sanguineo, condicoes_medicas, medicacoes, contatos_emergencia, unidades_saude);

LOAD DATA LOCAL INFILE 'database/data/acompanhante.csv'
INTO TABLE acompanhante
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_usuario, parentesco);

LOAD DATA LOCAL INFILE 'database/data/vinculo_paciente_acompanhante.csv'
INTO TABLE vinculo_paciente_acompanhante
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_paciente, id_acompanhante);

LOAD DATA LOCAL INFILE 'database/data/conteudo.csv'
INTO TABLE conteudo
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_administrador, titulo, descricao);

LOAD DATA LOCAL INFILE 'database/data/acompanhante.csv'
INTO TABLE sintoma
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(sintomas, tipo_alerta);

LOAD DATA LOCAL INFILE 'database/data/registro_sintoma.csv'
INTO TABLE registro_sintoma
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_paciente, id_usuario, data_registro, intensidade_dor, observacao);

LOAD DATA LOCAL INFILE 'database/data/vinculo_registro_sintoma_sintoma.csv'
INTO TABLE vinculo_registro_sintoma_sintoma
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_registro, id_sintoma);
