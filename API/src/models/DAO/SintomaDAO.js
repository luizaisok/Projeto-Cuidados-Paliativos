const pool = require('./db');

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function getSintoma() {
  const [rows] = await pool.query("SELECT * FROM sintoma");
  return rows;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function insertSintoma(nome_sintoma) {
  if (nome_sintoma) {
    const [result] = await pool.query(
      `INSERT INTO sintoma (nome_sintoma)
       VALUES (?)`,
      [nome_sintoma]
    );

    return result.affectedRows > 0;
  }

  console.error("Falha ao criar o sintoma. Faltou algum dado");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function editSintoma(id, nome_sintoma) {
  if (id && nome_sintoma) {
    const [result] = await pool.query(
      `UPDATE sintoma
       SET nome_sintoma = ?
       WHERE id = ?`,
      [nome_sintoma, id]
    );

    return result.affectedRows > 0;
  }

  console.error("Falha ao editar o sintoma. Faltou algum dado");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function deleteSintoma(id) {
  if (id) {
    const [result] = await pool.query(
      `DELETE FROM sintoma WHERE id = ?`,
      [id]
    );

    if (result.affectedRows > 0) {
      console.log(`Sintoma com ID ${id} removido com sucesso.`);
      return true;
    }

    console.error(`Nenhum sintoma encontrado com ID ${id}.`);
    return false;
  }

  console.error("Falha ao deletar o sintoma. ID não informado.");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
module.exports = {
  getSintoma,
  insertSintoma,
  editSintoma,
  deleteSintoma
};
