const pool = require('./db');

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function getConteudos() {
  const [rows] = await pool.query("SELECT * FROM conteudo");
  return rows;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function insertConteudo(titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta) {
  if (titulo && descricao && texto && data_post && SinaisSintomas && SinaisAlerta) {
    const [result] = await pool.query(
      `INSERT INTO conteudo (titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta]
    );

    return result.affectedRows > 0;
  }

  console.error("Falha ao criar o conteúdo. Faltou algum dado");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function editConteudo(id, titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta) {
  if (id && titulo && descricao && texto && data_post && SinaisSintomas && SinaisAlerta) {
    const [result] = await pool.query(
      `UPDATE conteudo
       SET titulo = ?, descricao = ?, texto = ?, data_post = ?, SinaisSintomas = ?, SinaisAlerta = ?
       WHERE id = ?`,
      [titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta, id]
    );

    return result.affectedRows > 0;
  }

  console.error("Falha ao editar o conteúdo. Faltou algum dado");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function deleteConteudo(id) {
  if (id) {
    const [result] = await pool.query(
      `DELETE FROM conteudo WHERE id = ?`,
      [id]
    );

    if (result.affectedRows > 0) {
      console.log(`Conteúdo com ID ${id} removido com sucesso.`);
      return true;
    }

    console.error(`Nenhum conteúdo encontrado com ID ${id}.`);
    return false;
  }

  console.error("Falha ao deletar o conteúdo. ID não informado.");
  return false;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
module.exports = {
  getConteudos,
  insertConteudo,
  editConteudo,
  deleteConteudo
};