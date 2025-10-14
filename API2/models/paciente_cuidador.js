const pool = require('../config/db'); // conexão com o banco de dados

async function createRelacao(id_paciente, id_cuidador, data_inicio, data_fim, responsavel_principal) {
    const sql = `
        INSERT INTO paciente_cuidador (id_paciente, id_cuidador, data_inicio, data_fim, responsavel_principal)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [id_paciente, id_cuidador, data_inicio, data_fim, responsavel_principal]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_relacao: ${result.insertId}`;
}

async function readRelacoes(id_relacao = null) {
    if (id_relacao) {
        const sql = `SELECT * FROM paciente_cuidador WHERE id_relacao = ?`;
        const [rows] = await pool.execute(sql, [id_relacao]);
    return rows;
    } else {
        const [rows] = await pool.query(`SELECT * FROM paciente_cuidador`);
        return rows;
    }
} // arrumado 2.0!

// async function readRelacoes(id_relacao) {
//     const sql = `SELECT * FROM paciente_cuidador WHERE id_relacao = ?`;
//     const [rows] = await pool.execute(sql, [id_relacao]);
//     return rows;
// } // arrumado!

async function updateRelacao(id_relacao, data_inicio, data_fim, responsavel_principal) {
    const sql = `
        UPDATE paciente_cuidador
        SET data_inicio = ?, data_fim = ?, responsavel_principal = ?
        WHERE id_relacao = ?
    `;
    const [result] = await pool.execute(sql, [data_inicio, data_fim, responsavel_principal, id_relacao]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_relacao: ${id_relacao}`;
}

async function deleteRelacao(id_relacao) {
    const sql = `DELETE FROM paciente_cuidador WHERE id_relacao = ?`;
    const [result] = await pool.execute(sql, [id_relacao]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_relacao: ${id_relacao}`;
} // arrumado!

module.exports = { createRelacao, readRelacoes, updateRelacao, deleteRelacao }; // exporta funcionalidades
