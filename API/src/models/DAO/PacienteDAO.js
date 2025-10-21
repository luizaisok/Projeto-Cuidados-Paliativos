const { createConnection } = require('./db');

// Busca os dados dos pacientes com seus dados de usuário
async function getPacientes(){
    let connection;
    try {
        connection = await createConnection();
        
        const [rows] = await connection.query(`
            SELECT 
                p.id_paciente,
                p.id_usuario,
                u.nome_completo,
                u.email,
                u.telefone,
                u.sexo,
                u.estado,
                p.data_nascimento,
                p.tipo_sanguineo,
                p.condicoes_medicas,
                p.medicacoes,
                p.contatos_emergencia,
                p.unidades_saude
            FROM paciente p
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
        `);
        
        return rows; 
    } catch(e) {
        throw new Error(`Falha ao buscar pacientes: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// Busca os dados de um paciente específico com seus dados de usuário
async function getPacienteById(id_paciente) {
    let connection;
    try {
        if (!id_paciente) {
            throw new Error('ID do paciente é obrigatório!');
        }
        
        connection = await createConnection();
        
        const [rows] = await connection.query(`
            SELECT 
                p.id_paciente,
                p.id_usuario,
                u.nome_completo,
                u.email,
                u.telefone,
                u.sexo,
                u.estado,
                p.data_nascimento,
                p.tipo_sanguineo,
                p.condicoes_medicas,
                p.medicacoes,
                p.contatos_emergencia,
                p.unidades_saude
            FROM paciente p
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
            WHERE p.id_paciente = ?
        `, [id_paciente]);

        return rows.length > 0 ? rows[0] : null;
    } catch (e) {
        throw new Error(`Falha ao buscar paciente: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// Insere um novo paciente (cria um novo usuário também)
async function insertPaciente(dadosPaciente) {
    let connection;
    
    try {
        connection = await createConnection();
        await connection.beginTransaction();

        try {
            // 1. Insere na tabela Usuário (pai)
            const [resultUsuario] = await connection.query(`
                INSERT INTO usuario (
                    tipo_usuario, nome_completo, email, senha_hash, 
                    telefone, sexo, estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                'PACIENTE',
                dadosPaciente.nome_completo,
                dadosPaciente.email,
                dadosPaciente.senha_hash,
                dadosPaciente.telefone,
                dadosPaciente.sexo,
                dadosPaciente.estado
            ]);

            const id_usuario = resultUsuario.insertId;

            // 2. Insere na tabela Paciente (filho)
            const [resultPaciente] = await connection.query(`
                INSERT INTO paciente (
                    id_usuario, data_nascimento, tipo_sanguineo,
                    condicoes_medicas, medicacoes, contatos_emergencia, unidades_saude
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                id_usuario,
                dadosPaciente.data_nascimento,
                dadosPaciente.tipo_sanguineo,
                dadosPaciente.condicoes_medicas,
                dadosPaciente.medicacoes,
                dadosPaciente.contatos_emergencia,
                dadosPaciente.unidades_saude
            ]);

            await connection.commit();

            console.log(`Paciente inserido com sucesso! ID: ${resultPaciente.insertId}`);
            return resultPaciente.insertId;
            
        } catch (transactionalError) {
            await connection.rollback();
            throw transactionalError;
        }
    } catch (e) {
        throw new Error(`Falha ao inserir paciente: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// Atualiza um paciente existente (atualiza o usuário também)
async function editPaciente(id_paciente, dadosPaciente) {
    let connection;
    
    try {
        connection = await createConnection();
        await connection.beginTransaction();

        try {
            // 1. Busca o id_usuario do paciente
            const [pacienteRows] = await connection.query(
                'SELECT id_usuario FROM paciente WHERE id_paciente = ?',
                [id_paciente]
            );

            if (pacienteRows.length === 0) {
                throw new Error('Paciente não encontrado!');
            }

            const id_usuario = pacienteRows[0].id_usuario;

            // 2. Atualiza na tabela Usuário (pai)
            await connection.query(`
                UPDATE usuario SET
                    nome_completo = ?,
                    email = ?,
                    senha_hash = ?,
                    telefone = ?,
                    sexo = ?,
                    estado = ?
                WHERE id_usuario = ?
            `, [
                dadosPaciente.nome_completo,
                dadosPaciente.email,
                dadosPaciente.senha_hash,
                dadosPaciente.telefone,
                dadosPaciente.sexo,
                dadosPaciente.estado,
                id_usuario
            ]);

            // 3. Atualiza na tabela Paciente (filho)
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
                dadosPaciente.data_nascimento,
                dadosPaciente.tipo_sanguineo,
                dadosPaciente.condicoes_medicas,
                dadosPaciente.medicacoes,
                dadosPaciente.contatos_emergencia,
                dadosPaciente.unidades_saude,
                id_paciente
            ]);

            await connection.commit();

            console.log(`Paciente atualizado com sucesso! ID: ${id_paciente}`);
            return true; // ✅ ADICIONADO
            
        } catch (transactionalError) {
            await connection.rollback();
            throw transactionalError;
        }
    } catch (e) {
        throw new Error(`Falha ao atualizar paciente: ${e.message}`);
    } finally {
        if (connection) await connection.end();
    }
}

// Remove um paciente (remove também o usuário em cascata)
async function deletePaciente(id_paciente) {
    let connection;
    
    try {
        connection = await createConnection();
        await connection.beginTransaction();

        try {
            // 1. Busca o id_usuario do paciente
            const [pacienteRows] = await connection.query(
                'SELECT id_usuario FROM paciente WHERE id_paciente = ?',
                [id_paciente]
            );

            if (pacienteRows.length === 0) {
                throw new Error('Paciente não encontrado!');
            }

            const id_usuario = pacienteRows[0].id_usuario;

            // 2. Deleta o usuário (paciente deletado em cascata)
            const [result] = await connection.query(
                'DELETE FROM usuario WHERE id_usuario = ?',
                [id_usuario]
            );

            if (result.affectedRows === 0) {
                throw new Error('Nenhum registro foi removido!');
            }

            await connection.commit();

            console.log(`Paciente removido com sucesso! ID: ${id_paciente}`);
            return true;
            
        } catch (transactionalError) {
            await connection.rollback();
            throw transactionalError;
        }
    } catch (e) {
        throw new Error(`Falha ao remover paciente: ${error.message}`);
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
