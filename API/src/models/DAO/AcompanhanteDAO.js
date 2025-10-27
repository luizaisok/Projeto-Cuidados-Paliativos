const { createConnection } = require('./db');

async function getAcompanhantes(){
    const connection = await createConnection();
    const [rows] = await connection.query("SELECT * FROM acompanhante ORDER BY nome_completo");

    return rows;
};

async function insertAcompanhante(tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento){
    const connection = await createConnection();
    if (tipo_pessoa && nome_completo && nome_social && idade && email && telefone && genero && data_nascimento && senha && relacionamento) {
        const [result] = await connection.query(`
            INSERT INTO acompanhante(tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento]
        );

        if(result.affectedRows > 0){
            return true;
        }

        return false;
    }
    console.error("Falha ao inserir acompanhante, faltou algum dado");
    return false;
};

async function editAcompanhante(id, tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, confirmacao_senha, relacionamento){

    const connection = await createConnection();
    if(!id || !tipo_pessoa || !nome_completo || !nome_social || !idade || !email || !telefone || !genero || !data_nascimento || !senha || !confirmacao_senha || !relacionamento){
        console.error("Falha ao editar acompanhante, faltou algum dado.");
        return false;
    }

    if(senha !== confirmacao_senha){
        console.error("Senha e confirmação de senha não conferem.");
        return false;
    }

    const [result] = await connection.query(
        `UPDATE acompanhante
        SET tipo_pessoa = ?,
            nome_completo = ?,
            nome_social = ?,
            idade = ?,
            email = ?,
            telefone = ?,
            genero = ?,
            data_nascimento = ?,
            senha = ?,
            relacionamento = ?
        WHERE id = ?`, [tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento, id]
    );

    if(result.affectedRows === 0) return false;
    return true;
}

async function deleteAcompanhante(id){
    if(id){
        const connection = await createConnection();
        const [result] = await connection.query(`
            DELETE FROM acompanhante
            WHERE id = ?`,
            [id]
        );

        if(result.affectedRows === 0) return false;
        return true;
    }
    console.error("Falha ao remover o acompanhante!");
    return false;
}

module.exports = {getAcompanhantes, insertAcompanhante, editAcompanhante, deleteAcompanhante};