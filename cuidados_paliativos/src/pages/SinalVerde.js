import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Header from '../components/Header'

export default function SinalVerde() {

  const navigation = useNavigation();

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={Estilo.container}>
        <Text style={Estilo.aviso}>Tudo certo por hoje</Text>

        <View style={Estilo.card}>
          <Text style={Estilo.titulo}>Ótima notícia! Nenhum sintoma hoje</Text>
          <Text style={Estilo.descricao}>
            Ficamos felizes em saber que você está sem sintomas no momento. 
            Em cuidados paliativos, cada dia de estabilidade é uma vitória. 
            Continue seguindo as orientações da equipe de saúde e mantendo 
            seus cuidados diários. Estamos com você!
          </Text>
        </View>

        <TouchableOpacity 
          style={Estilo.button}
          onPress={() => navigation.navigate("AbasPrincipais", { screen: "Home", params: { alerta: "verde" } })}
        >
          <Text style={Estilo.textButton}>Voltar ao início</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const Estilo = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#9BC45A',
  },

  aviso: {
    width: "90%",
    marginBottom: 30,
    padding: 30,
    backgroundColor: '#FFF',
    color: '#9BC45A',
    fontSize: 26,
    fontWeight: 'bold',
    borderRadius: 10,
    textAlign: 'center',
  },

  card: {
    width: "90%",
    padding: 25,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 30,
  },

  titulo: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 20,
    color: "#4A4A4A",
    fontWeight: "bold",
  },

  descricao: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 26,
    color: "#4A4A4A",
  },

  button: {
    width: "90%",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },

  textButton: {
    color: "#4A4A4A",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  }
})
