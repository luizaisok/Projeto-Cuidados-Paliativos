/*
* Como executar esse arquivo: certifiquem-se que estão no diretório ~/API2/ e executem o comando `node test/run_delete.js`
* Não esqueçam de baixar a pasta node_modules/ antes => `npm i`  
* ATENÇÃO: Execute este script DEPOIS de executar o script `run_crud.js`
*/

const pool = require('../config/db');

const { deleteUsuario, readUsuarios } = require('../models/usuario');
const { deletePaciente, readPacientes } = require('../models/paciente');
const { deleteCuidador, readCuidadores } = require('../models/cuidador');
const { deleteRelacao, readRelacoes } = require('../models/paciente_cuidador');

async function testDelete() {
    console.log('# # # # # Iniciando Testes de DELETE # # # # #\n');

    try {
        console.log('1. Buscando registros de teste...\n');
        
        // Buscar usuários de teste pelo email
        const [usuariosPaciente] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            ['paciente.atualizado@email.com']
        );
        
        const [usuariosCuidador] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            ['cuidador.teste@email.com']
        );

        const idUsuarioPaciente = usuariosPaciente[0].id_usuario;
        const idUsuarioCuidador = usuariosCuidador[0].id_usuario;

        // Buscar paciente
        const [pacientes] = await pool.query(
            'SELECT * FROM pacientes WHERE id_usuario = ?',
            [idUsuarioPaciente]
        );
        const idPaciente = pacientes[0]?.id_paciente;

        // Buscar cuidador
        const [cuidadores] = await pool.query(
            'SELECT * FROM cuidadores WHERE id_usuario = ?',
            [idUsuarioCuidador]
        );
        const idCuidador = cuidadores[0]?.id_cuidador;

        // Buscar relação
        const [relacoes] = await pool.query(
            'SELECT * FROM paciente_cuidador WHERE id_paciente = ? AND id_cuidador = ?',
            [idPaciente, idCuidador]
        );
        const idRelacao = relacoes[0]?.id_relacao;

        console.log('✅ Registros encontrados:\n');
        console.log(`- ID Usuário Paciente: ${idUsuarioPaciente}\n`);
        console.log(`- ID Usuário Cuidador: ${idUsuarioCuidador}\n`);
        console.log(`- ID Paciente: ${idPaciente}\n`);
        console.log(`- ID Cuidador: ${idCuidador}\n`);
        console.log(`- ID Relação: ${idRelacao}\n`);

        // ========== DELETE ==========
        console.log('\n\n# # # Deletando (teste) # # #\n');
        console.log('⚠️  IMPORTANTE: Deletando na ordem correta (dependências primeiro):\n');

        // 1. Deletar relação primeiro (pois depende de paciente e cuidador)
        if (idRelacao) {
            console.log('\n2. Deletando relação paciente-cuidador...\n');
            const resultRelacao = await deleteRelacao(idRelacao);
            console.log('Relação deletada?\n', resultRelacao);
            
            // Verificar se foi deletado
            const relacaoVerifica = await readRelacoes(idRelacao);
            console.log(`Verificação: ${relacaoVerifica.length === 0 ? '✅ Deletado com sucesso!\n' : '❌ Ainda existe!\n'}`);
        }

        // 2. Deletar paciente (antes do usuário paciente)
        if (idPaciente) {
            console.log('\n3. Deletando paciente...\n');
            const resultPaciente = await deletePaciente(idPaciente);
            console.log('Paciente deletado?', resultPaciente);
            
            // Verificar se foi deletado
            const pacienteVerifica = await readPacientes(idPaciente);
            console.log(`Verificação: ${pacienteVerifica.length === 0 ? '✅ Deletado com sucesso!\n' : '❌ Ainda existe!\n'}`);
        }

        // 3. Deletar cuidador (antes do usuário cuidador)
        if (idCuidador) {
            console.log('\n4. Deletando cuidador...\n');
            const resultCuidador = await deleteCuidador(idCuidador);
            console.log('✅ Cuidador deletado?', resultCuidador);
            
            // Verificar se foi deletado
            const cuidadorVerifica = await readCuidadores(idCuidador);
            console.log(`Verificação: ${cuidadorVerifica.length === 0 ? '✅ Deletado com sucesso!\n' : '❌ Ainda existe!\n'}`);
        }

        // 4. Deletar usuário paciente
        if (idUsuarioPaciente) {
            console.log('\n5. Deletando usuário paciente...');
            const resultUsuarioPaciente = await deleteUsuario(idUsuarioPaciente);
            console.log('Usuário paciente: deletado?', resultUsuarioPaciente);
            
            // Verificar se foi deletado
            const usuarioVerifica = await readUsuarios(idUsuarioPaciente);
            console.log(`Verificação: ${usuarioVerifica.length === 0 ? '✅ Deletado com sucesso!\n' : '❌ Ainda existe!\n'}`);
        }

        // 5. Deletar usuário cuidador
        if (idUsuarioCuidador) {
            console.log('\n6. Deletando usuário cuidador...');
            const resultUsuarioCuidador = await deleteUsuario(idUsuarioCuidador);
            console.log('Usuário cuidador deletado?', resultUsuarioCuidador);
            
            // Verificar se foi deletado
            const usuarioVerifica = await readUsuarios(idUsuarioCuidador);
            console.log(`Verificação: ${usuarioVerifica.length === 0 ? '✅ Deletado com sucesso!\n' : '❌ Ainda existe!\n'}`);
        }

        console.log('\nTodos os registros de teste foram removidos do banco de dados com sucesso!');
    } catch (error) {
        console.error('\n❌ Erro durante a exclussão: ', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    } finally {
        // Fechar pool de conexões
        await pool.end();
        process.exit(0);
    }
}

// Executar testes
testDelete();