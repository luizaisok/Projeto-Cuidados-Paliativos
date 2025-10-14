const pool = require('../config/db'); // conexão com o banco de dados

async function createCuidador(id_usuario, nome, sexo, data_nascimento, parentesco_paciente, telefone) {
    const sql = `INSERT INTO cuidadores (id_usuario, nome, sexo, data_nascimento, parentesco_paciente, telefone) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [id_usuario, nome, sexo, data_nascimento, parentesco_paciente, telefone]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_cuidador: ${result.insertId}`;
}

async function readCuidadores(id_cuidador = null) {
    if (id_cuidador) {
        const sql = `SELECT * FROM cuidadores WHERE id_cuidador = ?`;
        const [rows] = await pool.execute(sql, [id_cuidador]);
        return rows;
    } else {
        const [rows] = await pool.query(`SELECT * FROM cuidadores`);
        return rows;
    }
}

async function updateCuidador(id_cuidador, nome, sexo, data_nascimento, parentesco_paciente, telefone) {
    const sql = `
        UPDATE cuidadores
        SET nome = ?, sexo = ?, data_nascimento = ?, parentesco_paciente = ?, telefone = ?
        WHERE id_cuidador = ?
    `;
    const [result] = await pool.execute(sql, [nome, sexo, data_nascimento, parentesco_paciente, telefone, id_cuidador]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_cuidador: ${id_cuidador}`;
}

async function deleteCuidador(id_cuidador) {
    const sql = `DELETE FROM cuidadores WHERE id_cuidador = ?`;
    const [result] = await pool.execute(sql, [id_cuidador]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_cuidador: ${id_cuidador}`;
}

module.exports = { createCuidador, readCuidadores, updateCuidador, deleteCuidador }; // exporta funcionalidades