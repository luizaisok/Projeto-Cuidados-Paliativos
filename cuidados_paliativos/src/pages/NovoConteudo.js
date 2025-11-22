import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NovoConteudo() {
  const navigation = useNavigation();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [texto, setTexto] = useState("");
  const [sinaisSintomas, setSinaisSintomas] = useState("");
  const [sinaisAlerta, setSinaisAlerta] = useState("");
  const [loading, setLoading] = useState(false);

  const salvarConteudo = async () => {
    if (!titulo || !descricao || !sinaisSintomas || !sinaisAlerta) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("auth_token");
      const dataPost = new Date().toISOString().split('T')[0];

      const response = await fetch("http://localhost:3000/api/conteudos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          descricao,
          texto: texto || descricao,
          data_post: dataPost,
          SinaisSintomas: sinaisSintomas,
          SinaisAlerta: sinaisAlerta
        })
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Conteúdo criado com sucesso!");
        navigation.goBack();
      } else {
        Alert.alert("Erro", "Não foi possível criar o conteúdo");
      }
    } catch (err) {
      Alert.alert("Erro", "Erro ao salvar conteúdo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Novo Conteúdo</Text>

        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex: Febre"
        />

        <Text style={styles.label}>Definição *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva o que é..."
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Sinais e Sintomas *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={sinaisSintomas}
          onChangeText={setSinaisSintomas}
          placeholder="Liste os sinais e sintomas..."
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Sinais de Alerta *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={sinaisAlerta}
          onChangeText={setSinaisAlerta}
          placeholder="Liste os sinais de alerta..."
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.btnSalvar, loading && styles.btnDisabled]}
          onPress={salvarConteudo}
          disabled={loading}
        >
          <Text style={styles.txtBtn}>
            {loading ? "Salvando..." : "Salvar Conteúdo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnCancelar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.txtCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9DCC5",
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  btnSalvar: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  btnDisabled: {
    backgroundColor: "#999",
  },
  txtBtn: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  btnCancelar: {
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  txtCancelar: {
    color: "#666",
    fontSize: 16,
  },
});
