/*
// Conexão com o MySQL
const pool = require('./db');

// Seleciona todos os pacientes
async function getPacientes() {
  const [rows] = await pool.query('SELECT * FROM pacientes');
  return rows; // retorna uma "tabela" em forma de lista
}

// Insere novo paciente
async function insertPaciente(
  nome,
  email,
  celular,
  genero,
  data_nascimento,
  estado,
  tipo_sanguineo,
  medicacao,
  contato_emergencia,
  unidades_de_saude
) {
  const sql = `
    INSERT INTO pacientes
    (nome, email, celular, genero, data_nascimento, estado, tipo_sanguineo, medicacao, contato_emergencia, unidades_de_saude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await pool.execute(sql, [
    nome,
    email,
    celular,
    genero,
    data_nascimento,
    estado,
    tipo_sanguineo,
    medicacao,
    contato_emergencia,
    unidades_de_saude
  ]);

  return  result.affectedRows > 0; // retorna true ou false
}

// Atualiza paciente pelo seu ID
async function editPaciente(
  id_paciente,
  nome,
  email,
  celular,
  genero,
  data_nascimento,
  estado,
  tipo_sanguineo,
  medicacao,
  contato_emergencia,
  unidades_de_saude
) {
  const sql = `
    UPDATE pacientes
    SET nome = ?, email = ?, celular = ?, genero = ?, data_nascimento = ?, estado = ?, tipo_sanguineo = ?, medicacao = ?, contato_emergencia = ?, unidades_de_saude = ?
    WHERE id_paciente = ?
  `;

  const [result] = await pool.execute(sql, [
    nome,
    email,
    celular,
    genero,
    data_nascimento,
    estado,
    tipo_sanguineo,
    medicacao,
    contato_emergencia,
    unidades_de_saude,
    id_paciente
  ]);

  return  result.affectedRows > 0;
}

// Deleta paciente pelo seu ID
async function deletePaciente(id_paciente) {
  const sql = `
    DELETE FROM pacientes
    WHERE id_paciente = ?
  `;
  
  const [result] = await pool.execute(sql, [id_paciente]);
  
  return  result.affectedRows > 0;
}

// Exporta CRUD
module.exports = {
  getPacientes,
  insertPaciente,
  editPaciente,
  deletePaciente
};
*/

/*
// Versão padronizada de PacineteDAO.js
const pool = require('./db');

// Lista todos os pacientes
async function getPacientes() {
  const [rows] = await pool.query(`
    SELECT
      id_paciente AS id,
      nome,
      email,
      senha,
      celular,
      genero,
      data_nascimento,
      estado,
      tipo_sanguineo,
      medicacao,
      contato_emergencia,
      unidades_de_saude,
      created_at
    FROM pacientes
    ORDER BY id_paciente DESC
  `);
  return rows;
}

// Busca por ID
async function getPacienteById(id) {
  const [rows] = await pool.execute(`
    SELECT
      id_paciente AS id,
      nome,
      email,
      senha,
      celular,
      genero,
      data_nascimento,
      estado,
      tipo_sanguineo,
      medicacao,
      contato_emergencia,
      unidades_de_saude,
      created_at
    FROM pacientes
    WHERE id_paciente = ?
  `, [id]);
  return rows[0] || null;
}

// Busca por email (para o login)
async function getPacienteByEmail(email) {
  const [rows] = await pool.execute(`
    SELECT 
      id_paciente AS id,
      email,
      senha
    FROM pacientes
    WHERE email = ?
  `, [email]);
  return rows[0] || null;
}

// Insere (retorna insertId)
async function insertPaciente(
  nome,
  email,
  senha,  // obrigatório
  celular,
  genero,
  data_nascimento,
  estado,
  tipo_sanguineo,
  medicacao,
  contato_emergencia,
  unidades_de_saude
) {
  if (!email || !senha) return null;

  const [result] = await pool.execute(`
    INSERT INTO pacientes
      (nome, email, senha, celular, genero, data_nascimento, estado, tipo_sanguineo, medicacao, contato_emergencia, unidades_de_saude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    nome ?? null,
    email,
    senha,
    celular ?? null,
    genero ?? null,
    data_nascimento ?? null,
    estado ?? null,
    tipo_sanguineo ?? null,
    medicacao ?? null,
    contato_emergencia ?? null,
    unidades_de_saude ?? null
  ]);

  return result.insertId || null;
}

// Atualiza, se senha vier null/undefined, mantém a atual.
async function editPaciente(
  id,
  nome,
  email,
  senha, // opcional
  celular,
  genero,
  data_nascimento,
  estado,
  tipo_sanguineo,
  medicacao,
  contato_emergencia,
  unidades_de_saude
) {
  const [result] = await pool.execute(`
    UPDATE pacientes
    SET
      nome = ?,
      email = ?,
      senha = COALESCE(?, senha),
      celular = ?,
      genero = ?,
      data_nascimento = ?,
      estado = ?,
      tipo_sanguineo = ?,
      medicacao = ?,
      contato_emergencia = ?,
      unidades_de_saude = ?
    WHERE id_paciente = ?
  `, [
    nome ?? null,
    email ?? null,
    senha ?? null,
    celular ?? null,
    genero ?? null,
    data_nascimento ?? null,
    estado ?? null,
    tipo_sanguineo ?? null,
    medicacao ?? null,
    contato_emergencia ?? null,
    unidades_de_saude ?? null,
    id
  ]);

  return result.affectedRows > 0;
}

// Deleta (true/false)
async function deletePaciente(id) {
  const [result] = await pool.execute(
    `DELETE FROM pacientes WHERE id_paciente = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getPacientes,
  getPacienteById,
  getPacienteByEmail,
  insertPaciente,
  editPaciente,
  deletePaciente
};
*/

// PacienteDAO.js (compatível com o SQL novo)
const pool = require('./db');

// SELECT * (mapeando nomes do DB -> nomes esperados pelo app)
async function getPacientes() {
  const [rows] = await pool.query(`
    SELECT
      id_paciente AS id,
      nome,
      email,
      senha,
      celular,
      genero,
      data_nascimento,
      estado,
      tipo_sanguineo,
      medicacao,
      contato_emergencia,
      unidades_de_saude,
      created_at
    FROM pacientes
    ORDER BY id_paciente DESC
  `);
  return rows;
}

async function getPacienteById(id) {
  const [rows] = await pool.execute(`
    SELECT
      id_paciente AS id,
      nome,
      email,
      senha,
      celular,
      genero,
      data_nascimento,
      estado,
      tipo_sanguineo,
      medicacao,
      contato_emergencia,
      unidades_de_saude,
      created_at
    FROM pacientes
    WHERE id_paciente = ?
  `, [id]);
  return rows[0] || null;
}

async function getPacienteByEmail(email) {
  const [rows] = await pool.execute(`
    SELECT
      id_paciente AS id,
      email,
      senha
    FROM pacientes
    WHERE email = ?
  `, [email]);
  return rows[0] || null;
}

// INSERT (recebe 'celular' no app e grava em 'telefone' no DB)
async function insertPaciente(
  nome,
  email,
  senha,
  celular,
  genero,
  data_nascimento,
  estado,
  tipo_sanguineo,
  medicacao,
  contato_emergencia,
  unidades_de_saude
) {
  if (!email || !senha) return null;

  const [result] = await pool.execute(`
    INSERT INTO pacientes
      (nome, email, senha, celular, genero, data_nascimento, estado, tipo_sanguineo, medicacao, contato_emergencia, unidades_de_saude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    nome ?? null,
    email,
    senha,
    celular ?? null,
    genero ?? null,
    data_nascimento ?? null,
    estado ?? null,
    tipo_sanguineo ?? null,
    medicacao ?? null,
    contato_emergencia ?? null,
    unidades_de_saude ?? null
  ]);

  return result.insertId || null;
}

// UPDATE (COALESCE na senha; e mapeia campos)
async function editPaciente(
  id,
  nome,
  email,
  senha, // opcional
  celular,
  genero,
  data_nascimento,
  estado,
  tipo_sanguineo,
  medicacao,
  contato_emergencia,
  unidades_de_saude
) {
  const [result] = await pool.execute(`
    UPDATE pacientes
    SET
      nome = ?,
      email = ?,
      senha = COALESCE(?, senha),
      celular = ?,
      genero = ?,
      data_nascimento = ?,
      estado = ?,
      tipo_sanguineo = ?,
      medicacao = ?,
      contato_emergencia = ?,
      unidades_de_saude = ?
    WHERE id_paciente = ?
  `, [
    nome ?? null,
    email ?? null,
    senha ?? null,
    celular ?? null,
    genero ?? null,
    data_nascimento ?? null,
    estado ?? null,
    tipo_sanguineo ?? null,
    medicacao ?? null,
    contato_emergencia ?? null,
    unidades_de_saude ?? null,
    id
  ]);

  return result.affectedRows > 0;
}

async function deletePaciente(id) {
  const [result] = await pool.execute(`DELETE FROM pacientes WHERE id_paciente = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getPacientes,
  getPacienteById,
  getPacienteByEmail,
  insertPaciente,
  editPaciente,
  deletePaciente
};

