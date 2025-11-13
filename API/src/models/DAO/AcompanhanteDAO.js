/*
const { createConnection } = require('./db');

async function getAcompanhantes(){
    const connection = await createConnection();
    const [rows] = await connection.query("SELECT * FROM acompanhante ORDER BY nome_completo");

    return rows;
};

async function insertAcompanhante(tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento){
    const connection = await createConnection();
    if (tipo_pessoa && nome_completo && nome_social && idade && email && telefone && genero && data_nascimento && senha && relacionamento) {
        const [result] = await connection.query(`
            INSERT INTO acompanhante(tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento]
        );

        if(result.affectedRows > 0){
            return true;
        }

        return false;
    }
    console.error("Falha ao inserir acompanhante, faltou algum dado");
    return false;
};

async function editAcompanhante(id, tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, confirmacao_senha, relacionamento){

    const connection = await createConnection();
    if(!id || !tipo_pessoa || !nome_completo || !nome_social || !idade || !email || !telefone || !genero || !data_nascimento || !senha || !confirmacao_senha || !relacionamento){
        console.error("Falha ao editar acompanhante, faltou algum dado.");
        return false;
    }

    if(senha !== confirmacao_senha){
        console.error("Senha e confirmação de senha não conferem.");
        return false;
    }

    const [result] = await connection.query(
        `UPDATE acompanhante
        SET tipo_pessoa = ?,
            nome_completo = ?,
            nome_social = ?,
            idade = ?,
            email = ?,
            telefone = ?,
            genero = ?,
            data_nascimento = ?,
            senha = ?,
            relacionamento = ?
        WHERE id = ?`, [tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento, id]
    );

    if(result.affectedRows === 0) return false;
    return true;
}

async function deleteAcompanhante(id){
    if(id){
        const connection = await createConnection();
        const [result] = await connection.query(`
            DELETE FROM acompanhante
            WHERE id = ?`,
            [id]
        );

        if(result.affectedRows === 0) return false;
        return true;
    }
    console.error("Falha ao remover o acompanhante!");
    return false;
}

module.exports = {getAcompanhantes, insertAcompanhante, editAcompanhante, deleteAcompanhante};
*/

/*
// Versão padronizada de AcompanhanteDAO.js
const pool = require('./db');

// Lista todos os acompanhantes
async function getAcompanhantes(){
  const [rows] = await pool.query(`
    SELECT
      id AS id,
      tipo_pessoa,
      nome_completo,
      nome_social,
      idade,
      email,
      telefone,
      genero,
      data_nascimento,
      senha,
      relacionamento,
      created_at
    FROM acompanhante
    ORDER BY id DESC
  `);
  return rows;
}

// Busca por ID
async function getAcompanhanteById(id){
  const [rows] = await pool.execute(`
    SELECT
      id AS id,
      tipo_pessoa,
      nome_completo,
      nome_social,
      idade,
      email,
      telefone,
      genero,
      data_nascimento,
      senha,
      relacionamento,
      created_at
    FROM acompanhante
    WHERE id = ?
  `, [id]);
  return rows[0] || null;
}

// Busca por email (para o login)
async function getAcompanhanteByEmail(email){
  const [rows] = await pool.execute(`
    SELECT id AS id, email, senha
    FROM acompanhante
    WHERE email = ?
  `, [email]);
  return rows[0] || null;
}

// Insere (retorna insertId)
async function insertAcompanhante(
  tipo_pessoa,
  nome_completo,
  nome_social,
  idade,
  email,
  telefone,
  genero,
  data_nascimento,
  senha,          // obrigatório
  relacionamento
){
  if (!email || !senha) return null;

  const [result] = await pool.execute(`
    INSERT INTO acompanhante
      (tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    tipo_pessoa ?? null,
    nome_completo ?? null,
    nome_social ?? null,
    idade ?? null,
    email,
    telefone ?? null,
    genero ?? null,
    data_nascimento ?? null,
    senha,
    relacionamento ?? null
  ]);

  return result.insertId || null;
}

// Atualiza, se senha vier null/undefined, mantém a atual.
async function editAcompanhante(
  id,
  tipo_pessoa,
  nome_completo,
  nome_social,
  idade,
  email,
  telefone,
  genero,
  data_nascimento,
  senha, // opcional
  relacionamento
){
  const [result] = await pool.execute(`
    UPDATE acompanhante
    SET
      tipo_pessoa = ?,
      nome_completo = ?,
      nome_social = ?,
      idade = ?,
      email = ?,
      telefone = ?,
      genero = ?,
      data_nascimento = ?,
      senha = COALESCE(?, senha),
      relacionamento = ?
    WHERE id = ?
  `, [
    tipo_pessoa ?? null,
    nome_completo ?? null,
    nome_social ?? null,
    idade ?? null,
    email ?? null,
    telefone ?? null,
    genero ?? null,
    data_nascimento ?? null,
    senha ?? null,
    relacionamento ?? null,
    id
  ]);

  return result.affectedRows > 0;
}

// Deleta
async function deleteAcompanhante(id){
  const [result] = await pool.execute(
    `DELETE FROM acompanhante WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getAcompanhantes,
  getAcompanhanteById,
  getAcompanhanteByEmail,
  insertAcompanhante,
  editAcompanhante,
  deleteAcompanhante
};
*/

// AcompanhanteDAO.js (compatível com o SQL novo)
const pool = require('./db');

// Lista todos
async function getAcompanhantes() {
  const [rows] = await pool.query(`
    SELECT
      id,
      email,
      senha,
      nome_completo,
      nome_social,
      telefone,
      genero,
      data_nascimento,
      created_at
    FROM acompanhante
    ORDER BY id DESC
  `);
  return rows;
}

async function getAcompanhanteById(id) {
  const [rows] = await pool.execute(`
    SELECT
      id,
      email,
      senha,
      nome_completo,
      nome_social,
      telefone,
      genero,
      data_nascimento,
      created_at
    FROM acompanhante
    WHERE id = ?
  `, [id]);
  return rows[0] || null;
}

async function getAcompanhanteByEmail(email) {
  const [rows] = await pool.execute(`
    SELECT id, email, senha
    FROM acompanhante
    WHERE email = ?
  `, [email]);
  return rows[0] || null;
}

// INSERT
async function insertAcompanhante(
  nome_completo,
  nome_social,
  email,
  senha,            // obrigatório
  telefone,
  genero,
  data_nascimento
) {
  if (!email || !senha) return null;

  const [result] = await pool.execute(`
    INSERT INTO acompanhante
      (email, senha, nome_completo, nome_social, telefone, genero, data_nascimento)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    email,
    senha,
    nome_completo ?? null,
    nome_social ?? null,
    telefone ?? null,
    genero ?? null,
    data_nascimento ?? null
  ]);

  return result.insertId || null;
}

// UPDATE
async function editAcompanhante(
  id,
  email,
  senha,
  nome_completo,
  nome_social,
  telefone,
  genero,
  data_nascimento
) {
  const sql = `
    UPDATE acompanhante
    SET
      email = COALESCE(?, email),
      senha = COALESCE(?, senha),
      nome_completo = COALESCE(?, nome_completo),
      nome_social = COALESCE(?, nome_social),
      telefone = COALESCE(?, telefone),
      genero = COALESCE(?, genero),
      data_nascimento = COALESCE(?, data_nascimento)
    WHERE id = ?
  `;
  const params = [
    email ?? null,
    senha ?? null,
    nome_completo ?? null,
    nome_social ?? null,
    telefone ?? null,
    genero ?? null,
    data_nascimento ?? null,
    id
  ];
  const [result] = await pool.execute(sql, params);
  return result.affectedRows > 0;
}

async function deleteAcompanhante(id) {
  const [result] = await pool.execute(`DELETE FROM acompanhante WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAcompanhantes,
  getAcompanhanteById,
  getAcompanhanteByEmail,
  insertAcompanhante,
  editAcompanhante,
  deleteAcompanhante
};

