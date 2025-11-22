import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditarConteudo() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [texto, setTexto] = useState("");
  const [sinaisSintomas, setSinaisSintomas] = useState("");
  const [sinaisAlerta, setSinaisAlerta] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarConteudo();
  }, [id]);

  const carregarConteudo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/conteudos/${id}`);
      const data = await response.json();
      
      setTitulo(data.titulo || "");
      setDescricao(data.descricao || "");
      setTexto(data.texto || "");
      setSinaisSintomas(data.SinaisSintomas || "");
      setSinaisAlerta(data.SinaisAlerta || "");
    } catch (err) {
      alert("Erro", "Erro ao carregar conteúdo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const salvarConteudo = async () => {
    if (!titulo || !descricao || !sinaisSintomas || !sinaisAlerta) {
      alert("Atenção", "Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("auth_token");
      const dataPost = new Date().toISOString().split('T')[0];

      const response = await fetch(`http://localhost:3000/api/conteudos/${id}`, {
        method: "PUT",
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
        alert("Sucesso", "Conteúdo atualizado com sucesso!");
        navigation.goBack();
      } else {
        alert("Erro", "Não foi possível atualizar o conteúdo");
      }
    } catch (err) {
      alert("Erro", "Erro ao salvar conteúdo");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const excluirConteudo = async () => {
    if (!window.confirm('Deseja realmente excluir este conteúdo?')) {
      return;
    }
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`http://localhost:3000/api/conteudos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        alert("Conteúdo excluído com sucesso!");
        navigation.navigate('GerenciarConteudos');
      } else {
        alert("Não foi possível excluir");
      }
    } catch (err) {
      alert("Erro ao excluir conteúdo");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#015184" />
      </View>
    );
  }

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Editar Conteúdo</Text>

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
          style={[styles.btnSalvar, saving && styles.btnDisabled]}
          onPress={salvarConteudo}
          disabled={saving}
        >
          <Text style={styles.txtBtn}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnExcluir}
          onPress={excluirConteudo}
        >
          <Text style={styles.txtBtn}>Excluir Conteúdo</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9DCC5",
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
  btnExcluir: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
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
