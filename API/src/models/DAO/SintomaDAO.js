const pool = require('./db');

// !!!!!!!!!!!!!!!!!!!! ADICIONAR VARIÁVEL "QtdRegistros" APÓS CONECTAR API'S !!!!!!!!!!!!!!!!!!!!!

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function getSintoma() {
  const [rows] = await pool.query("SELECT * FROM sintoma");
  return rows;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function insertSintoma(sintomas, tipo_alerta) {
  if (sintomas && tipo_alerta) {
    const [result] = await pool.query(
      `INSERT INTO sintoma (sintomas, tipo_alerta)
       VALUES (?, ?)`,
      [sintomas, tipo_alerta]
    );

    return result.affectedRows > 0;
  }

  console.error("Falha ao criar o sintoma. Faltou algum dado");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function editSintoma(id, sintomas, tipo_alerta) {
  if (id && sintomas && tipo_alerta) {
    const [result] = await pool.query(
      `UPDATE sintoma
       SET sintomas = ?, tipo_alerta = ?
       WHERE id = ?`,
      [sintomas, tipo_alerta, id]
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
