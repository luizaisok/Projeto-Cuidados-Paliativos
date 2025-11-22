import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Header from "../components/Header";
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

        <TouchableOpacity
          style={styles.btnLaranja}
          onPress={() => navigation.navigate("SinalAmarelo")}
        >
          <Text style={styles.txtBtn}>Sinto um ou mais dos sinais e sintomas</Text>
        </TouchableOpacity>

        <Text style={styles.subtitulo}>Sinais de Alerta:</Text>
        <Text style={styles.texto}>{conteudo.SinaisAlerta}</Text>

        <TouchableOpacity
          style={styles.btnVermelho}
          onPress={() => navigation.navigate("SinalVermelho")}
        >
          <Text style={styles.txtBtn}>Sinto um ou mais dos sinais de alerta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnVoltar}
          onPress={() => navigation.navigate("AbasPrincipais", { screen: "Home" })}
        >
          <Text style={styles.txtVoltar}>Voltar ao início</Text>
        </TouchableOpacity>
      </ScrollView>
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

  btnVoltar: {
    marginTop: 30,
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: "center",

    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  txtVoltar: {
    color: "#4A4A4A",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
