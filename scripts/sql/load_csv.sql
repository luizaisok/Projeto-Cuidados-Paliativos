USE cuidados_paliativos_db;

-- usuarios
LOAD DATA LOCAL INFILE '../csv/usuarios.csv'
INTO TABLE usuarios
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_usuario,email,senha_hash,tipo_usuario,data_cadastro);

-- cuidadores
LOAD DATA LOCAL INFILE '../csv/cuidadores.csv'
INTO TABLE cuidadores
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_cuidador,id_usuario,nome,sexo,data_nascimento,parentesco_paciente,telefone);

-- pacientes
LOAD DATA LOCAL INFILE '../csv/pacientes.csv'
INTO TABLE pacientes
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_paciente,id_usuario,nome,sexo,data_nascimento,peso_kg,altura_cm,
diagnostico_principal,estagio_doenca,nivel_dor,nivel_conforto,
uso_morfina,ultima_internacao,risco_reinternacao);

-- paciente_cuidador (relacionamento N:N entre cuidadores e pacientes)
LOAD DATA LOCAL INFILE '../csv/paciente_cuidador.csv'
INTO TABLE paciente_cuidador
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_relacao,id_paciente,id_cuidador,data_inicio,data_fim,responsavel_principal);
