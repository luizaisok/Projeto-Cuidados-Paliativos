/*
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";

// Components
import Header from "../components/Header";

// Fonts
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

// Baixar npm install @react-native-async-storage/async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:3000";

export default function PerfilProntuario() {
  const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
  const SANGUES = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
  const GENEROS = ["Feminino","Masculino","Não-binário","Prefiro não informar","Outro"];

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

  const [vinculos, setVinculos] = useState([]);
  const [pacienteIdDigitado, setPacienteIdDigitado] = useState("");

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

      if (tp === "paciente") {
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
          <Text style={Estilo.titulo}>Perfil / Prontuário</Text>

          {/* ID somente leitura */}
          <View style={Estilo.card}>
            <Text style={Estilo.label}>Seu ID (somente leitura)</Text>
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

                <View style={{ marginTop: 24 }}>
                  <Text style={[Estilo.txt, { fontSize: 18, marginBottom: 8 }]}>
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

                <TouchableOpacity
                  onPress={salvarPaciente}
                  style={Estilo.botaoPrimario}
                  disabled={salvando}
                >
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={Estilo.textoBotao}>Salvar</Text>}
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

                <Text style={Estilo.label}>Vincular por ID do Paciente</Text>
                <TextInput
                  style={Estilo.input}
                  placeholder="Ex.: 12"
                  keyboardType="numeric"
                  value={pacienteIdDigitado}
                  onChangeText={setPacienteIdDigitado}
                />
                <TouchableOpacity onPress={vincular} style={Estilo.botaoSecundario}>
                  <Text style={Estilo.textoBotaoSec}>Vincular</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 16 }}>
                  <Text style={Estilo.label}>Meus pacientes</Text>
                  {vinculos.length === 0 ? (
                    <Text style={{ color: "#333", marginTop: 8 }}>Nenhum vínculo ainda.</Text>
                  ) : (
                    vinculos.map((p) => (
                      <View key={p.id} style={Estilo.itemVinculo}>
                        <Text>{p.id} — {p.nome ?? "(sem nome)"} — {p.email}</Text>
                        <TouchableOpacity
                          onPress={() => desvincular(p.id)}
                          style={Estilo.btnRemover}
                        >
                          <Text style={{ color: "#fff" }}>Remover</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {/*<Footer />*/}
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
    marginTop: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  textoBotaoSec: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  itemVinculo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  btnRemover: {
    backgroundColor: "#C0392B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

