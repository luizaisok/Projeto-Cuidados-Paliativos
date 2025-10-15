/*
* Como executar esse arquivo: certifiquem-se que estão no diretório ~/API2/ e executem o comando `node test/run_crud.js`
* Não esqueçam de baixar a pasta node_modules/ antes => `npm i`  
*/

const { createUsuario, readUsuarios, updateUsuario } = require('../models/usuario');
const { createPaciente, readPacientes, updatePaciente } = require('../models/paciente');
const { createCuidador, readCuidadores, updateCuidador } = require('../models/cuidador');
const { createRelacao, readRelacoes, updateRelacao } = require('../models/paciente_cuidador');

async function testCRUD() {
    console.log('######### Inicializando Teste de C.R.U.D. ########\n');

    try {
        // ───── CREATE ─────
        console.log('##### Testando CREATE #####\n');
        
        // 1. Criando um novo usuário: paciente
        console.log('\n1. Criando um novo usuário: paciente...\n');
        const resultUsuarioPaciente = await createUsuario(
            'paciente.teste@email.com',
            'hash_senha_paciente',
            'paciente'
        );
        console.log('✅ Usuário: paciente criado:\n', resultUsuarioPaciente);

        // 2. Criando um novo usuário: cuidador
        console.log('\n2. Criando um novo usuario: cuidador...\n');
        const resultUsuarioCuidador = await createUsuario(
            'cuidador.teste@email.com',
            'hash_senha_cuidador',
            'cuidador'
        );
        console.log('✅ Usuário: cuidador criado:\n', resultUsuarioCuidador);

        // // Extrair IDs dos resultados
        const idUsuarioPaciente = parseInt(resultUsuarioPaciente.split('ID_usuario: ')[1]);
        const idUsuarioCuidador = parseInt(resultUsuarioCuidador.split('ID_usuario: ')[1]);

        // 3. Criar paciente
        console.log('\n3. Criando um novo paciente...\n');
        const resultPaciente = await createPaciente(
            idUsuarioPaciente,
            'Joao da Silva Teste',
            'M',
            '1960-05-15',
            70.5,
            170.0,
            'Cancer de Pulmao',
            'Avancado',
            7,
            4,
            true,
            '2024-10-01',
            true
        );
        console.log('✅ Paciente criado:\n', resultPaciente);
        const idPaciente = parseInt(resultPaciente.split('ID_paciente: ')[1]);

        // 4. Criar um novo cuidador
        console.log('\n4. Criar um novo cuidador...\n');
        const resultCuidador = await createCuidador(
            idUsuarioCuidador,
            'Maria da Silva Teste',
            'F',
            '1985-08-20',
            'Filha',
            '(43) 99999-8888'
        );
        console.log('✅ Cuidador criado:\n', resultCuidador);
        const idCuidador = parseInt(resultCuidador.split('ID_cuidador: ')[1]);

        // 5. Criando relação paciente-cuidador
        console.log('\n5. Criando relação paciente-cuidador...\n');
        const resultRelacao = await createRelacao(
            idPaciente,
            idCuidador,
            '2024-09-01',
            null,
            true
        );
        console.log('✅ Relação criada:\n', resultRelacao);
        const idRelacao = parseInt(resultRelacao.split('ID_relacao: ')[1]);

        // ───── READ ─────
        console.log('\n\n# # # Testando READ # # #\n');
        
        console.log('\n6. Lendo usuário: paciente...\n');
        const usuarioPaciente = await readUsuarios(idUsuarioPaciente);
        console.log('✅ Usuário paciente encontrado:\n', usuarioPaciente);

        console.log('\n7. Lendo usuário cuidador...');
        const usuarioCuidador = await readUsuarios(idUsuarioCuidador);
        console.log('✅ Usuário cuidador encontrado:\n', usuarioCuidador);

        console.log('\n8. Lendo paciente...');
        const paciente = await readPacientes(idPaciente);
        console.log('✅ Paciente encontrado:\n', paciente);

        console.log('\n9. Lendo cuidador específico...');
        const cuidador = await readCuidadores(idCuidador);
        console.log('✅ Cuidador encontrado:\n', cuidador);

        console.log('\n10. Lendo relação paciente-cuidador...');
        const relacao = await readRelacoes(idRelacao);
        console.log('✅ Relação encontrada:\n', relacao);

        // ───── UPDATE ─────
        console.log('\n\n# # # TESTANDO UPDATE # # #\n');

        console.log('\n11. Atualizando usuário paciente...\n');
        const updateUsuarioResult = await updateUsuario(
            idUsuarioPaciente,
            'paciente.atualizado@email.com',
            'hash_senha_nova_paciente',
            'paciente'
        );
        console.log('✅ Usuário atualizado:\n', updateUsuarioResult);

        console.log('\n12. Atualizando paciente...\n');
        const updatePacienteResult = await updatePaciente(
            idPaciente,
            'Joao da Silva Atualizado',
            'M',
            '1960-05-15',
            72.0,
            170.0,
            'Cancer de Pulmao',
            'Terminal',
            8,
            3,
            true,
            '2024-10-10',
            true
        );
        console.log('✅ Paciente atualizado:\n', updatePacienteResult);

        console.log('\n13. Atualizando cuidador...\n');
        const updateCuidadorResult = await updateCuidador(
            idCuidador,
            'Maria Santos Atualizada',
            'F',
            '1985-08-20',
            'Filha',
            '(43) 98888-7777'
        );
        console.log('✅ Cuidador atualizado:\n', updateCuidadorResult);

        console.log('\n14. Atualizando relação...\n');
        const updateRelacaoResult = await updateRelacao(
            idRelacao,
            '2024-09-01',
            '2024-12-31',
            false
        );
        console.log('✅ Relação atualizada:\n', updateRelacaoResult);
        
        // ───── Finalizando C.R.U.D. ─────
        console.log('\n\nC.R.U.D. FINALIZADO COM SUCESSO!\n');
    } catch (error) {
        console.error('\n\n❌ Erro durante o C.R.U.D.: ', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

testCRUD();