const pool = require('./db');

async function getAdministradores() {
    const [rows] = await pool.query("SELECT * FROM administrador ORDER BY nome");
    return rows;
};

async function getAdministradorByEmail(email) {
    const [rows] = await pool.execute(
        "SELECT id, email, senha FROM administrador WHERE email = ?",
        [email]
    );
    return rows[0] || null;
}

// tive de adicionar 
async function getAdministradorById(id) {
    const [rows] = await pool.execute(
        "SELECT * FROM administrador WHERE id = ?",
        [id]
    );
    return rows[0] || null;
}

async function insertAdministrador(nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade) {
    if (nome && nome_social && email && senha && data_nascimento && genero && telefone && conselho_profissional && formacao && registro_profissional && especialidade) {
        const [result] = await pool.query(`
            INSERT INTO administrador(nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade]
        );

        if (result.affectedRows > 0) {
            return true;
        }

        return false;
    }
    console.error("Falha ao inserir cliente, faltou algum dado");
    return false;
};

async function editAdministrador(id, nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade) {

    if (!id || !nome || !nome_social || !email || !senha || !data_nascimento || !genero || !telefone || !conselho_profissional || !formacao || !registro_profissional || !especialidade) {
        console.error("Falha ao editar administrador, faltou algum dado.");
        return false;
    }

    const [result] = await pool.query(
        `UPDATE administrador
        SET nome = ?,
            nome_social = ?,
            email = ?,
            senha = ?,
            data_nascimento = ?,
            genero = ?,
            telefone = ?,
            conselho_profissional = ?,
            formacao = ?,
            registro_profissional = ?,
            especialidade = ?
        WHERE id = ?`,
        [nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade, id]
    );

    if (result.affectedRows === 0) return false;
    return true;
}

async function deleteAdministrador(id) {
    if (id) {
        const [result] = await pool.query(`
            DELETE FROM administrador
            WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) return false;
        return true;
    }
    console.error("Falha ao remover o administrador!");
    return false;
}

module.exports = {
    getAdministradores,
    getAdministradorByEmail,
    getAdministradorById, // também tive de adicionar 
    insertAdministrador,
    editAdministrador,
    deleteAdministrador
};
