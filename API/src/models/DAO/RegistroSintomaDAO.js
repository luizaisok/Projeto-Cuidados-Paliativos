const pool = require('./db');

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function getRegistro() {
  const [rows] = await pool.query("SELECT * FROM registro");
  return rows;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function insertRegistro(paciente_id, sintoma_id, intensidade) {

  try {
    const [result] = await pool.query(
      `INSERT INTO registro (paciente_id, sintoma_id, intensidade)
       VALUES (?, ?, ?)`,
      [paciente_id, sintoma_id, intensidade]
    );

    return result.affectedRows > 0;

  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      console.error("Erro de FK: paciente ou sintoma inexistente.");
    } else {
      console.error("Erro no insert:", err);
    }

    return false;
  }
}

/*async function insertRegistro(intensidade) {
  if ( intensidade) {
    const [result] = await pool.query(
      `INSERT INTO registro (intensidade)
       VALUES (?)`,
      [intensidade]
    );

    return result.affectedRows > 0;
  }

  console.error("Falha ao criar o registro do sintoma. Faltou algum dado");
  return false;
}
*/
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function editRegistro(id, intensidade) {
  if (id && intensidade) {
    const [result] = await pool.query(
      `UPDATE registro
       SET data_registro = NOW(), intensidade = ?
       WHERE id = ?`,
      [intensidade, id]
    );

    return result.affectedRows > 0;
  }

  console.error("Falha ao editar o registro do sintoma. Faltou algum dado");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function deleteRegistro(id) {
  if (id) {
    const [result] = await pool.query(
      `DELETE FROM registro WHERE id = ?`,
      [id]
    );

    if (result.affectedRows > 0) {
      console.log(`Registro com ID ${id} removido com sucesso.`);
      return true;
    }

    console.error(`Nenhum registro encontrado com ID ${id}.`);
    return false;
  }

  console.error("Falha ao deletar o registro do sintoma. ID não informado.");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
module.exports = {
  getRegistro,
  insertRegistro,
  editRegistro,
  deleteRegistro
};