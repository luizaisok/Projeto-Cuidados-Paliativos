const pool = require('../config/db'); // conexão com o banco de dados

// Create
async function createCuidador(id_usuario, nome, sexo, data_nascimento, parentesco_paciente, telefone) {
    const sql = `INSERT INTO cuidadores (id_usuario, nome, sexo, data_nascimento, parentesco_paciente, telefone) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [id_usuario, nome, sexo, data_nascimento, parentesco_paciente, telefone]);
    return `Qtds. linhas afetadas: ${result.affectedRows}; ID:${result.insertId}`;
}

// Read
async function readCuidadores() {
    const [rows] = await pool.query(`SELECT * FROM cuidadores`);
    return rows;
}

// Update
async function updateCuidador(id_cuidador, nome, sexo, data_nascimento, parentesco_paciente, telefone) {
    const sql = `
        UPDATE cuidadores
        SET nome = ?, sexo = ?, data_nascimento = ?, parentesco_paciente = ?, telefone = ?
        WHERE id_cuidador = ?
    `;
    const [result] = await pool.execute(sql, [nome, sexo, data_nascimento, parentesco_paciente, telefone, id_cuidador]);
    return result.affectedRows;
}

// Delete
async function deleteCuidador(id_cuidador) {
    const sql = `DELETE FROM cuidadores WHERE id_cuidador = ?`;
    const [result] = await pool.execute(sql, [id_cuidador]);
    return result.affectedRows;
}

module.exports = { createCuidador, readCuidadores, updateCuidador, deleteCuidador }; // exporta funções
