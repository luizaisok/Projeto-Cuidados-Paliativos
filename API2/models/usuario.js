const pool = require('../config/db'); // conexão com o banco de dados

async function createUsuario(email, senha_hash, tipo_usuario) { // id_usuario e data_cadastro são preenchidos automaticamente
    const sql = `INSERT INTO usuarios (email, senha_hash, tipo_usuario) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(sql, [email, senha_hash, tipo_usuario]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_usuario: ${result.insertId}`; 
}

async function readUsuarios(id_usuario) {
    const sql = `SELECT * FROM usuarios WHERE id_usuario = ?`
    const [rows] = await pool.execute(sql, [id_usuario]);
    return rows;
}

async function updateUsuario(id_usuario, email, senha_hash, tipo_usuario) {
    const sql = `UPDATE usuarios SET email = ?, senha_hash = ?, tipo_usuario = ? WHERE id_usuario = ?`;
    const [result] = await pool.execute(sql, [email, senha_hash, tipo_usuario, id_usuario]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_usuario: ${result.insertId}`;
}

async function deleteUsuario(id_usuario) {
    const sql = `DELETE * FROM usuarios WHERE id_usuario = ?`;
    const [result] = await pool.execute(sql, [id_usuario]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_usuario: ${result.insertId}`;
}

module.exports = { createUsuario, readUsuarios, updateUsuario, deleteUsuario }; // exporta as funcionalidades
