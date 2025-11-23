/*
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";

// Components
import Header from "../components/Header";

// Fonts
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

const BASE_URL = "http://localhost:3000/api";

export default function PerfilProntuario() {
  const [fontsLoaded] = useFonts({ Comfortaa_400Regular });
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState(null);

  const fetchDadosUsuario = async () => {
    try {
      const tipoUsuario = await AsyncStorage.getItem("tipoUsuario"); // Paciete, Administrador ou Acompanhante?
      const idUsuario = await AsyncStorage.getItem("idUsuario");

      if (!tipoUsuario || !idUsuario) {
        console.log("Usuário não logado");
        return;
      }

      setTipo(tipoUsuario);

      const response = await fetch(`${BASE_URL}/${tipoUsuario}/${idUsuario}`);
      const data = await response.json();

      if (data.success) {
        setUsuario(data[tipoUsuario]);
      } else {
        console.log("Erro ao buscar:", data.message);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDadosUsuario();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#183102" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Usuário não encontrado</Text>
      </View>
    );
  }

  function Campo({ label, valor }) {
    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={Estilo.label}>{label}:</Text>
        <Text style={Estilo.textValue}>{valor}</Text>
      </View>
    );
  }

  return (
    <>
      <Header />
      <ScrollView style={Estilo.container}>
        <View style={Estilo.dados}>
          <Text style={Estilo.nome}>{usuario.nome}</Text>

          <Campo label="Email" valor={usuario.email} />
          <Campo label="Data de Nascimento" valor={new Date(usuario.data_nascimento).toLocaleDateString("pt-BR")} />
          <Campo label="Telefone" valor={usuario.telefone} />
          <Campo label="Gênero" valor={usuario.genero} />

          {tipo === "paciente" && (
            <>
              <Campo label="Cidade" valor={usuario.cidade} />
              <Campo label="Estado" valor={usuario.estado} />
              <Campo label="Tipo Sanguíneo" valor={usuario.tipo_sanguineo} />
            </>
          )}

          {tipo === "administrador" && (
            <>
              <Campo label="Formação" valor={usuario.formacao} />
              <Campo label="Especialidade" valor={usuario.especialidade} />
              <Campo label="Conselho Profissional" valor={usuario.conselho_profissional} />
            </>
          )}

          {tipo === "acompanhante" && (
            <>
              <Campo label="Relação com paciente" valor={usuario.relacao_paciente} />
            </>
          )}

          <TouchableOpacity style={Estilo.button}>
            <Text style={Estilo.buttonText}>Editar informações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E5",
  },
  dados: {
    padding: 30,
  },
  nome: {
    fontSize: 36,
    color: "#183102",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    fontFamily: "Comfortaa_400Regular",
  },
  textValue: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, .5)",
    borderRadius: 5,
    fontFamily: "Comfortaa_400Regular",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "rgba(24, 49, 2, .5)",
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 8,
    width: "60%",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
*/

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:3000";

export default function PerfilProntuario() {
  const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
  const SANGUES = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
  const GENEROS = ["Feminino","Masculino","Não-binário","Prefiro não informar","Outro"];

  const navigation = useNavigation();

  const onlyDate = (v) => {
    if (!v) return "";
    const s = String(v);
    return s.split("T")[0].split(" ")[0].slice(0, 10);
  };

  const emailOk = (s) => !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/.test(String(s).trim());
  const ufOk = (s) => !s || UFS.includes(String(s).toUpperCase());
  const sangueOk = (s) => !s || SANGUES.includes(String(s).toUpperCase());
  const foneOk = (s) => !s || /^\d{10,11}$/.test(String(s).trim());
  const dateOk = (s) => !s || /^\d{4}-\d{2}-\d{2}$/.test(String(s).trim());

  const [tipo, setTipo] = useState(null);
  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [paciente, setPaciente] = useState({
    id: "",
    nome: "",
    nome_social: "",
    email: "",
    senha: "",
    celular: "",
    genero: "",
    data_nascimento: "",
    cidade: "",
    estado: "",
    tipo_sanguineo: "",
    condicoes_medicas: "",
    medicacao: "",
   contato_emergencia: "",
   unidades_de_saude: "",
  });

  const [meusAcompanhantes, setMeusAcompanhantes] = useState([]);
  const [loadingAcompanhantes, setLoadingAcompanhantes] = useState(false);
  
  const [acomp, setAcomp] = useState({
    id: "",
    email: "",
    senha: "",
    nome_completo: "",
    nome_social: "",
    telefone: "",
    genero: "",
    data_nascimento: "",
  });

  const [admin, setAdmin] = useState({
    id: "",
    nome: "",
    nome_social: "",
    email: "",
    senha: "",
    data_nascimento: "",
    genero: "",
    telefone: "",
    conselho_profissional: "",
    formacao: "",
    registro_profissional: "",
    especialidade: "",
  });

  const [vinculos, setVinculos] = useState([]);
  const [pacienteIdDigitado, setPacienteIdDigitado] = useState("");

  const [pacientesSelecionados, setPacientesSelecionados] = useState({});
  const [loadingPaciente, setLoadingPaciente] = useState(false);

  const [pacientesEmEdicao, setPacientesEmEdicao] = useState({});
  const [salvandoPaciente, setSalvandoPaciente] = useState(false);

  const fetchQuemSouEu = useCallback(async () => {
    try {
      const t = localStorage.getItem("token");
      
      const tp = localStorage.getItem("userTipo");
      
      const uid = localStorage.getItem("userId");

      if (!t || !tp || !uid) {
        alert("Sessão", "Você não está logado.");
        return;
      }
      
      setToken(t);
      
      setTipo(tp);
      
      setId(uid);

      if (tp === "administrador") {
        const resp = await fetch(`${API_BASE}/api/administradores`);
        const data = await resp.json();
        
        if (!resp.ok || data?.error || !data?.administradores) {
          throw new Error(data?.message || "Não foi possível carregar administrador.");
        }
        
        // Busca o admin específico pelo ID
        const adminData = data.administradores.find(a => String(a.id) === String(uid));
        
        if (!adminData) {
          throw new Error("Administrador não encontrado.");
        }
        
        setAdmin({
          id: String(adminData.id),
          nome: adminData.nome ?? "",
          nome_social: adminData.nome_social ?? "",
          email: adminData.email ?? "",
          senha: "",
          data_nascimento: onlyDate(adminData.data_nascimento) ?? "",
          genero: adminData.genero ?? "",
          telefone: adminData.telefone ?? "",
          conselho_profissional: adminData.conselho_profissional ?? "",
          formacao: adminData.formacao ?? "",
          registro_profissional: adminData.registro_profissional ?? "",
          especialidade: adminData.especialidade ?? "",
        });
      } else if (tp === "paciente") {
        const resp = await fetch(`${API_BASE}/api/pacientes/${uid}`);
        
        const data = await resp.json();
        
        if (!resp.ok || data?.error || !data?.data) {
          throw new Error(data?.message || "Não foi possível carregar paciente.");
        }
        
        const p = data.data;

        setPaciente({
          id: String(p.id),
          nome: p.nome ?? "",
          nome_social: p.nome_social ?? "",
          email: p.email ?? "",
          senha: "",
          celular: p.celular ?? "",
          genero: p.genero ?? "",
          data_nascimento: onlyDate(p.data_nascimento) ?? "",
          cidade: p.cidade ?? "",
          estado: p.estado ?? "",
          tipo_sanguineo: p.tipo_sanguineo ?? "",
          condicoes_medicas: p.condicoes_medicas ?? "",
          medicacao: p.medicacao ?? "",
          contato_emergencia: p.contato_emergencia ?? "",
          unidades_de_saude: p.unidades_de_saude ?? "",
        });

        try {
          setLoadingAcompanhantes(true);
          const r = await fetch(`${API_BASE}/api/pacientes/${p.id}/acompanhantes`, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
          });
          const j = await r.json();
          if (!r.ok || j?.error) throw new Error(j?.message || "Falha ao carregar acompanhantes.");
          setMeusAcompanhantes(Array.isArray(j.data) ? j.data : []);
        } catch (e) {
          console.log("Erro ao carregar acompanhantes:", e.message);
        } finally {
          setLoadingAcompanhantes(false);
        }
      } else if (tp === "acompanhante") {
        const resp = await fetch(`${API_BASE}/api/acompanhantes/${uid}`);
        const data = await resp.json();
        if (!resp.ok || data?.error || !data?.data) {
          throw new Error(data?.message || "Não foi possível carregar acompanhante.");
        }
        const a = data.data;
        setAcomp({
          id: String(a.id),
          email: a.email ?? "",
          senha: "", // vazio para não forçar troca
          nome_completo: a.nome_completo ?? "",
          nome_social: a.nome_social ?? "",
          telefone: a.telefone ?? "",
          genero: a.genero ?? "",
          data_nascimento: onlyDate(a.data_nascimento) ?? "",
        });

        // carrega vínculos do acompanhante
        const respV = await fetch(`${API_BASE}/api/acompanhante/${uid}/pacientes`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        const dV = await respV.json();
        if (respV.ok && !dV?.error) {
          setVinculos(dV.data || []);
        }
      }
    } catch (e) {
      alert("Erro", e.message || "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuemSouEu();
  }, [fetchQuemSouEu]);

  async function salvarAdmin() {
    try {
      if (admin.email && !emailOk(admin.email)) {
        return alert("E-mail inválido", "Use o formato algo@dominio.com");
      }
      if (admin.telefone && !foneOk(admin.telefone)) {
        return alert("Telefone inválido", "Use apenas números (10 ou 11 dígitos, com DDD).");
      }
      const soData = onlyDate(admin.data_nascimento);
      if (admin.data_nascimento && !dateOk(soData)) {
        return alert("Data inválida", "Use o formato YYYY-MM-DD.");
      }

      setSalvando(true);
      const payload = {
        nome: admin.nome || null,
        nome_social: admin.nome_social || null,
        email: admin.email || null,
        senha: admin.senha || null,
        data_nascimento: soData || null,
        genero: admin.genero || null,
        telefone: admin.telefone || null,
        conselho_profissional: admin.conselho_profissional || null,
        formacao: admin.formacao || null,
        registro_profissional: admin.registro_profissional || null,
        especialidade: admin.especialidade || null,
      };

      const resp = await fetch(`${API_BASE}/api/administrador/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(payload),
      });

      let data;
      try { data = await resp.json(); } catch {}

      if (!resp.ok || data?.error) {
        throw new Error(data?.message || "Falha ao salvar administrador.");
      }

      alert("Sucesso", "Seus dados foram atualizados.");
      setAdmin({ ...admin, senha: "" }); // limpa campo senha
    } catch (e) {
      alert("Erro", e.message || "Erro ao atualizar.");
    } finally {
      setSalvando(false);
    }
  }

  async function salvarPaciente() {
    try {
      if (paciente.email && !emailOk(paciente.email)) {
        return alert("E-mail inválido", "Use o formato algo@dominio.com (opcionalmente .br).");
      } 
      if (paciente.celular && !foneOk(paciente.celular)) {
        return alert("Celular inválido", "Informe apenas números (10 ou 11 dígitos, com DDD). Ex.: 11987654321");
      }
      if (paciente.data_nascimento && !dateOk(paciente.data_nascimento)) {
        return alert("Data inválida", "Use o formato YYYY-MM-DD. Ex.: 1980-05-17");
      }
      if (paciente.estado && !ufOk(paciente.estado)) {
        return alert("UF inválida", "Use uma UF válida (ex.: SP, RJ, MG...).");
      }
      if (paciente.tipo_sanguineo && !sangueOk(paciente.tipo_sanguineo)) {
        return alert("Tipo sanguíneo inválido", "Valores aceitos: A+, A-, B+, B-, AB+, AB-, O+, O-.");
      }

      setSalvando(true);
      const payload = {
        nome: paciente.nome || null,
        nome_social: paciente.nome_social || null,
        email: paciente.email || null,
        senha: paciente.senha || null,
        celular: paciente.celular || null,
        genero: paciente.genero || null,
        data_nascimento: onlyDate(paciente.data_nascimento) || null,
        cidade: paciente.cidade || null,
        estado: paciente.estado ? paciente.estado.toUpperCase() : null,
        tipo_sanguineo: paciente.tipo_sanguineo ? paciente.tipo_sanguineo.toUpperCase() : null,
        condicoes_medicas: paciente.condicoes_medicas || null,
        medicacao: paciente.medicacao || null,
        contato_emergencia: paciente.contato_emergencia || null,
        unidades_de_saude: paciente.unidades_de_saude || null,
      };

      const resp = await fetch(`${API_BASE}/api/pacientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok || data?.error) {
        throw new Error(data?.message || "Falha ao salvar paciente!");
      }

      alert("Sucesso", "Seus dados foram atualizados!");
      setPaciente({ ...paciente, senha: "" });
    } catch (e) {
      alert("Erro", e.message || "Erro ao atualizar!");
    } finally {
      setSalvando(false);
    }
  }

  /*
  async function removerVinculo(acompanhanteId) {
    try {
      const resp = await fetch(`${API_BASE}/api/vinculos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        body: JSON.stringify({
          acompanhante_id: acompanhanteId,
          paciente_id: paciente.id,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || data?.error) throw new Error(data?.message || "Erro ao desvincular!");
      alert("Vínculo removido!");
      setMeusAcompanhantes((prev) => prev.filter((i) => i.id !== acompanhanteId));
    } catch (e) {
      alert(e.message || "Erro ao desvincular!");
    }
  }
  */

  async function salvarAcomp() {
  try {
    if (acomp.email && !emailOk(acomp.email)) {
      return alert("E-mail inválido. Use o formato algo@dominio.com");
    }
    if (acomp.telefone && !foneOk(acomp.telefone)) {
      return alert("Telefone inválido. Use apenas números (10 ou 11 dígitos, com DDD).");
    }
    const soData = onlyDate(acomp.data_nascimento);
    if (acomp.data_nascimento && !dateOk(soData)) {
      return alert("Data inválida. Use o formato YYYY-MM-DD.");
    }

    setSalvando(true);
    const payload = {
      email: acomp.email || null,
      senha: acomp.senha || null,
      nome_completo: acomp.nome_completo || null,
      nome_social: acomp.nome_social || null,
      telefone: acomp.telefone || null,
      genero: acomp.genero || null,
      data_nascimento: soData || null,
    };

    const resp = await fetch(`${API_BASE}/api/acompanhante/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify(payload),
    });

    let data;
    try { data = await resp.json(); } catch {}

    if (!resp.ok || data?.error) {
      throw new Error(data?.message || "Falha ao salvar acompanhante.");
    }

    alert("Sucesso", "Seus dados foram atualizados.");
    setAcomp({ ...acomp, senha: "" }); // limpa campo senha
  } catch (e) {
    alert("Erro", e.message || "Erro ao atualizar.");
  } finally {
    setSalvando(false);
  }
}

  // Vincular paciente por ID (acompanhante)
  async function vincular() {
    const pid = Number(pacienteIdDigitado);
    if (!pid) {
      alert("Atenção", "Informe um ID de paciente válido.");
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}/api/vinculos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paciente_id: pid }),
      });
      const data = await resp.json();
      if (!resp.ok || data?.error) {
        throw new Error(data?.message || "Não foi possível vincular.");
      }
      alert("Sucesso", "Vínculo criado.");
      setPacienteIdDigitado("");
      // recarrega vínculos
      const respV = await fetch(`${API_BASE}/api/acompanhante/${id}/pacientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dV = await respV.json();
      if (respV.ok && !dV?.error) setVinculos(dV.data || []);
    } catch (e) {
      alert("Erro", e.message || "Falha ao vincular.");
    }
  }

  /*
  // Remover vínculo
  async function desvincular(pacienteId) {
    try {
      const resp = await fetch(`${API_BASE}/api/vinculos`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paciente_id: Number(pacienteId) }),
      });
      const data = await resp.json();
      if (!resp.ok || data?.error) {
        throw new Error(data?.message || "Não foi possível desvincular.");
      }
      alert("Sucesso", "Vínculo removido.");
      setVinculos((old) => old.filter((p) => String(p.id) !== String(pacienteId)));
    } catch (e) {
      alert("Erro", e.message || "Falha ao desvincular.");
    }
  }
  */

  // Função para PACIENTE remover vínculo com acompanhante - CORRIGIDA
async function removerVinculo(acompanhanteId) {
  try {
    const resp = await fetch(`${API_BASE}/api/vinculos`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: token ? `Bearer ${token}` : undefined 
      },
      body: JSON.stringify({
        acompanhante_id: acompanhanteId,
        paciente_id: id, // Usa o ID do paciente logado
      }),
    });
    
    const data = await resp.json();
    
    if (!resp.ok || data?.error) {
      throw new Error(data?.message || "Erro ao desvincular!");
    }
    
    alert("Sucesso", "Vínculo removido!");
    
    // Atualiza a lista removendo o acompanhante
    setMeusAcompanhantes((prev) => 
      prev.filter((item) => item.id !== acompanhanteId)
    );
  } catch (e) {
    alert("Erro", e.message || "Erro ao desvincular!");
  }
}

// Função para ACOMPANHANTE remover vínculo com paciente - CORRIGIDA
async function desvincular(pacienteId) {
  try {
    const resp = await fetch(`${API_BASE}/api/vinculos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        acompanhante_id: id, // Usa o ID do acompanhante logado
        paciente_id: pacienteId 
      }),
    });
    
    const data = await resp.json();
    
    if (!resp.ok || data?.error) {
      throw new Error(data?.message || "Não foi possível desvincular.");
    }
    
    alert("Sucesso", "Vínculo removido.");
    
    // Atualiza a lista removendo o paciente
    setVinculos((old) => 
      old.filter((p) => String(p.id) !== String(pacienteId))
    );
  } catch (e) {
    alert("Erro", e.message || "Falha ao desvincular.");
  }
}

// Função para buscar dados de um paciente específico
async function carregarDadosPaciente(pacienteId) {
  if (pacientesSelecionados[pacienteId]) {
    // Se já carregou, limpa (toggle)
    setPacientesSelecionados(prev => {
      const novo = { ...prev };
      delete novo[pacienteId];
      return novo;
    });
    return;
  }
  try {
    setLoadingPaciente(true);
    const resp = await fetch(`${API_BASE}/api/pacientes/${pacienteId}`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    });
    const data = await resp.json();
    
    if (!resp.ok || data?.error) {
      throw new Error(data?.message || "Erro ao carregar paciente");
    }
    setPacientesSelecionados(prev => ({
      ...prev,
      [pacienteId]: data.data
    }));
  } catch (e) {
    alert("Erro", e.message || "Não foi possível carregar dados do paciente");
  } finally {
    setLoadingPaciente(false);
  }
}

// Função para atualizar campo do paciente em edição
function atualizarCampoPaciente(pacienteId, campo, valor) {
  setPacientesEmEdicao(prev => ({
    ...prev,
    [pacienteId]: {
      ...(prev[pacienteId] || pacientesSelecionados[pacienteId]),
      [campo]: valor
    }
  }));
}
// Função para salvar alterações do paciente
async function salvarPacienteVinculado(pacienteId) {
  try {
    const dadosEditados = pacientesEmEdicao[pacienteId];
    if (!dadosEditados) {
      alert("Atenção", "Nenhuma alteração detectada.");
      return;
    }
    // Validações
    if (dadosEditados.email && !emailOk(dadosEditados.email)) {
      return alert("E-mail inválido", "Use o formato algo@dominio.com");
    }
    if (dadosEditados.celular && !foneOk(dadosEditados.celular)) {
      return alert("Celular inválido", "Informe apenas números (10 ou 11 dígitos, com DDD).");
    }
    if (dadosEditados.data_nascimento && !dateOk(onlyDate(dadosEditados.data_nascimento))) {
      return alert("Data inválida", "Use o formato YYYY-MM-DD.");
    }
    if (dadosEditados.estado && !ufOk(dadosEditados.estado)) {
      return alert("UF inválida", "Use uma UF válida (ex.: SP, RJ, MG...).");
    }
    if (dadosEditados.tipo_sanguineo && !sangueOk(dadosEditados.tipo_sanguineo)) {
      return alert("Tipo sanguíneo inválido", "Valores aceitos: A A-, B B-, AB AB-, O O-.");
    }
    setSalvandoPaciente(true);
    const payload = {
      nome: dadosEditados.nome || null,
      nome_social: dadosEditados.nome_social || null,
      email: dadosEditados.email || null,
      senha: null, // Acompanhante não pode alterar senha
      celular: dadosEditados.celular || null,
      genero: dadosEditados.genero || null,
      data_nascimento: onlyDate(dadosEditados.data_nascimento) || null,
      cidade: dadosEditados.cidade || null,
      estado: dadosEditados.estado ? dadosEditados.estado.toUpperCase() : null,
      tipo_sanguineo: dadosEditados.tipo_sanguineo ? dadosEditados.tipo_sanguineo.toUpperCase() : null,
      condicoes_medicas: dadosEditados.condicoes_medicas || null,
      medicacao: dadosEditados.medicacao || null,
      contato_emergencia: dadosEditados.contato_emergencia || null,
      unidades_de_saude: dadosEditados.unidades_de_saude || null,
    };
    const resp = await fetch(`${API_BASE}/api/pacientes/${pacienteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok || data?.error) {
      throw new Error(data?.message || "Falha ao atualizar paciente!");
    }
    alert("Sucesso", "Dados do paciente atualizados com sucesso!");
    
    // Atualiza os dados exibidos
    setPacientesSelecionados(prev => ({
      ...prev,
      [pacienteId]: dadosEditados
    }));
    
    // Limpa estado de edição
    setPacientesEmEdicao(prev => {
      const novo = { ...prev };
      delete novo[pacienteId];
      return novo;
    });
  } catch (e) {
    alert("Erro", e.message || "Erro ao atualizar paciente!");
  } finally {
    setSalvandoPaciente(false);
  }
}

// Função para fazer logout
async function fazerLogout() {
  try {
    // Limpa localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userTipo");
    localStorage.removeItem("userEmail");
    
    // Limpa AsyncStorage
    await AsyncStorage.multiRemove([
      "auth_token",
      "auth_id",
      "auth_role",
      "auth_email",
    ]);
    
    alert("Logout", "Você foi desconectado com sucesso!");
    
    // Navega para a tela de login
    navigation.replace("Login");
  } catch (e) {
    alert("Erro", "Erro ao fazer logout: ", e.message);
  }
}

  if (loading) {
    return (
      <>
        <Header />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10 }}>Carregando...</Text>
        </View>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32, backgroundColor: "#FFF3E5" }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={Estilo.titulo}>Prontuário</Text>

          {/* ID somente leitura */}
          <View style={Estilo.card}>
            <Text style={Estilo.subtitulo}>Seu código</Text>
            <TextInput
              style={[Estilo.input, { opacity: 0.8 }]}
              editable={false}
              value={String(id || "")}
            />
          </View>

          {/* + ADICIONAR bloco para administrador ANTES do bloco de paciente */}
          {tipo === "administrador" ? (
            <>
              {/* Form administrador */}
              <View style={Estilo.card}>
                <Text style={Estilo.subtitulo}>Seus dados</Text>

                <Text style={Estilo.label}>Nome Completo</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Qual o seu nome?"
                  value={admin.nome}
                  onChangeText={(v) => setAdmin({ ...admin, nome: v })}
                />

                <Text style={Estilo.label}>Nome social (opcional)</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Como você prefere ser chamado(a)?"
                  value={admin.nome_social}
                  onChangeText={(v) => setAdmin({ ...admin, nome_social: v })}
                />

                <Text style={Estilo.label}>E-mail</Text>
                <TextInput
                  style={Estilo.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Qual o seu e-mail?"
                  value={admin.email}
                  onChangeText={(v) => setAdmin({ ...admin, email: v })}
                />

                <Text style={Estilo.label}>Senha</Text>
                <TextInput
                  style={Estilo.input}
                  secureTextEntry
                  placeholder="Deixe em branco para não alterar"
                  value={admin.senha}
                  onChangeText={(v) => setAdmin({ ...admin, senha: v })}
                />

                <Text style={Estilo.label}>Telefone</Text>
                <TextInput
                  style={Estilo.input}
                  keyboardType="phone-pad"
                  placeholder="Somente números (com DDD)"
                  value={admin.telefone}
                  onChangeText={(v) => setAdmin({ ...admin, telefone: v })}
                />

                <Text style={Estilo.label}>Gênero</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={admin.genero || ""}
                    onValueChange={(v) => setAdmin({ ...admin, genero: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione o gênero" value="" />
                    {GENEROS.map(g => (
                      <Picker.Item key={g} label={g} value={g} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Data de nascimento</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="AAAA-MM-DD (ex: 1970-06-24)"
                  value={onlyDate(admin.data_nascimento)}
                  onChangeText={(v) => setAdmin({ ...admin, data_nascimento: onlyDate(v) })}
                />

                <Text style={Estilo.label}>Conselho Profissional</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Ex: CRM, CRP, etc."
                  value={admin.conselho_profissional}
                  onChangeText={(v) => setAdmin({ ...admin, conselho_profissional: v })}
                />

                <Text style={Estilo.label}>Formação</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Ex: Medicina, Psicologia"
                  value={admin.formacao}
                  onChangeText={(v) => setAdmin({ ...admin, formacao: v })}
                />

                <Text style={Estilo.label}>Registro Profissional</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Número do registro"
                  value={admin.registro_profissional}
                  onChangeText={(v) => setAdmin({ ...admin, registro_profissional: v })}
                />

                <Text style={Estilo.label}>Especialidade</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Ex: Oncologia, Cardiologia"
                  value={admin.especialidade}
                  onChangeText={(v) => setAdmin({ ...admin, especialidade: v })}
                />

                <TouchableOpacity
                  onPress={salvarAdmin}
                  style={Estilo.botaoPrimario}
                  disabled={salvando}
                >
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={Estilo.textoBotao}>Salvar</Text>}
                </TouchableOpacity>
              </View>

              {/* Botão de Logout para administrador */}
              <View style={{backgroundColor: "#fff", borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6}}>
                <TouchableOpacity
                  onPress={fazerLogout}
                  style={Estilo.botaoLogout}
                >
                  <Text style={Estilo.textoBotaoLogout}>Sair da conta</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : tipo === "paciente" ? (
            <>
              {/* Form paciente */}
              <View style={Estilo.card}>
                <Text style={Estilo.subtitulo}>Seus dados</Text>

                <Text style={Estilo.label}>Nome Completo</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Qual o seu nome?"
                  value={paciente.nome}
                  onChangeText={(v) => setPaciente({ ...paciente, nome: v })}
                />

                <Text style={Estilo.label}>Nome social (opcional)</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Como você prefere ser chamado(a)?"
                  value={paciente.nome_social}
                  onChangeText={(v) => setPaciente({ ...paciente, nome_social: v })}
                />

                <Text style={Estilo.label}>E-mail</Text>
                <TextInput
                  style={Estilo.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Qual o seu e-mail favorito?"
                  value={paciente.email}
                  onChangeText={(v) => setPaciente({ ...paciente, email: v })}
                />

                <Text style={Estilo.label}>Senha</Text>
                <TextInput
                  style={Estilo.input}
                  secureTextEntry
                  placeholder="Deixe em branco para não alterar!"
                  value={paciente.senha}
                  onChangeText={(v) => setPaciente({ ...paciente, senha: v })}
                />

                <Text style={Estilo.label}>Celular</Text>
                <TextInput
                  style={Estilo.input}
                  value={paciente.celular}
                  keyboardType="number-pad"
                  placeholder="Somente números (com DDD)"
                  onChangeText={(v) => setPaciente({ ...paciente, celular: v })}
                />

                <Text style={Estilo.label}>Gênero</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={paciente.genero || ""}
                    onValueChange={(v) => setPaciente({ ...paciente, genero: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione o gênero" value="" />
                    {GENEROS.map(g => (
                      <Picker.Item key={g} label={g} value={g} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Data de nascimento</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="AAAA-MM-DD (ex: 1970-06-24)"
                  value={onlyDate(paciente.data_nascimento)}
                  onChangeText={(v) => setPaciente({ ...paciente, data_nascimento: onlyDate(v) })}
                  />

                <Text style={Estilo.label}>Estado (UF)</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={paciente.estado || ""}
                    onValueChange={(v) => setPaciente({ ...paciente, estado: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione a UF" value="" />
                    {UFS.map(uf => (
                      <Picker.Item key={uf} label={uf} value={uf} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Cidade</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Ex: Londrina"
                  value={paciente.cidade}
                  onChangeText={(v) => setPaciente({ ...paciente, cidade: v })}
                />

                <Text style={Estilo.label}>Tipo sanguíneo</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={paciente.tipo_sanguineo || ""}
                    onValueChange={(v) => setPaciente({ ...paciente, tipo_sanguineo: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione o tipo sanguíneo" value="" />
                    {SANGUES.map(s => (
                      <Picker.Item key={s} label={s} value={s} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Condições médicas (diagnóstico)</Text>
                <TextInput
                  style={[Estilo.input, { height: 90 }]}
                  multiline
                  placeholder="Ex: Câncer de pulmão, DPOC..."
                  value={paciente.condicoes_medicas}
                  onChangeText={(v) => setPaciente({ ...paciente, condicoes_medicas: v })}
                />

                <Text style={Estilo.label}>Medicação</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Quais medicações você toma?"
                  value={paciente.medicacao}
                  onChangeText={(v) => setPaciente({ ...paciente, medicacao: v })}
                />

                <Text style={Estilo.label}>Contato de emergência</Text>
                <TextInput
                  style={Estilo.input}
                  value={paciente.contato_emergencia}
                  placeholder="Contato 1 - 99999999999, Contato 2 - 999..."
                  onChangeText={(v) => setPaciente({ ...paciente, contato_emergencia: v })}
                />

                <Text style={Estilo.label}>Unidades de saúde</Text>
                <TextInput
                  style={Estilo.input}
                  value={paciente.unidades_de_saude}
                  placeholder="Quais unidades de saúde você frequenta?"
                  onChangeText={(v) => setPaciente({ ...paciente, unidades_de_saude: v })}
                />
               
                <TouchableOpacity
                  onPress={salvarPaciente}
                  style={Estilo.botaoPrimario}
                  disabled={salvando}
                >
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={Estilo.textoBotao}>Salvar</Text>}
                </TouchableOpacity>

                <View style={{ marginTop: 24 }}>
                  <Text style={[Estilo.subtitulo, { fontSize: 18, marginBottom: 8 }]}>
                    Meus acompanhantes
                  </Text>

                  {loadingAcompanhantes ? (
                    <ActivityIndicator />
                  ) : meusAcompanhantes.length === 0 ? (
                    <Text style={{ color: "#532C1D" }}>
                      Você ainda não tem acompanhantes vinculados.
                    </Text>
                  ) : (
                    meusAcompanhantes.map((item) => (
                      <View
                        key={item.id}
                        style={{
                          backgroundColor: "#8BAAC4",
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{ color: "#FFF6E5", fontWeight: "600" }}>
                          {item.nome_completo || "(sem nome)"}
                        </Text>
                        <Text style={{ color: "#FFF6E5" }}>{item.email}</Text>

                        <TouchableOpacity
                          onPress={() => removerVinculo(item.id)}
                          style={{
                            marginTop: 10,
                            backgroundColor: "#b91c1c",
                            paddingVertical: 10,
                            borderRadius: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "#FFF6E5", fontWeight: "700" }}>
                            Remover vínculo
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>
              <View style={{backgroundColor: "#fff", borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6}}>
                <TouchableOpacity
                onPress={fazerLogout}
                  style={Estilo.botaoLogout}
               >
                 <Text style={Estilo.textoBotaoLogout}>Sair da conta</Text>
               </TouchableOpacity>
              </View>
            </>
          ) : (
<>
              {/* Form acompanhante */}
              <View style={Estilo.card}>
                <Text style={Estilo.subtitulo}>Seus dados</Text>

                <Text style={Estilo.label}>Nome completo</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Qual o seu nome?"
                  value={acomp.nome_completo}
                  onChangeText={(v) => setAcomp({ ...acomp, nome_completo: v })}
                />

                <Text style={Estilo.label}>Nome social</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Como você prefere ser chamado(a)?"
                  value={acomp.nome_social}
                  onChangeText={(v) => setAcomp({ ...acomp, nome_social: v })}
                />

                <Text style={Estilo.label}>E-mail</Text>
                <TextInput
                  style={Estilo.input}
                  autoCapitalize="none"
                  placeholder="Qual o seu e-mail favorito?"
                  value={acomp.email}
                  onChangeText={(v) => setAcomp({ ...acomp, email: v })}
                />

                <Text style={Estilo.label}>Senha</Text>
                <TextInput
                  style={Estilo.input}
                  secureTextEntry
                  placeholder="Deixe em branco para não trocar!"
                  value={acomp.senha}
                  onChangeText={(v) => setAcomp({ ...acomp, senha: v })}
                />

                <Text style={Estilo.label}>Telefone</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Somente números (com DDD)"
                  value={acomp.telefone}
                  onChangeText={(v) => setAcomp({ ...acomp, telefone: v })}
                />

                <Text style={Estilo.label}>Gênero</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={acomp.genero || ""}
                    onValueChange={(v) => setAcomp({ ...acomp, genero: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione o gênero" value="" />
                    {GENEROS.map(g => (
                      <Picker.Item key={g} label={g} value={g} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Data de nascimento</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="AAAA-MM-DD (ex: 1970-06-24)"
                  value={acomp.data_nascimento}
                  onChangeText={(v) => setAcomp({ ...acomp, data_nascimento: v })}
                />

                <TouchableOpacity
                  onPress={salvarAcomp}
                  style={Estilo.botaoPrimario}
                  disabled={salvando}
                >
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={Estilo.textoBotao}>Salvar</Text>}
                </TouchableOpacity>
              </View>

              {/* Vínculo Acompanhante x Paciente */}
              <View style={Estilo.card}>
                <Text style={Estilo.subtitulo}>Vínculos com Pacientes</Text>

                <Text style={Estilo.label}>Vincular por código do Paciente</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Digite o código de seu pacinte"
                  keyboardType="numeric"
                  value={pacienteIdDigitado}
                  onChangeText={setPacienteIdDigitado}
                />
                <TouchableOpacity onPress={vincular} style={Estilo.botaoSecundario}>
                  <Text style={Estilo.textoBotaoSec}>Vincular</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 16 }}>
                  <Text style={Estilo.subtitulo}>Meus pacientes</Text>
                  {vinculos.length === 0 ? (
                    <Text style={{ color: "#333", marginTop: 8 }}>Nenhum vínculo ainda.</Text>
                  ) : (
                    vinculos.map((p) => (
                      <View key={p.id} style={Estilo.itemVinculo}>
                        <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "600", fontSize: 16 }}>
                          {p.nome ?? "(sem nome)"} - Código: {p.id}
                        </Text>
                        <Text style={{ color: "#666", marginBottom: 8 }}>{p.email}</Text>
                        
                        <TouchableOpacity
                          onPress={() => carregarDadosPaciente(p.id)}
                          style={{
                            backgroundColor: "#015184",
                            borderRadius: 10,
                            paddingVertical: 12,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>
                            {pacientesSelecionados[p.id] ? "Ocultar dados" : "Ver dados completos"}
                          </Text>
                        </TouchableOpacity>
                        {/* Exibe dados completos do paciente quando expandido */}
                        {pacientesSelecionados[p.id] && (
                          <View style={Estilo.dadosPaciente}>
                            {loadingPaciente ? (
                              <ActivityIndicator />
                            ) : (
                              <>
                                <Text style={Estilo.dadosTitulo}>Dados do paciente</Text>                                
                               {/* Nome completo */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Nome completo:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Nome completo"
                                   value={
                                     pacientesEmEdicao[p.id]?.nome ?? 
                                     pacientesSelecionados[p.id].nome ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'nome', v)}
                                 />
                               </View>
                               {/* Nome social */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Nome social:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Nome social"
                                   value={
                                     pacientesEmEdicao[p.id]?.nome_social ?? 
                                     pacientesSelecionados[p.id].nome_social ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'nome_social', v)}
                                 />
                               </View>
                               {/* Email */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Email:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="email@exemplo.com"
                                   autoCapitalize="none"
                                   keyboardType="email-address"
                                   value={
                                     pacientesEmEdicao[p.id]?.email ?? 
                                     pacientesSelecionados[p.id].email ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'email', v)}
                                 />
                               </View>
                               {/* Celular */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Celular:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="11987654321"
                                   keyboardType="number-pad"
                                   value={
                                     pacientesEmEdicao[p.id]?.celular ?? 
                                     pacientesSelecionados[p.id].celular ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'celular', v)}
                                 />
                               </View>
                               {/* Gênero */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Gênero:</Text>
                                 <View style={Estilo.pickerWrapEdicao}>
                                   <Picker
                                     selectedValue={
                                       pacientesEmEdicao[p.id]?.genero ?? 
                                       pacientesSelecionados[p.id].genero ?? ""
                                     }
                                     onValueChange={(v) => atualizarCampoPaciente(p.id, 'genero', v)}
                                     style={Estilo.pickerEdicao}
                                     dropdownIconColor="#015184"
                                   >
                                     <Picker.Item label="Selecione" value="" />
                                     {GENEROS.map(g => (
                                       <Picker.Item key={g} label={g} value={g} />
                                     ))}
                                   </Picker>
                                 </View>
                               </View>
                               {/* Data de nascimento */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Data de nascimento:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="YYYY-MM-DD"
                                   value={
                                     onlyDate(pacientesEmEdicao[p.id]?.data_nascimento) ?? 
                                     onlyDate(pacientesSelecionados[p.id].data_nascimento) ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'data_nascimento', v)}
                                 />
                               </View>
                               {/* Cidade */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Cidade:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Nome da cidade"
                                   value={
                                     pacientesEmEdicao[p.id]?.cidade ?? 
                                     pacientesSelecionados[p.id].cidade ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'cidade', v)}
                                 />
                               </View>
                               {/* Estado */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Estado (UF):</Text>
                                 <View style={Estilo.pickerWrapEdicao}>
                                   <Picker
                                     selectedValue={
                                       pacientesEmEdicao[p.id]?.estado ?? 
                                       pacientesSelecionados[p.id].estado ?? ""
                                     }
                                     onValueChange={(v) => atualizarCampoPaciente(p.id, 'estado', v)}
                                     style={Estilo.pickerEdicao}
                                     dropdownIconColor="#015184"
                                   >
                                     <Picker.Item label="Selecione a UF" value="" />
                                     {UFS.map(uf => (
                                       <Picker.Item key={uf} label={uf} value={uf} />
                                     ))}
                                   </Picker>
                                 </View>
                               </View>
                               {/* Tipo sanguíneo */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Tipo sanguíneo:</Text>
                                 <View style={Estilo.pickerWrapEdicao}>
                                   <Picker
                                     selectedValue={
                                       pacientesEmEdicao[p.id]?.tipo_sanguineo ?? 
                                       pacientesSelecionados[p.id].tipo_sanguineo ?? ""
                                     }
                                     onValueChange={(v) => atualizarCampoPaciente(p.id, 'tipo_sanguineo', v)}
                                     style={Estilo.pickerEdicao}
                                     dropdownIconColor="#015184"
                                   >
                                     <Picker.Item label="Selecione" value="" />
                                     {SANGUES.map(s => (
                                       <Picker.Item key={s} label={s} value={s} />
                                     ))}
                                   </Picker>
                                 </View>
                               </View>
                               {/* Condições médicas */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Condições médicas:</Text>
                                 <TextInput
                                   style={[Estilo.inputEdicao, { height: 70 }]}
                                   placeholder="Diagnósticos..."
                                   multiline
                                   value={
                                     pacientesEmEdicao[p.id]?.condicoes_medicas ?? 
                                     pacientesSelecionados[p.id].condicoes_medicas ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'condicoes_medicas', v)}
                                 />
                               </View>
                               {/* Medicação */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Medicação:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Medicamentos em uso"
                                   value={
                                     pacientesEmEdicao[p.id]?.medicacao ?? 
                                     pacientesSelecionados[p.id].medicacao ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'medicacao', v)}
                                 />
                               </View>
                               {/* Contato de emergência */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Contato de emergência:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Telefone(s) de emergência"
                                   value={
                                     pacientesEmEdicao[p.id]?.contato_emergencia ?? 
                                     pacientesSelecionados[p.id].contato_emergencia ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'contato_emergencia', v)}
                                 />
                               </View>
                               {/* Unidades de saúde */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Unidades de saúde:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Hospitais/clínicas frequentadas"
                                   value={
                                     pacientesEmEdicao[p.id]?.unidades_de_saude ?? 
                                     pacientesSelecionados[p.id].unidades_de_saude ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'unidades_de_saude', v)}
                                 />
                               </View>
                               {/* Botão de Atualizar */}
                               <TouchableOpacity
                                 onPress={() => salvarPacienteVinculado(p.id)}
                                 style={Estilo.botaoAtualizar}
                                 disabled={salvandoPaciente}
                               >
                                 {salvandoPaciente ? (
                                   <ActivityIndicator color="#FFF" />
                                 ) : (
                                   <Text style={Estilo.textoBotaoAtualizar}>
                                     Atualizar dados do paciente
                                   </Text>
                                 )}
                               </TouchableOpacity>
                              </>
                            )}
                          </View>
                        )}
                      </View>
                        `{/*<Text>{p.id} — {p.nome ?? "(sem nome)"} — {p.email}</Text>*/}
                        <Text style={{margin: 0, padding: 0}}>Deseja remover {p.nome ?? "(sem nome)"}?</Text>
                        <TouchableOpacity
                          onPress={() => desvincular(p.id)}
                          style={Estilo.btnRemover}
                        >
                          <Text style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Remover</Text>
                        </TouchableOpacity>
                        <View style={{ height: 2, backgroundColor: '#8BAAC4', margin: 0, marginVertical: 20, marginHorizontal: 10, borderRadius: 1 }} />
                      </View>
                    ))
                  )}
                </View>
              </View>
              {/* Botão de Logout */}
              <View style={{backgroundColor: "#fff", borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6}}>
                <TouchableOpacity
                onPress={fazerLogout}
                  style={Estilo.botaoLogout}
               >
                 <Text style={Estilo.textoBotaoLogout}>Sair da conta</Text>
               </TouchableOpacity>
             </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );

  return (
    <>
      <Header />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32, backgroundColor: "#FFF3E5" }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={Estilo.titulo}>Prontuário</Text>

          {/* ID somente leitura */}
          <View style={Estilo.card}>
            <Text style={Estilo.subtitulo}>Seu código</Text>
            <TextInput
              style={[Estilo.input, { opacity: 0.8 }]}
              editable={false}
              value={String(id || "")}
            />
          </View>

          {tipo === "paciente" ? (
            <>
              {/* Form paciente */}
              <View style={Estilo.card}>
                <Text style={Estilo.subtitulo}>Seus dados</Text>

                <Text style={Estilo.label}>Nome Completo</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Qual o seu nome?"
                  value={paciente.nome}
                  onChangeText={(v) => setPaciente({ ...paciente, nome: v })}
                />

                <Text style={Estilo.label}>Nome social (opcional)</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Como você prefere ser chamado(a)?"
                  value={paciente.nome_social}
                  onChangeText={(v) => setPaciente({ ...paciente, nome_social: v })}
                />

                <Text style={Estilo.label}>E-mail</Text>
                <TextInput
                  style={Estilo.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Qual o seu e-mail favorito?"
                  value={paciente.email}
                  onChangeText={(v) => setPaciente({ ...paciente, email: v })}
                />

                <Text style={Estilo.label}>Senha</Text>
                <TextInput
                  style={Estilo.input}
                  secureTextEntry
                  placeholder="Deixe em branco para não alterar!"
                  value={paciente.senha}
                  onChangeText={(v) => setPaciente({ ...paciente, senha: v })}
                />

                <Text style={Estilo.label}>Celular</Text>
                <TextInput
                  style={Estilo.input}
                  value={paciente.celular}
                  keyboardType="number-pad"
                  placeholder="Somente números (com DDD)"
                  onChangeText={(v) => setPaciente({ ...paciente, celular: v })}
                />

                <Text style={Estilo.label}>Gênero</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={paciente.genero || ""}
                    onValueChange={(v) => setPaciente({ ...paciente, genero: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione o gênero" value="" />
                    {GENEROS.map(g => (
                      <Picker.Item key={g} label={g} value={g} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Data de nascimento</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="AAAA-MM-DD (ex: 1970-06-24)"
                  value={onlyDate(paciente.data_nascimento)}
                  onChangeText={(v) => setPaciente({ ...paciente, data_nascimento: onlyDate(v) })}
                  />

                <Text style={Estilo.label}>Estado (UF)</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={paciente.estado || ""}
                    onValueChange={(v) => setPaciente({ ...paciente, estado: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione a UF" value="" />
                    {UFS.map(uf => (
                      <Picker.Item key={uf} label={uf} value={uf} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Cidade</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Ex: Londrina"
                  value={paciente.cidade}
                  onChangeText={(v) => setPaciente({ ...paciente, cidade: v })}
                />

                <Text style={Estilo.label}>Tipo sanguíneo</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={paciente.tipo_sanguineo || ""}
                    onValueChange={(v) => setPaciente({ ...paciente, tipo_sanguineo: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione o tipo sanguíneo" value="" />
                    {SANGUES.map(s => (
                      <Picker.Item key={s} label={s} value={s} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Condições médicas (diagnóstico)</Text>
                <TextInput
                  style={[Estilo.input, { height: 90 }]}
                  multiline
                  placeholder="Ex: Câncer de pulmão, DPOC..."
                  value={paciente.condicoes_medicas}
                  onChangeText={(v) => setPaciente({ ...paciente, condicoes_medicas: v })}
                />

                <Text style={Estilo.label}>Medicação</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Quais medicações você toma?"
                  value={paciente.medicacao}
                  onChangeText={(v) => setPaciente({ ...paciente, medicacao: v })}
                />

                <Text style={Estilo.label}>Contato de emergência</Text>
                <TextInput
                  style={Estilo.input}
                  value={paciente.contato_emergencia}
                  placeholder="Contato 1 - 99999999999, Contato 2 - 999..."
                  onChangeText={(v) => setPaciente({ ...paciente, contato_emergencia: v })}
                />

                <Text style={Estilo.label}>Unidades de saúde</Text>
                <TextInput
                  style={Estilo.input}
                  value={paciente.unidades_de_saude}
                  placeholder="Quais unidades de saúde você frequenta?"
                  onChangeText={(v) => setPaciente({ ...paciente, unidades_de_saude: v })}
                />
               
                <TouchableOpacity
                  onPress={salvarPaciente}
                  style={Estilo.botaoPrimario}
                  disabled={salvando}
                >
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={Estilo.textoBotao}>Salvar</Text>}
                </TouchableOpacity>

                <View style={{ marginTop: 24 }}>
                  <Text style={[Estilo.subtitulo, { fontSize: 18, marginBottom: 8 }]}>
                    Meus acompanhantes
                  </Text>

                  {loadingAcompanhantes ? (
                    <ActivityIndicator />
                  ) : meusAcompanhantes.length === 0 ? (
                    <Text style={{ color: "#532C1D" }}>
                      Você ainda não tem acompanhantes vinculados.
                    </Text>
                  ) : (
                    meusAcompanhantes.map((item) => (
                      <View
                        key={item.id}
                        style={{
                          backgroundColor: "#8BAAC4",
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{ color: "#FFF6E5", fontWeight: "600" }}>
                          {item.nome_completo || "(sem nome)"}
                        </Text>
                        <Text style={{ color: "#FFF6E5" }}>{item.email}</Text>

                        <TouchableOpacity
                          onPress={() => removerVinculo(item.id)}
                          style={{
                            marginTop: 10,
                            backgroundColor: "#b91c1c",
                            paddingVertical: 10,
                            borderRadius: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "#FFF6E5", fontWeight: "700" }}>
                            Remover vínculo
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>
              <View style={{backgroundColor: "#fff", borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6}}>
                <TouchableOpacity
                onPress={fazerLogout}
                  style={Estilo.botaoLogout}
               >
                 <Text style={Estilo.textoBotaoLogout}>Sair da conta</Text>
               </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Form acompanhante */}
              <View style={Estilo.card}>
                <Text style={Estilo.subtitulo}>Seus dados</Text>

                <Text style={Estilo.label}>Nome completo</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Qual o seu nome?"
                  value={acomp.nome_completo}
                  onChangeText={(v) => setAcomp({ ...acomp, nome_completo: v })}
                />

                <Text style={Estilo.label}>Nome social</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Como você prefere ser chamado(a)?"
                  value={acomp.nome_social}
                  onChangeText={(v) => setAcomp({ ...acomp, nome_social: v })}
                />

                <Text style={Estilo.label}>E-mail</Text>
                <TextInput
                  style={Estilo.input}
                  autoCapitalize="none"
                  placeholder="Qual o seu e-mail favorito?"
                  value={acomp.email}
                  onChangeText={(v) => setAcomp({ ...acomp, email: v })}
                />

                <Text style={Estilo.label}>Senha</Text>
                <TextInput
                  style={Estilo.input}
                  secureTextEntry
                  placeholder="Deixe em branco para não trocar!"
                  value={acomp.senha}
                  onChangeText={(v) => setAcomp({ ...acomp, senha: v })}
                />

                <Text style={Estilo.label}>Telefone</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Somente números (com DDD)"
                  value={acomp.telefone}
                  onChangeText={(v) => setAcomp({ ...acomp, telefone: v })}
                />

                <Text style={Estilo.label}>Gênero</Text>
                <View style={Estilo.pickerWrap}>
                  <Picker
                    selectedValue={acomp.genero || ""}
                    onValueChange={(v) => setAcomp({ ...acomp, genero: v })}
                    style={Estilo.picker}
                    itemStyle={Estilo.pickerItem}
                    dropdownIconColor="#FFF6E5"
                    mode="dropdown"
                  >
                    <Picker.Item label="Selecione o gênero" value="" />
                    {GENEROS.map(g => (
                      <Picker.Item key={g} label={g} value={g} />
                    ))}
                  </Picker>
                </View>

                <Text style={Estilo.label}>Data de nascimento</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="AAAA-MM-DD (ex: 1970-06-24)"
                  value={acomp.data_nascimento}
                  onChangeText={(v) => setAcomp({ ...acomp, data_nascimento: v })}
                />

                <TouchableOpacity
                  onPress={salvarAcomp}
                  style={Estilo.botaoPrimario}
                  disabled={salvando}
                >
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={Estilo.textoBotao}>Salvar</Text>}
                </TouchableOpacity>
              </View>

              {/* Vínculo Acompanhante x Paciente */}
              <View style={Estilo.card}>
                <Text style={Estilo.subtitulo}>Vínculos com Pacientes</Text>

                <Text style={Estilo.label}>Vincular por código do Paciente</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Digite o código de seu pacinte"
                  keyboardType="numeric"
                  value={pacienteIdDigitado}
                  onChangeText={setPacienteIdDigitado}
                />
                <TouchableOpacity onPress={vincular} style={Estilo.botaoSecundario}>
                  <Text style={Estilo.textoBotaoSec}>Vincular</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 16 }}>
                  <Text style={Estilo.subtitulo}>Meus pacientes</Text>
                  {vinculos.length === 0 ? (
                    <Text style={{ color: "#333", marginTop: 8 }}>Nenhum vínculo ainda.</Text>
                  ) : (
                    vinculos.map((p) => (
                      <View key={p.id} style={Estilo.itemVinculo}>
                        <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "600", fontSize: 16 }}>
                          {p.nome ?? "(sem nome)"} - Código: {p.id}
                        </Text>
                        <Text style={{ color: "#666", marginBottom: 8 }}>{p.email}</Text>
                        
                        <TouchableOpacity
                          onPress={() => carregarDadosPaciente(p.id)}
                          style={{
                            backgroundColor: "#015184",
                            borderRadius: 10,
                            paddingVertical: 12,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>
                            {pacientesSelecionados[p.id] ? "Ocultar dados" : "Ver dados completos"}
                          </Text>
                        </TouchableOpacity>
                        {/* Exibe dados completos do paciente quando expandido */}
                        {pacientesSelecionados[p.id] && (
                          <View style={Estilo.dadosPaciente}>
                            {loadingPaciente ? (
                              <ActivityIndicator />
                            ) : (
                              <>
                                <Text style={Estilo.dadosTitulo}>Dados do paciente</Text>                                
                               {/* Nome completo */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Nome completo:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Nome completo"
                                   value={
                                     pacientesEmEdicao[p.id]?.nome ?? 
                                     pacientesSelecionados[p.id].nome ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'nome', v)}
                                 />
                               </View>
                               {/* Nome social */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Nome social:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Nome social"
                                   value={
                                     pacientesEmEdicao[p.id]?.nome_social ?? 
                                     pacientesSelecionados[p.id].nome_social ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'nome_social', v)}
                                 />
                               </View>
                               {/* Email */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Email:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="email@exemplo.com"
                                   autoCapitalize="none"
                                   keyboardType="email-address"
                                   value={
                                     pacientesEmEdicao[p.id]?.email ?? 
                                     pacientesSelecionados[p.id].email ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'email', v)}
                                 />
                               </View>
                               {/* Celular */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Celular:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="11987654321"
                                   keyboardType="number-pad"
                                   value={
                                     pacientesEmEdicao[p.id]?.celular ?? 
                                     pacientesSelecionados[p.id].celular ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'celular', v)}
                                 />
                               </View>
                               {/* Gênero */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Gênero:</Text>
                                 <View style={Estilo.pickerWrapEdicao}>
                                   <Picker
                                     selectedValue={
                                       pacientesEmEdicao[p.id]?.genero ?? 
                                       pacientesSelecionados[p.id].genero ?? ""
                                     }
                                     onValueChange={(v) => atualizarCampoPaciente(p.id, 'genero', v)}
                                     style={Estilo.pickerEdicao}
                                     dropdownIconColor="#015184"
                                   >
                                     <Picker.Item label="Selecione" value="" />
                                     {GENEROS.map(g => (
                                       <Picker.Item key={g} label={g} value={g} />
                                     ))}
                                   </Picker>
                                 </View>
                               </View>
                               {/* Data de nascimento */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Data de nascimento:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="YYYY-MM-DD"
                                   value={
                                     onlyDate(pacientesEmEdicao[p.id]?.data_nascimento) ?? 
                                     onlyDate(pacientesSelecionados[p.id].data_nascimento) ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'data_nascimento', v)}
                                 />
                               </View>
                               {/* Cidade */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Cidade:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Nome da cidade"
                                   value={
                                     pacientesEmEdicao[p.id]?.cidade ?? 
                                     pacientesSelecionados[p.id].cidade ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'cidade', v)}
                                 />
                               </View>
                               {/* Estado */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Estado (UF):</Text>
                                 <View style={Estilo.pickerWrapEdicao}>
                                   <Picker
                                     selectedValue={
                                       pacientesEmEdicao[p.id]?.estado ?? 
                                       pacientesSelecionados[p.id].estado ?? ""
                                     }
                                     onValueChange={(v) => atualizarCampoPaciente(p.id, 'estado', v)}
                                     style={Estilo.pickerEdicao}
                                     dropdownIconColor="#015184"
                                   >
                                     <Picker.Item label="Selecione a UF" value="" />
                                     {UFS.map(uf => (
                                       <Picker.Item key={uf} label={uf} value={uf} />
                                     ))}
                                   </Picker>
                                 </View>
                               </View>
                               {/* Tipo sanguíneo */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Tipo sanguíneo:</Text>
                                 <View style={Estilo.pickerWrapEdicao}>
                                   <Picker
                                     selectedValue={
                                       pacientesEmEdicao[p.id]?.tipo_sanguineo ?? 
                                       pacientesSelecionados[p.id].tipo_sanguineo ?? ""
                                     }
                                     onValueChange={(v) => atualizarCampoPaciente(p.id, 'tipo_sanguineo', v)}
                                     style={Estilo.pickerEdicao}
                                     dropdownIconColor="#015184"
                                   >
                                     <Picker.Item label="Selecione" value="" />
                                     {SANGUES.map(s => (
                                       <Picker.Item key={s} label={s} value={s} />
                                     ))}
                                   </Picker>
                                 </View>
                               </View>
                               {/* Condições médicas */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Condições médicas:</Text>
                                 <TextInput
                                   style={[Estilo.inputEdicao, { height: 70 }]}
                                   placeholder="Diagnósticos..."
                                   multiline
                                   value={
                                     pacientesEmEdicao[p.id]?.condicoes_medicas ?? 
                                     pacientesSelecionados[p.id].condicoes_medicas ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'condicoes_medicas', v)}
                                 />
                               </View>
                               {/* Medicação */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Medicação:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Medicamentos em uso"
                                   value={
                                     pacientesEmEdicao[p.id]?.medicacao ?? 
                                     pacientesSelecionados[p.id].medicacao ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'medicacao', v)}
                                 />
                               </View>
                               {/* Contato de emergência */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Contato de emergência:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Telefone(s) de emergência"
                                   value={
                                     pacientesEmEdicao[p.id]?.contato_emergencia ?? 
                                     pacientesSelecionados[p.id].contato_emergencia ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'contato_emergencia', v)}
                                 />
                               </View>
                               {/* Unidades de saúde */}
                               <View style={Estilo.dadosItem}>
                                 <Text style={Estilo.dadosLabel}>Unidades de saúde:</Text>
                                 <TextInput
                                   style={Estilo.inputEdicao}
                                   placeholder="Hospitais/clínicas frequentadas"
                                   value={
                                     pacientesEmEdicao[p.id]?.unidades_de_saude ?? 
                                     pacientesSelecionados[p.id].unidades_de_saude ?? ""
                                   }
                                   onChangeText={(v) => atualizarCampoPaciente(p.id, 'unidades_de_saude', v)}
                                 />
                               </View>
                               {/* Botão de Atualizar */}
                               <TouchableOpacity
                                 onPress={() => salvarPacienteVinculado(p.id)}
                                 style={Estilo.botaoAtualizar}
                                 disabled={salvandoPaciente}
                               >
                                 {salvandoPaciente ? (
                                   <ActivityIndicator color="#FFF" />
                                 ) : (
                                   <Text style={Estilo.textoBotaoAtualizar}>
                                     Atualizar dados do paciente
                                   </Text>
                                 )}
                               </TouchableOpacity>
                              </>
                            )}
                          </View>
                        )}
                      </View>
                        `{/*<Text>{p.id} — {p.nome ?? "(sem nome)"} — {p.email}</Text>*/}
                        <Text style={{margin: 0, padding: 0}}>Deseja remover {p.nome ?? "(sem nome)"}?</Text>
                        <TouchableOpacity
                          onPress={() => desvincular(p.id)}
                          style={Estilo.btnRemover}
                        >
                          <Text style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Remover</Text>
                        </TouchableOpacity>
                        <View style={{ height: 2, backgroundColor: '#8BAAC4', margin: 0, marginVertical: 20, marginHorizontal: 10, borderRadius: 1 }} />
                      </View>
                    ))
                  )}
                </View>
              </View>
              {/* Botão de Logout */}
              <View style={{backgroundColor: "#fff", borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6}}>
                <TouchableOpacity
                onPress={fazerLogout}
                  style={Estilo.botaoLogout}
               >
                 <Text style={Estilo.textoBotaoLogout}>Sair da conta</Text>
               </TouchableOpacity>
             </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const Estilo = StyleSheet.create({
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#112A6C",
    marginVertical: 12,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#112A6C",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#532C1D",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#8BAAC4",
    color: "#FFF6E5",
    borderRadius: 8,
    padding: 10,
  },

  pickerWrap: {
    backgroundColor: "#8BAAC4",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#8BAAC4",
    paddingHorizontal: 8,
  },
  picker: {
    backgroundColor: "#8baac490",
    borderWidth: 0,
    height: 48,
    color: "#FFF6E5",
  },
  pickerItem: {
    fontSize: 16,
  },
  botaoPrimario: {
    marginTop: 16,
    backgroundColor: "#015184",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  textoBotao: {
    color: "#FFF6E5",
    fontSize: 16,
    fontWeight: "700",
  },
  botaoSecundario: {
    marginTop: 16,
    backgroundColor: "#015184",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  textoBotaoSec: {
    color: "#FFF6E5",
    fontSize: 16,
    fontWeight: "700",
  },
  itemVinculo: {
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    padding: 10,
  },
  btnRemover: {
    marginTop: 10,
    backgroundColor: "#a00000",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  dadosPaciente: {
    marginTop: 12,
    backgroundColor: "#F0F4F8",
    borderRadius: 8,
    padding: 12,
  },
  dadosTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#112A6C",
    marginBottom: 12,
  },
  dadosItem: {
    marginBottom: 10,
  },
  dadosLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#532C1D",
    marginBottom: 2,
  },
  dadosValor: {
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputEdicao: {
    backgroundColor: "#FFF",
    color: "#333",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#8BAAC4",
    fontSize: 14,
  },
  pickerWrapEdicao: {
    backgroundColor: "#FFF",
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#8BAAC4",
  },
  pickerEdicao: {
    backgroundColor: "#FFF",
    height: 48,
    color: "#333",
  },
  botaoAtualizar: {
    marginTop: 16,
    backgroundColor: "#015184",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  textoBotaoAtualizar: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  botaoLogout: {
    backgroundColor: "#ffbb00ff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  textoBotaoLogout: {
    color: "#532C1D",
    fontSize: 16,
    fontWeight: "700",
  },
});

