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
