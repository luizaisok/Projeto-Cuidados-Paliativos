import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function ConteudoDetalhe() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [conteudo, setConteudo] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const response = await fetch(`http://localhost:3000/api/conteudos/${id}`);
        const data = await response.json();
        setConteudo(data);
      } catch (err) {
        console.log("Erro ao carregar conteúdo:", err);
      }
    }

    carregar();
  }, [id]);

  if (!conteudo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <>
      <Header />

      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>{conteudo.titulo}</Text>

        <Text style={styles.subtitulo}>Definição:</Text>
        <Text style={styles.texto}>{conteudo.descricao}</Text>

        <Text style={styles.subtitulo}>Sinais e Sintomas:</Text>
        <Text style={styles.texto}>{conteudo.SinaisSintomas}</Text>

        {/* Botão Laranja */}
        <TouchableOpacity
          style={styles.btnLaranja}
          onPress={() => navigation.navigate("SinalAmarelo")}
        >
          <Text style={styles.txtBtn}>Sinto um ou mais dos sinais e sintomas</Text>
        </TouchableOpacity>

        <Text style={styles.subtitulo}>Sinais de Alerta:</Text>
        <Text style={styles.texto}>{conteudo.SinaisAlerta}</Text>

        {/* Botão Vermelho */}
        <TouchableOpacity
          style={styles.btnVermelho}
          onPress={() => navigation.navigate("SinalVermelho")}
        >
          <Text style={styles.txtBtn}>Sinto um ou mais dos sinais de alerta</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9DCC5",
    paddingHorizontal: 25,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#000",
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },

  texto: {
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 10,
  },

  btnLaranja: {
    backgroundColor: "#E78F47",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },

  btnVermelho: {
    backgroundColor: "#D94141",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },

  txtBtn: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
