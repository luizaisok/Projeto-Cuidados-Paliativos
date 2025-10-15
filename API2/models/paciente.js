const pool = require('../config/db'); // conexão com o banco de dados

async function createPaciente(
    id_usuario, nome, sexo, data_nascimento, peso_kg, altura_cm, diagnostico_principal,
    estagio_doenca, nivel_dor, nivel_conforto, uso_morfina, ultima_internacao, risco_reinternacao
) {
    const sql = `
        INSERT INTO pacientes 
        (id_usuario, nome, sexo, data_nascimento, peso_kg, altura_cm, diagnostico_principal, estagio_doenca,
         nivel_dor, nivel_conforto, uso_morfina, ultima_internacao, risco_reinternacao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
        id_usuario, nome, sexo, data_nascimento, peso_kg, altura_cm, diagnostico_principal,
        estagio_doenca, nivel_dor, nivel_conforto, uso_morfina, ultima_internacao, risco_reinternacao
    ]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_paciente: ${result.insertId}`;
}

async function readPacientes(id_paciente = null) {
   if (id_paciente) { // testando alteração de id_relacao => id_paciente
        const sql = `SELECT * FROM pacientes WHERE id_paciente = ?`;
        const [rows] = await pool.execute(sql, [id_paciente]); 
        return rows;
    } else {
        const [rows] = await pool.query(`SELECT * FROM pacientes`);
        return rows;
    }
} // arrumado 2.0!

// async function readPacientes(id_paciente) {
//     const sql = `SELECT * FROM pacientes WHERE id_paciente = ?`;
//     const [rows] = await pool.execute(sql, [id_paciente]); 
//     return rows;
// } // arrumado!

async function updatePaciente(
    id_paciente, nome, sexo, data_nascimento, peso_kg, altura_cm, diagnostico_principal,
    estagio_doenca, nivel_dor, nivel_conforto, uso_morfina, ultima_internacao, risco_reinternacao
) {
    const sql = `
        UPDATE pacientes
        SET nome = ?, sexo = ?, data_nascimento = ?, peso_kg = ?, altura_cm = ?, diagnostico_principal = ?,
            estagio_doenca = ?, nivel_dor = ?, nivel_conforto = ?, uso_morfina = ?, ultima_internacao = ?, risco_reinternacao = ?
        WHERE id_paciente = ?
    `;
    const [result] = await pool.execute(sql, [
        nome, sexo, data_nascimento, peso_kg, altura_cm, diagnostico_principal,
        estagio_doenca, nivel_dor, nivel_conforto, uso_morfina, ultima_internacao, risco_reinternacao,
        id_paciente
    ]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_paciente: ${id_paciente}`;
}

async function deletePaciente(id_paciente) {
    const sql = `DELETE FROM pacientes WHERE id_paciente = ?`;
    const [result] = await pool.execute(sql, [id_paciente]);
    return `Qtds de linhas afetadas: ${result.affectedRows} | ID_paciente: ${id_paciente}`;
} // arrumado!

module.exports = { createPaciente, readPacientes, updatePaciente, deletePaciente }; // exporta as funcionalidades
