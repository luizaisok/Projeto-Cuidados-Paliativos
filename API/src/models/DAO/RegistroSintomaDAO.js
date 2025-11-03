const pool = require('./db');

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function getRegistro() {
  const [rows] = await pool.query("SELECT * FROM registro");
  return rows;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function insertRegistro(data_registro, intensidade, observacao) {
  if (data_registro && intensidade && observacao) {
    const [result] = await pool.query(
      `INSERT INTO registro (data_registro, intensidade, observacao)
       VALUES (?, ?, ?)`,
      [data_registro, intensidade, observacao]
    );

    return result.affectedRows > 0;
  }

  console.error("Falha ao criar o registro do sintoma. Faltou algum dado");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function editRegistro(id, data_registro, intensidade, observacao) {
  if (id && data_registro && intensidade && observacao) {
    const [result] = await pool.query(
      `UPDATE registro
       SET data_registro = ?, intensidade = ?, observacao = ?
       WHERE id = ?`,
      [data_registro, intensidade, observacao, id]
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
