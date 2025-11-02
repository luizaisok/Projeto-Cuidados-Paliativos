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
