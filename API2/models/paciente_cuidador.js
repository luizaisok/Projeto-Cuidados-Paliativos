const pool = require('../config/db'); // conexão com o banco de dados

async function createRelacao(id_paciente, id_cuidador, data_inicio, data_fim, responsavel_principal) {
    const sql = `
        INSERT INTO paciente_cuidador (id_paciente, id_cuidador, data_inicio, data_fim, responsavel_principal)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [id_paciente, id_cuidador, data_inicio, data_fim, responsavel_principal]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_relacao: ${result.insertId}`;
}

async function readRelacoes() {
    const [rows] = await pool.query(`SELECT * FROM paciente_cuidador WHERE id_relacao = ?`);
    return rows;
}

async function updateRelacao(id_relacao, data_inicio, data_fim, responsavel_principal) {
    const sql = `
        UPDATE paciente_cuidador
        SET data_inicio = ?, data_fim = ?, responsavel_principal = ?
        WHERE id_relacao = ?
    `;
    const [result] = await pool.execute(sql, [data_inicio, data_fim, responsavel_principal, id_relacao]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_relacao: ${result.insertId}`;
}

async function deleteRelacao(id_relacao) {
    const sql = `DELETE * FROM paciente_cuidador WHERE id_relacao = ?`;
    const [result] = await pool.execute(sql, [id_relacao]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_relacao: ${result.insertId}`;
}

module.exports = { createRelacao, readRelacoes, updateRelacao, deleteRelacao }; // exporta funcionalidades
