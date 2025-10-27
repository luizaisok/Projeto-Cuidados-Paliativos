const { createConnection } = require('./db');

// Busca todos os pacientes
async function getPacientes() {
    let connection;
    try {
        connection = await createConnection();
        
        const [rows] = await connection.query(`
            SELECT 
                p.id_paciente,
                p.id_usuario,
                p.data_nascimento,
                p.tipo_sanguineo,
                p.condicoes_medicas,
                p.medicacoes,
                p.contatos_emergencia,
                p.unidades_saude,
                u.nome_completo,
                u.email,
                u.telefone,
                u.sexo,
                u.estado
            FROM paciente p
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
        `);
        
        return rows;
    } catch (e) {
        throw new Error(`Falha ao buscar pacientes: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// Busca um paciente específico
async function getPacienteById(id_paciente) {
    let connection;
    try {
        connection = await createConnection();
        
        const [rows] = await connection.query(`
            SELECT 
                p.id_paciente,
                p.id_usuario,
                p.data_nascimento,
                p.tipo_sanguineo,
                p.condicoes_medicas,
                p.medicacoes,
                p.contatos_emergencia,
                p.unidades_saude,
                u.nome_completo,
                u.email,
                u.telefone,
                u.sexo,
                u.estado
            FROM paciente p
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
            WHERE p.id_paciente = ?
        `, [id_paciente]);

        return rows[0] || null;
    } catch (e) {
        throw new Error(`Falha ao buscar paciente: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// Cria um novo paciente (insere em usuário e paciente)
async function insertPaciente(dados) {
    let connection;
    
    try {
        connection = await createConnection();
        await connection.beginTransaction();

        // 1. Cria o usuário
        const [resultUsuario] = await connection.query(`
            INSERT INTO usuario (
                tipo_usuario, nome_completo, email, senha_hash, 
                telefone, sexo, estado
            ) VALUES ('PACIENTE', ?, ?, ?, ?, ?, ?)
        `, [
            dados.nome_completo,
            dados.email,
            dados.senha_hash,
            dados.telefone,
            dados.sexo,
            dados.estado
        ]);

        // 2. Cria o paciente
        const [resultPaciente] = await connection.query(`
            INSERT INTO paciente (
                id_usuario, data_nascimento, tipo_sanguineo,
                condicoes_medicas, medicacoes, contatos_emergencia, unidades_saude
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            resultUsuario.insertId,
            dados.data_nascimento || null,
            dados.tipo_sanguineo,
            dados.condicoes_medicas,
            dados.medicacoes,
            dados.contatos_emergencia,
            dados.unidades_saude
        ]);

        await connection.commit();
        return resultPaciente.insertId;
        
    } catch (e) {
        if (connection) await connection.rollback();
        throw new Error(`Falha ao inserir paciente: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// Atualiza um paciente existente
async function editPaciente(id_paciente, dados) {
    let connection;
    
    try {
        connection = await createConnection();
        await connection.beginTransaction();

        // Busca (e pega) o id_usuario do paciente
        const [rows] = await connection.query(
            'SELECT id_usuario FROM paciente WHERE id_paciente = ?',
            [id_paciente]
        );

        if (!rows.length) {
            throw new Error('Paciente não encontrado');
        }

        const id_usuario = rows[0].id_usuario;

        // Atualiza tabela usuário
        await connection.query(`
            UPDATE usuario SET
                nome_completo = ?,
                email = ?,
                telefone = ?,
                sexo = ?,
                estado = ?
            WHERE id_usuario = ?
        `, [
            dados.nome_completo,
            dados.email,
            dados.telefone,
            dados.sexo,
            dados.estado,
            id_usuario
        ]);

        // 3. Atualiza tabela paciente
        await connection.query(`
            UPDATE paciente SET
                data_nascimento = ?,
                tipo_sanguineo = ?,
                condicoes_medicas = ?,
                medicacoes = ?,
                contatos_emergencia = ?,
                unidades_saude = ?
            WHERE id_paciente = ?
        `, [
            dados.data_nascimento || null,
            dados.tipo_sanguineo,
            dados.condicoes_medicas,
            dados.medicacoes,
            dados.contatos_emergencia,
            dados.unidades_saude,
            id_paciente
        ]);

        await connection.commit();
        return true;
        
    } catch (e) {
        if (connection) await connection.rollback();
        throw new Error(`Falha ao atualizar paciente: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// Remove um paciente (em cascata)
async function deletePaciente(id_paciente) {
    let connection;
    
    try {
        connection = await createConnection();
        await connection.beginTransaction();

        // Busca o id_usuario
        const [rows] = await connection.query(
            'SELECT id_usuario FROM paciente WHERE id_paciente = ?',
            [id_paciente]
        );

        if (!rows.length) {
            throw new Error('Paciente não encontrado');
        }

        // Deleta o usuário (cascata (em create_tables.sql) deleta o paciente)
        const [result] = await connection.query(
            'DELETE FROM usuario WHERE id_usuario = ?',
            [rows[0].id_usuario]
        );

        if (result.affectedRows === 0) {
            throw new Error('Nenhum registro foi removido');
        }

        await connection.commit();
        return true;
        
    } catch (e) {
        if (connection) await connection.rollback();
        throw new Error(`Falha ao remover paciente: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

module.exports = {
    getPacientes,
    getPacienteById,
    insertPaciente,
    editPaciente,
    deletePaciente
};
