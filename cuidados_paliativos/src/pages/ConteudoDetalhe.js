import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
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
        // Se estiver no emulador Android, lembre-se de usar 10.0.2.2
        const response = await fetch(`http://192.168.0.31:3000/api/conteudos/${id}`);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#112A6C" />
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={styles.headerSection}>
          <Text style={styles.tituloPrincipal}>{conteudo.titulo}</Text>
          <View style={styles.barraTitulo} />
        </View>

        <View style={styles.card}>
          <Text style={styles.labelSecao}>O que é?</Text>
          <Text style={styles.textoCorpo}>{conteudo.descricao}</Text>
        </View>

        <View style={[styles.card, styles.borderOrange]}>
          <Text style={[styles.labelSecao, { color: '#E78F47' }]}>Sinais e Sintomas</Text>
          <Text style={styles.textoCorpo}>{conteudo.SinaisSintomas}</Text>
          
          <TouchableOpacity
            style={styles.btnLaranja}
            onPress={() => navigation.navigate("SinalAmarelo")}
            activeOpacity={0.8}
          >
            <Text style={styles.txtBtn}>Sinto um desses sinais</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.borderRed]}>
          <Text style={[styles.labelSecao, { color: '#D94141' }]}>Sinais de Alerta</Text>
          <Text style={styles.textoCorpo}>{conteudo.SinaisAlerta}</Text>

          <TouchableOpacity
            style={styles.btnVermelho}
            onPress={() => navigation.navigate("SinalVermelho")}
            activeOpacity={0.8}
          >
            <Text style={styles.txtBtn}>Preciso de ajuda urgente</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: "#F2E8D5", // Um bege um pouco mais suave
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2E8D5",
  },
  loadingText: {
    marginTop: 10,
    color: "#112A6C",
    fontSize: 16,
  },
  
  // Cabeçalho da página
  headerSection: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  tituloPrincipal: {
    fontSize: 26,
    fontWeight: "800", // Extra bold
    color: "#112A6C",
    textAlign: "left",
  },
  barraTitulo: {
    width: 60,
    height: 4,
    backgroundColor: "#E78F47", // Detalhe laranja embaixo do título
    marginTop: 8,
    borderRadius: 2,
  },

  // Estilo Geral dos Cards
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra no Android
  },
  
  // Bordas coloridas laterais para destacar urgência
  borderOrange: {
    borderLeftWidth: 5,
    borderLeftColor: "#E78F47",
  },
  borderRed: {
    borderLeftWidth: 5,
    borderLeftColor: "#D94141",
  },

  // Tipografia interna
  labelSecao: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#112A6C",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textoCorpo: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    textAlign: "justify", // Deixa o texto alinhadinho
    marginBottom: 15,
  },

  // Botões de Ação
  btnLaranja: {
    backgroundColor: "#E78F47",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    elevation: 2,
  },
  btnVermelho: {
    backgroundColor: "#D94141",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    elevation: 2,
  },
  txtBtn: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "uppercase",
  },

  // Botão Voltar
  btnVoltar: {
    marginTop: 10,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#112A6C",
    backgroundColor: "transparent",
  },
  txtVoltar: {
    color: "#112A6C",
    fontSize: 16,
    fontWeight: "600",
  },
});