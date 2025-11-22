import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";

export default function GerenciarConteudos() {
  const navigation = useNavigation();
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarConteudos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/conteudos");
      const data = await response.json();
      setConteudos(data.conteudos || []);
    } catch (err) {
      console.log("Erro ao carregar conteúdos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarConteudos();
    }, [carregarConteudos])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EditarConteudo', { id: item.id })}
    >
      <Text style={styles.cardTitulo}>{item.titulo}</Text>
      <Text style={styles.cardDescricao} numberOfLines={2}>
        {item.descricao}
      </Text>
    </TouchableOpacity>
  );

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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Gerenciar Conteúdos</Text>
          <TouchableOpacity
            style={styles.btnNovo}
            onPress={() => navigation.navigate('NovoConteudo')}
          >
            <Text style={styles.txtBtnNovo}>+ Novo Conteúdo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={conteudos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />

        <TouchableOpacity
          style={styles.btnVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.txtVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  btnNovo: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 8,
  },
  txtBtnNovo: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#112A6C",
    marginBottom: 5,
  },
  cardDescricao: {
    fontSize: 14,
    color: "#666",
  },
  btnVoltar: {
    backgroundColor: "#015184",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  txtVoltar: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
