const pool = require('./db');

// cria vínculo acompanhante ↔ paciente
async function linkAcompanhantePaciente(acompanhante_id, paciente_id) {
  const [r] = await pool.execute(
    `INSERT IGNORE INTO acompanhante_paciente (acompanhante_id, paciente_id) VALUES (?, ?)`,
    [acompanhante_id, paciente_id]
  );
  return r.affectedRows > 0;
}

// remove vínculo
async function unlinkAcompanhantePaciente(acompanhante_id, paciente_id) {
  const [r] = await pool.execute(
    `DELETE FROM acompanhante_paciente WHERE acompanhante_id = ? AND paciente_id = ?`,
    [acompanhante_id, paciente_id]
  );
  return r.affectedRows > 0;
}

// lista pacientes de um acompanhante
async function getPacientesDoAcompanhante(acompanhante_id) {
  const [rows] = await pool.query(
    `SELECT p.id_paciente AS id, p.nome, p.email
       FROM acompanhante_paciente ap
       JOIN pacientes p ON p.id_paciente = ap.paciente_id
      WHERE ap.acompanhante_id = ?
      ORDER BY p.id_paciente DESC`,
    [acompanhante_id]
  );
  return rows;
}

// lista acompanhantes de um paciente (útil p/ adm)
async function getAcompanhantesDoPaciente(paciente_id) {
  const [rows] = await pool.query(
    `SELECT a.id, a.nome_completo, a.email
       FROM acompanhante_paciente ap
       JOIN acompanhante a ON a.id = ap.acompanhante_id
      WHERE ap.paciente_id = ?
      ORDER BY a.id DESC`,
    [paciente_id]
  );
  return rows;
}

module.exports = {
  linkAcompanhantePaciente,
  unlinkAcompanhantePaciente,
  getPacientesDoAcompanhante,
  getAcompanhantesDoPaciente
};
