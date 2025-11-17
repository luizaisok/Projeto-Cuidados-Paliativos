const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'abacate';

app.set("view engine", "ejs"); 
app.set("views", "./src/views");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {getAdministradores, getAdministradorByEmail, insertAdministrador, editAdministrador, deleteAdministrador} = require("../models/DAO/AdministradorDAO");
const { getPacientes, getPacienteById, getPacienteByEmail, insertPaciente, editPaciente, deletePaciente } = require("../models/DAO/PacienteDAO");
const { getAcompanhantes, getAcompanhanteById, getAcompanhanteByEmail, insertAcompanhante, editAcompanhante, deleteAcompanhante } = require("../models/DAO/AcompanhanteDAO");
const { linkAcompanhantePaciente, unlinkAcompanhantePaciente, getPacientesDoAcompanhante, getAcompanhantesDoPaciente } = require("../models/DAO/VinculoDAO");
const {getConteudos, insertConteudo, editConteudo, deleteConteudo} = require("../models/DAO/ConteudoDAO");
const {getRegistro, insertRegistro, editRegistro, deleteRegistro} = require("../models/DAO/RegistroSintomaDAO");
const {getSintoma, insertSintoma, editSintoma, deleteSintoma} = require("../models/DAO/SintomaDAO");

// Helper que converte "" em null
const toNull = (v) => (v === "" ? null : v);

/********************************************************************************************************
* LOGIN                                                                                                 *
********************************************************************************************************/

// Tenta na tabela paciente, se não der, tenta em acompanhante
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: true, message: 'Informe email e senha.' });
    }

  // 1. Tenta administrador 1º
  const administrador = await getAdministradorByEmail(email);
  if (administrador && administrador.senha === senha) {
    const id = administrador.id;
    const payload = { sub: `administrador:${id}`, id, tipo: 'administrador', email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token, user: { id, tipo: 'administrador', email } });
  }

    // Tenta paciente 2º
    const paciente = await getPacienteByEmail(email);
    if (paciente && paciente.senha === senha) {
      const id = paciente.id_paciente ?? paciente.id;

      const payload = { sub: `paciente:${id}`, id, tipo: 'paciente', email };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({ token, user: { id, tipo: 'paciente', email } });
    }

    // Tenta acompanhante 3º
    const acompanhante = await getAcompanhanteByEmail(email);
    if (acompanhante && acompanhante.senha === senha) {
      const id = acompanhante.id;
      
      const payload = { sub: `acompanhante:${id}`, id, tipo: 'acompanhante', email };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      
      return res.json({ token, user: { id, tipo: 'acompanhante', email } });
    }

    return res.status(401).json({ error: true, message: 'Credenciais inválidas.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Token ausente.' });
  }
  const token = h.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET); // {sub, id, tipo, email, iat, exp}
    next();
  } catch (e) {
    return res.status(401).json({ error: true, message: 'Token inválido.' });
  }
}

/********************************************************************************************************
 * VÍNCULO PACINTE c/ ACOMPANHANTE                                                                      *
 *******************************************************************************************************/

// Lista pacientes de um acompanhante
app.get('/api/acompanhante/:id/pacientes', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.tipo !== 'acompanhante' || String(req.user.id) !== String(id)) {
      return res.status(403).json({ error: true, message: 'Acesso negado.' });
    }
    const lista = await getPacientesDoAcompanhante(id);
    return res.json({ error: false, data: lista });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

// Lista acompanhantes de um paciente
app.get('/api/pacientes/:id/acompanhantes', async (req, res) => {
  try {
    const { id } = req.params;
    const lista = await getAcompanhantesDoPaciente(id);
    return res.status(200).json({ error: false, data: lista });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

// Cria vínculo
app.post('/api/vinculos', auth, async (req, res) => {
  try {
    const { paciente_id } = req.body;
    // só acompanhante cria vínculo com paciente
    if (req.user.tipo !== 'acompanhante') {
      return res.status(403).json({ error: true, message: 'Somente acompanhante pode vincular.' });
    }
    if (!paciente_id) {
      return res.status(400).json({ error: true, message: 'Informe paciente_id.' });
    }
    const ok = await linkAcompanhantePaciente(req.user.id, paciente_id);
    if (!ok) return res.status(400).json({ error: true, message: 'Vínculo já existe ou inválido.' });
    return res.status(201).json({ error: false });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

// Remove vínculo - CORRIGIDO
app.delete('/api/vinculos', auth, async (req, res) => {
  try {
    const { acompanhante_id, paciente_id } = req.body;
    
    // Se vier só paciente_id, usa o ID do usuário logado como acompanhante_id
    let acompId = acompanhante_id;
    let pacId = paciente_id;
    
    // Se o usuário logado é acompanhante e não passou acompanhante_id, usa o próprio ID
    if (req.user.tipo === 'acompanhante' && !acompanhante_id) {
      acompId = req.user.id;
    }
    
    // Se o usuário logado é paciente e não passou paciente_id, usa o próprio ID
    if (req.user.tipo === 'paciente' && !paciente_id) {
      pacId = req.user.id;
    }
    
    if (!acompId || !pacId) {
      return res.status(400).json({ 
        error: true, 
        message: 'acompanhante_id e paciente_id são obrigatórios.' 
      });
    }

    const ok = await unlinkAcompanhantePaciente(acompId, pacId);
    
    if (!ok) {
      return res.status(404).json({ 
        error: true, 
        message: 'Vínculo não encontrado.' 
      });
    }

    return res.status(200).json({ 
      error: false, 
      message: 'Vínculo removido.' 
    });
  } catch (e) {
    console.error('Erro ao remover vínculo:', e);
    return res.status(500).json({ 
      error: true, 
      message: 'Erro no servidor.' 
    });
  }
});


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- ☆ ADMINISTRADOR ☆

app.get("/", (req, res) => {
    res.status(200).render("index");
});

//Dados de Administrador
//Enviando os dados do administrador (read)
app.get("/administradores", async (req, res) => {
    const administradores = await getAdministradores();
    console.log("Administradores: ", administradores);

    res.status(200).render("listaadministradores", {administradoresDoController: administradores});
});

// API para enviar os dados de administrador
app.get("/api/administradores", async (req, res) => {
    const administradores = await getAdministradores();

    res.status(200).json({success: true, administradores});
});

//Inserindo Administrador (create)
app.get("/novoAdministrador", (req, res) => {
    res.status(200).render("formadministrador", {administrador: {}});
});

app.post("/administrador", async (req, res) => {
    const {id, nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade} = req.body;

    if(id){
        const result = await editAdministrador(id, nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade);
        if(result) return res.redirect("/administradores");
        return res.status(404).send("Não foi possível editar o administrador!");
    }else{
        const result = await insertAdministrador(nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade);
        if(result) return res.redirect("/administradores");
        return res.status(404).send("Não foi possível inserir o administrador!");
    }
});

/*app.post("/administrador", async (req, res) => {
    const {nome, nome_social, email, senha, confirmacao_senha, data_nascimento, genero, conselhoProfissional, formacao, registroProfissional, ultimo_login, especialidade} = req.body;
    
    const result = await insertAdministrador(nome, nome_social, email, senha, confirmacao_senha, data_nascimento, genero, conselhoProfissional, formacao, registroProfissional, ultimo_login, especialidade);
    
    if(result){
        return res.status(201).send("Administrador inserido!");
    }
    return res.status(404).send("Administrador Não inserido!");
});*/

//Inserindo administrador via API
app.post("/api/administrador", async (req, res) => {
    const {nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade} = req.body;
    const result = await insertAdministrador(nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade);
    if(result){
        return res.status(202).json({success: true});
    }
    return res.status(400).json({success: false});
});

//Atualizando Administrador (Update)
app.get("/editaradministrador/:idadministrador", async (req, res) => {
    const id = req.params.idadministrador;

    const administradores = await getAdministradores();
    const administrador = administradores.find(adm => adm.id == id);

    if (!administrador) {
    return res.status(404).send("Administrador não encontrado");
    }

    res.status(200).render("formadministrador", {administrador});
});

app.put("/administrador", async (req, res) => {
    console.log("REQ.BODY:", req.body);
    const {id, nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade} = req.body;
    const result = await editAdministrador(id, nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade);

    if(result){
        return res.status(200).send("Administrador editado com sucesso!")
    }
    return res.status(404).send("Não foi possível editar o administrador")
});

// API para editar um administrador
app.put('/api/administrador/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade } = req.body;

  const result = await editAdministrador(
    id, nome, nome_social, email, senha, data_nascimento, genero, telefone, conselho_profissional, formacao, registro_profissional, especialidade
  );

  res.json(result);
});

//Removendo Administrador (delete)
/*app.get("/removeradministrador/:id", async (req, res) => {
    const id = req.params.id;
    const result = await deleteAdministrador(id);
    if(result){
        return res.status(200).redirect("/administradores");
    }
    return res.status(404).send("Não foi possível remover o administrador!");
})

app.delete("/administrador", async (req, res) => {
    const {id} = req.body;
    const result = await deleteAdministrador(id);
    if(result){
        return res.status(200).send("Administrador removido com sucesso!");
    }  
    return res.status(404).send("Não foi possível remover o administrador!");
});*/

// API para remover o administrador
app.delete('/api/administrador/:id', async (req, res) => {
  const { id } = req.params;
  const result = await deleteAdministrador(id);
  res.json(result);
});

/********************************************************************************************************
* PACIENTE                                                                                              *
********************************************************************************************************/

/*
app.get("/pacientes", async (req, res) => {
    const pacientes = await getPacientes();
    console.log("Pacientes: ", pacientes);

    res.status(200).render("listaPacientes", {pacientesDoController: pacientes});
});

app.get('/api/pacientes', async (req, res) => {
  try {
    const pacientes = await getPacientes();
    res.status(200).json({ error: false, message: pacientes });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true, message: 'Erro ao consultar pacientes: ' + e.message,});
  }
});

app.get("/api/pacientes", async (req, res) => {
    const pacientes = await getPacientes();

    res.status(200).json({success: true, pacientes});
});

app.get('/novopaciente', (req, res) => {
    res.render('formPaciente');
});

app.post('/paciente', async (req, res) => {
    const {nome, nome_social, email, senha, data_nascimento, genero, estado, cidade, medicacao, doenca, tipo_sanguineo} = req.body;

    const result = await insertPaciente(nome, nome_social, email, senha, data_nascimento, genero, estado, cidade, medicacao, doenca, tipo_sanguineo
    );

    if (result){
        res.redirect('/pacientes');
    }else{
        res.status(400).send("Erro ao cadastrar paciente.");
    }
});

app.post("/api/paciente", async (req, res) => {
    const {nome, nome_social, email, senha, data_nascimento, genero, estado, cidade, medicacao, doenca, tipo_sanguineo} = req.body;
    console.log("Dados recebidos: ", req.body);
    const result = await insertPaciente(nome, nome_social, email, senha, data_nascimento, genero, estado, cidade, medicacao, doenca, tipo_sanguineo);
    if(result){
        return res.status(202).json({success: true});
    }
    return res.status(400).json({success: false});
});

app.post('/api/pacientes', async (req, res) => {
  try {
    const { nome, email, celular, genero, data_nascimento, estado, tipo_sanguineo, medicacao, contato_emergencia, unidades_de_saude } = req.body;

    const result = await insertPaciente(nome, email, celular, genero, data_nascimento, estado, tipo_sanguineo, medicacao, contato_emergencia, unidades_de_saude);

    if (result) {
      res.status(201).json({ error: false, message: 'Paciente inserido com sucesso!' });
    } else {
      res.status(400).json({ error: true, message: 'Erro ao inserir paciente.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

app.post('/api/pacientes', async (req, res) => {  
  try {
    const { nome, email, celular, genero, data_nascimento, estado, tipo_sanguineo, medicacao, contato_emergencia, unidades_de_saude } = req.body;
    
    const result = await insertPaciente(
      nome, 
      email, 
      celular, 
      genero, 
      data_nascimento, 
      estado, 
      tipo_sanguineo, 
      medicacao, 
      contato_emergencia, 
      unidades_de_saude
    );
    
    console.log('✅ Resultado do insertPaciente:', result);

    if (result) {
      res.status(201).json({ error: false, message: 'Paciente inserido com sucesso!' });
    } else {
      res.status(400).json({ error: true, message: 'Erro ao inserir paciente.' });
    }
  } catch (e) {
    res.status(500).json({ error: true, message: 'Erro no servidor: ' + e.message,});
  }
});

app.get('/editarpaciente/:id', async (req, res) => {
    const {id} = req.params;
    const pacientes = await getPacientes();
    const paciente = pacientes.find(p => p.id == id);

    if(paciente){
        res.render('paciente/edit', { paciente });
    }else{
        res.status(404).send("Paciente não encontrado.");
    }
});

app.put('/editarpaciente/:id', async (req, res) => {
    const {id} = req.params;

    const {nome, nome_social, email, senha, data_nascimento, genero, estado, cidade, medicacao, doenca, tipo_sanguineo} = req.body;

    const sucesso = await editPaciente( id, nome, nome_social, email, senha, data_nascimento, genero, estado, cidade, medicacao, doenca, tipo_sanguineo);

    if(sucesso){
        res.redirect('/pacientes');
    }else{
        res.status(400).send("Erro ao editar paciente.");
    }
});

app.put("/api/paciente/:id", async (req, res) => {
    const {id} = req.params;

    console.log("ID:", req.params.id);
    const {nome, nome_social, email, senha, data_nascimento, genero, estado, cidade, medicacao, doenca, tipo_sanguineo} = req.body;
    const result = await editPaciente(id, nome, nome_social, email, senha, data_nascimento, genero, estado, cidade, medicacao, doenca, tipo_sanguineo);

    if(result){
        return res.status(200).json({success: true});
    }
    return res.status(404).json({success: false});
});
 
app.put('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { nome, email, celular, genero, data_nascimento, estado, tipo_sanguineo, medicacao, contato_emergencia, unidades_de_saude } = req.body;

    const result = await editPaciente(id, nome, email, celular, genero, data_nascimento, estado, tipo_sanguineo, medicacao, contato_emergencia, unidades_de_saude);

    if (result) {
      res.status(200).json({ error: false, message: 'Paciente atualizado com sucesso!' });
    } else {
      res.status(404).json({ error: true, message: 'Paciente não encontrado.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true, message: 'Erro no servidor: ' + e.message,});
  }
});

app.get('/removerpaciente/:id', async (req, res) => {
    const {id} = req.params;
    const sucesso = await deletePaciente(id);

    if(sucesso){
        res.redirect('/pacientes');
    }else{
        res.status(400).send("Erro ao remover paciente.");
    }
});

app.delete("/api/paciente/:id", async (req, res) => {
    const {id} = req.params;
    //console.log(`Requisição DELETE recebida para o ID: ${id}`); //Para testar o DELETE do paciente
    const result = await deletePaciente(id);
    if(result){
        return res.status(200).json({success: true});
    }  
    return res.status(404).json({success: false});
});

app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await deletePaciente(id);

    if (result) {
      res.status(200).json({ error: false, message: 'Paciente removido com sucesso!' });
    } else {
      res.status(404).json({ error: true, message: 'Paciente não encontrado.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});
*/

// Nova versão da API para paciente
// CREATE
app.post('/api/pacientes', async (req, res) => {
  try {
    const {
      nome = null,
      email, // obrigatório
      senha, // obrigatório
      celular = null,
      genero = null,
      data_nascimento = null,
      cidade = null,
      estado = null,
      tipo_sanguineo = null,
      condicoes_medicas = null,
      medicacao = null,
      contato_emergencia = null,
      unidades_de_saude = null,
      nome_social = null
    } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: true, message: 'Informe email e senha.' });
    }

    const id = await insertPaciente(
      toNull(nome),
      email,
      senha,
      toNull(celular),
      toNull(genero),
      toNull(data_nascimento),
      toNull(estado),
      toNull(tipo_sanguineo),
      toNull(medicacao),
      toNull(contato_emergencia),
      toNull(unidades_de_saude),
      toNull(nome_social),
      toNull(cidade),
      toNull(condicoes_medicas)
    );

    return res.status(201).json({ error: false, id });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor: ' + e.message });
  }
});

// READ ALL ou pelo email
app.get('/api/pacientes', async (req, res) => {
  try {
    const { email } = req.query;

    if (email) {
      const paciente = await getPacienteByEmail(email);

      if (!paciente) return res.status(404).json({ error: true, message: 'Paciente não encontrado.' });
      
      return res.status(200).json({ error: false, data: paciente });
    }

    const pacientes = await getPacientes();

    return res.status(200).json({ error: false, data: pacientes });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro ao consultar pacientes: ' + e.message });
  }
});

// READ pelo id_paciente
app.get('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const paciente = await getPacienteById(id);
    
    if (!paciente) return res.status(404).json({ error: true, message: 'Paciente não encontrado.' });
    
    return res.status(200).json({ error: false, data: paciente });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

// UPDATE pelo id_paciente 
app.put('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nome = null,
      email = null,
      senha = null, // se enviar, atualiza; senão mantém
      celular = null,
      genero = null,
      data_nascimento = null,
      cidade = null,
      estado = null,
      tipo_sanguineo = null,
      condicoes_medicas = null,
      medicacao = null,
      contato_emergencia = null,
      unidades_de_saude = null,
      nome_social = null
    } = req.body;

    const ok = await editPaciente(
      id,
      toNull(nome),
      toNull(email),
      toNull(senha),
      toNull(celular),
      toNull(genero),
      toNull(data_nascimento),
      toNull(estado),
      toNull(tipo_sanguineo),
      toNull(medicacao),
      toNull(contato_emergencia),
      toNull(unidades_de_saude),
      toNull(nome_social),
      toNull(cidade),
      toNull(condicoes_medicas)
    );

    if (!ok) {
      return res.status(400).json({ error: true, message: "Não foi possível atualizar paciente." });
    }
    return res.status(200).json({ error: false, message: "Paciente atualizado." });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor: ' + e.message });
  }
});

// DELETE pelo id_paciente
app.delete('/api/pacientes/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await deletePaciente(id);

    if (result) {
      res.status(200).json({ error: false, message: 'Paciente removido com sucesso!' });
    } else {
      res.status(404).json({ error: true, message: 'Paciente não encontrado.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

/********************************************************************************************************
* ACOMPANHANTE                                                                                          *
********************************************************************************************************/

/*
// READ
app.get("/acompanhantes", async (req, res) => {
    const acompanhantes = await getAcompanhantes();
    console.log("Acompanhantes: ", acompanhantes);

    res.status(200).render("listaAcompanhantes", {acompanhantesDoController: acompanhantes});
});

app.get("/api/acompanhantes", async (req, res) => {
    const acompanhantes = await getAcompanhantes();

    res.status(200).json({success: true, acompanhantes});
});

// CREATE
app.get('/acompanhante', (req, res) => {
    res.render('formAcompanhante');
});

app.get('/acompanhante', async (req, res) => {

    res.json(rows);
});

app.post('/acompanhante', async (req, res) => {
    const {tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento} = req.body;

    const result = await insertAcompanhante(tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento);

    if (result){
        res.redirect('/acompanhantes');
    }else{
        res.status(400).send("Erro ao cadastrar acompanhante.");
    }
});

app.post("/api/acompanhante", async (req, res) => {
    const {tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento} = req.body;
    console.log("Dados recebidos: ", req.body);
    const result = await insertAcompanhante(tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento);
    if(result){
        return res.status(202).json({success: true});
    }
    return res.status(400).json({success: false});
});

// UPDATE
app.get('/acompanhante/:id', async (req, res) => {
    const {id} = req.params;
    const acompanhantes = await getAcompanhantes();
    const acompanhante = acompanhantes.find(p => p.id == id);

    if(acompanhante){
        res.render('acompanhante/edit', { acompanhante });
    }else{
        res.status(404).send("Acompanhante não encontrado.");
    }
});

app.put('/acompanhante/:id', async (req, res) => {
    const {id} = req.params;

    const {tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento} = req.body;

    const sucesso = await editAcompanhante( id, tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento);

    if(sucesso){
        res.redirect('/acompanhantes');
    }else{
        res.status(400).send("Erro ao editar acompanhante.");
    }
});

app.put("/api/acompanhante/:id", async (req, res) => {
    const {id} = req.params;

    console.log("ID:", req.params.id);
    const {tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento} = req.body;
    const result = await editAcompanhante(id, tipo_pessoa, nome_completo, nome_social, idade, email, telefone, genero, data_nascimento, senha, relacionamento);

    if(result){
        return res.status(200).json({success: true});
    }
    return res.status(404).json({success: false});
});

// DELETE
app.get('/acompanhante/:id', async (req, res) => {
    const {id} = req.params;
    const sucesso = await deleteAcompanhante(id);

    if(sucesso){
        res.redirect('/acompanhantes');
    }else{
        res.status(400).send("Erro ao remover acompanhante.");
    }
});

app.delete("/api/acompanhante/:id", async (req, res) => {
    const {id} = req.params;
    const result = await deleteAcompanhante(id);
    if(result){
        return res.status(200).json({success: true});
    }  
    return res.status(404).json({success: false});
});
*/

// Nova versão da API para acompanhante
// CREATE
app.post("/api/acompanhante", async (req, res) => {
  try {
    const {
      tipo_pessoa = null,
      nome_completo = null,
      nome_social = null,
      idade = null,
      email, // obrigatório
      telefone = null,
      genero = null,
      data_nascimento = null,
      senha, // obrigatório
      relacionamento = null
    } = req.body;

    const id = await insertAcompanhante(
      nome_completo,
      nome_social,
      email,
      senha,
      telefone,
      genero,
      data_nascimento
    );

    if (id) return res.status(201).json({ error: false, id });

    return res.status(400).json({ error: true, message: 'Informe email e senha.' });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

// READ ALL ou por email
app.get('/api/acompanhantes', async (req, res) => {
  try {
    const { email } = req.query;

    if (email) {
      
      const acompanhante = await getAcompanhanteByEmail(email);
      
      if (!acompanhante) return res.status(404).json({ error: true, message: 'Acompanhante não encontrado.' });
     
      return res.status(200).json({ error: false, data: acompanhante });
    }

    const lista = await getAcompanhantes();
    return res.status(200).json({ error: false, data: lista });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

// READ pelo id_acompanhante
app.get('/api/acompanhantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const acompanhante = await getAcompanhanteById(id);

    if (!acompanhante) return res.status(404).json({ error: true, message: 'Acompanhante não encontrado.'});

    return res.status(200).json({ error: false, data: acompanhante });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

// UPDATE
app.put("/api/acompanhante/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const {
      email = null,
      senha = null,
      nome_completo = null,
      nome_social = null,
      telefone = null,
      genero = null,
      data_nascimento = null
    } = req.body;

    const toNull = (v) => (v === "" ? null : v);

    const ok = await editAcompanhante(
      id,
      toNull(email),
      toNull(senha),
      toNull(nome_completo),
      toNull(nome_social),
      toNull(telefone),
      toNull(genero),
      toNull(data_nascimento)
    );

    if (!ok) return res.status(400).json({ error: true, message: "Não foi possível atualizar acompanhante." });
    return res.status(200).json({ error: false, message: "Acompanhante atualizado." });
  } catch (e) {
    return res.status(500).json({ error: true, message: 'Erro no servidor.' });
  }
});

// DELETE pelo id_acompanhante
app.delete("/api/acompanhante/:id", auth, async (req, res) => {
    const {id} = req.params;

    const result = await deleteAcompanhante(id);
    
    if (result) {
      res.status(200).json({ error: false, message: 'Acompanhante removido com sucesso!' });
    } else {
      res.status(404).json({ error: true, message: 'Acompanhante não encontrado.' });
    };
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- ☆ CONTEÚDO ☆
// READ
app.get("/conteudos", async (req, res) => {
    try {
        const conteudos = await getConteudos();
        console.log("Conteúdos: ", conteudos);

        res.status(200).render("listaConteudos", { conteudosDoController: conteudos });
    } catch (error) {
        console.error("Erro ao buscar conteúdos:", error);
        res.status(500).send("Erro interno ao carregar conteúdos.");
    }
});

// API envia lista de conteúdos
app.get("/api/conteudos", async (req, res) => {
    try {
        const conteudos = await getConteudos();
        res.status(200).json({ success: true, conteudos });
    } catch (error) {
        console.error("Erro na API de conteúdos:", error);
        res.status(500).json({ success: false, message: "Erro interno ao buscar conteúdos." });
    }
});

app.get("/api/conteudos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const conteudos = await getConteudos();
        const conteudo = conteudos.find(c => c.id == id);

        if (!conteudo) {
            return res.status(404).json({ success: false, message: "Conteúdo não encontrado" });
        }

        return res.status(200).json(conteudo);
    } catch (error) {
        console.error("Erro ao buscar conteúdo:", error);
        return res.status(500).json({ success: false, message: "Erro no servidor" });
    }
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Formulário - CREATE
app.get('/novoconteudo', (req, res) => {
    res.render('novoConteudo', { conteudo: {} });
});

// CREATE
app.post('/conteudos', async (req, res) => {
    const { titulo, descricao, texto, SinaisSintomas, SinaisAlerta } = req.body;
    const data_post = new Date().toISOString().split('T')[0];
    const sucesso = await insertConteudo(titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta);

    if (sucesso) {
        res.redirect('/conteudos');
    } else {
        res.status(400).send("Erro ao cadastrar conteúdo.");
    }
});

// Inserindo pela API
app.post("/api/conteudos", async (req, res) => {
    const { titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta } = req.body;
    const result = await insertConteudo(titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta);

    if (result) {
        return res.status(202).json({ success: true });
    }
    return res.status(400).json({ success: false });
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Formulário - UPDATE
app.get('/editarconteudo/:id', async (req, res) => {
    const { id } = req.params;
    const conteudos = await getConteudos();
    const conteudo = conteudos.find(c => c.id == id);

    if (conteudo) {
        res.render('formConteudo', { conteudo });
    } else {
        res.status(404).send("Conteúdo não encontrado.");
    }
});

// UPDATE
app.post('/conteudos/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta } = req.body;
    const sucesso = await editConteudo(id, titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta);

    if (sucesso) {
        res.redirect('/conteudos');
    } else {
        res.status(400).send("Erro ao editar conteúdo.");
    }
});

// Editando por API
app.put('/api/conteudos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, texto, SinaisSintomas, SinaisAlerta } = req.body;
        const data_post = new Date().toISOString().split('T')[0]; // Atualiza data
        const result = await editConteudo(id, titulo, descricao, texto, data_post, SinaisSintomas, SinaisAlerta);

        if (result) {
            return res.status(200).json({ success: true, message: "Conteúdo atualizado!" });
        }
        return res.status(404).json({ success: false, message: "Conteúdo não encontrado." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro no servidor." });
    }
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// DELETE
app.get('/removerconteudo/:id', async (req, res) => {
    const { id } = req.params;
    const sucesso = await deleteConteudo(id);

    if (sucesso) {
        res.redirect('/conteudos');
    } else {
        res.status(400).send("Erro ao remover conteúdo :(");
    }
});

app.delete('/api/conteudos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteConteudo(id);

        if (result) {
            return res.status(200).json({ success: true, message: "Conteúdo removido!" });
        }
        return res.status(404).json({ success: false, message: "Conteúdo não encontrado." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro no servidor." });
    }
});

// ------------------------------------------------------------ * Registro de Sintoma *
// READ
app.get("/registros", async (req, res) => {
    try{
        const registros = await getRegistro();
        console.log("Conteúdos: ", registros);

        res.status(200).render("listaRegistro", { registrosDoController: registros });
    }catch (error) {
        console.error("Erro ao buscar registros:", error);
        res.status(500).send("Erro interno ao carregar registros.");
    }
});

// API envia lista de registros
app.get("/api/registros", async (req, res) => {
    try {
        const registros = await getRegistro();
        res.status(200).json({ success: true, registros });
    } catch (error) {
        console.error("Erro na API de registros:", error);
        res.status(500).json({ success: false, message: "Erro interno ao buscar registros." });
    }
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Formulário - CREATE
app.get('/novoregistro', (req, res) => {
    res.render('novoregistro', { registro: {} });
});

// CREATE
app.post('/registros', async (req, res) => {
    const {intensidade} = req.body;
    const sucesso = await insertRegistro(intensidade);

    if (sucesso) {
        res.redirect('/registros');
    } else {
        res.status(400).send("Erro ao cadastrar registro.");
    }
});

// Inserindo pela API
app.post("/api/registros", async (req, res) => {
  console.log("Corpo recebido no POST:", req.body);
  const { paciente_id, sintoma_id, intensidade } = req.body;
  const result = await insertRegistro(paciente_id, sintoma_id, intensidade);

  if(result){
      return res.status(201).json({success: true});
  }
  return res.status(400).json({success: false});
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Formulário - UPDATE
app.get('/registros/:id', async (req, res) => {
    const { id } = req.params;
    const registros = await getRegistro();
    const registro = registros.find(c => c.id == id);

    if(registro){
        res.render('formRegistro', { registro });
    }else{
        res.status(404).send("Registro não encontrado.");
    }
});

// UPDATE
app.post('/registros/:id', async (req, res) => {
    const {id} = req.params;
    const {intensidade} = req.body;
    const sucesso = await editRegistro(id, intensidade);

    if(sucesso){
        res.redirect('/registros');
    }else{
        res.status(400).send("Erro ao editar registro.");
    }
});

// Editando por API
app.put('/api/registros/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { intensidade } = req.body;
        const result = await editRegistro(id, intensidade);

        if(result){
            return res.status(200).json({ success: true, message: "Registro atualizado!" });
        }
        return res.status(404).json({ success: false, message: "Registro não encontrado." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro no servidor." });
    }
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// DELETE
app.get('/removerregistro/:id', async (req, res) => {
    const {id} = req.params;
    const sucesso = await deleteRegistro(id);

    if (sucesso) {
        res.redirect('/registros');
    } else {
        res.status(400).send("Erro ao remover registro!");
    }
});

app.delete('/api/registros/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteRegistro(id);

        if(result){
            return res.status(200).json({ success: true, message: "Registro removido!" });
        }
        return res.status(404).json({ success: false, message: "Registro não encontrado." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro no servidor." });
    }
});

// ------------------------------------------------------------ * Sintoma *
// READ
app.get("/sintomas", async (req, res) => {
    try{
        const sintomas = await getSintoma();
        console.log("Sintomas: ", sintomas);

        res.status(200).render("listaSintoma", { sintomasDoController: sintomas });
    }catch (error) {
        console.error("Erro ao buscar sintomas:", error);
        res.status(500).send("Erro interno ao carregar sintomas.");
    }
});

// API envia lista de registros
app.get("/api/sintomas", async (req, res) => {
    try {
        const sintomas = await getSintoma();
        res.status(200).json({ success: true, sintomas });
    } catch (error) {
        console.error("Erro na API de sintomas:", error);
        res.status(500).json({ success: false, message: "Erro interno ao buscar sintomas." });
    }
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Formulário - CREATE
app.get('/novosintoma', (req, res) => {
    res.render('novosintoma', { sintoma: {} });
});

// CREATE
app.post('/sintomas', async (req, res) => {
    const {nome_sintoma} = req.body;
    const sucesso = await insertSintoma(nome_sintoma);

    if (sucesso) {
        res.redirect('/sintomas');
    } else {
        res.status(400).send("Erro ao cadastrar sintoma.");
    }
});

// Inserindo pela API
app.post("/api/sintomas", async (req, res) => {
    console.log("Corpo recebido no POST:", req.body);
    const {nome_sintoma} = req.body;
    const result = await insertSintoma(nome_sintoma);
    if(result){
        return res.status(202).json({success: true});
    }
    return res.status(400).json({success: false});
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Formulário - UPDATE
app.get('/sintomas/:id', async (req, res) => {
    const { id } = req.params;
    const sintomas = await getSintoma();
    const sintoma = sintomas.find(c => c.id == id);

    if(sintoma){
        res.render('formSintomas', { sintoma });
    }else{
        res.status(404).send("Sintoma não encontrado.");
    }
});

// UPDATE
app.post('/sintomas/:id', async (req, res) => {
    const {id} = req.params;
    const {nome_sintoma} = req.body;
    const sucesso = await editSintoma(id, nome_sintoma);

    if(sucesso){
        res.redirect('/sintomas');
    }else{
        res.status(400).send("Erro ao editar sintoma.");
    }
});

// Editando por API
app.put('/api/sintomas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_sintoma } = req.body;
        const result = await editSintoma(id, nome_sintoma);

        if(result){
            return res.status(200).json({ success: true, message: "Sintoma atualizado!" });
        }
        return res.status(404).json({ success: false, message: "Sintoma não encontrado." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro no servidor." });
    }
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// DELETE
app.get('/removersintoma/:id', async (req, res) => {
    const {id} = req.params;
    const sucesso = await deleteSintoma(id);

    if (sucesso) {
        res.redirect('/sintomas');
    } else {
        res.status(400).send("Erro ao remover sintoma!");
    }
});

app.delete('/api/sintomas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteSintoma(id);

        if(result){
            return res.status(200).json({ success: true, message: "Sintoma removido!" });
        }
        return res.status(404).json({ success: false, message: "Sintoma não encontrado." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erro no servidor." });
    }
});

// rota de saúde (teste rápido)
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});
