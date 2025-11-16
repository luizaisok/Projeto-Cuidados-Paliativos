import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Header from '../components/Header'

export default function SinalAmarelo() {

  const navigation = useNavigation();

  return (
    <>
      <Header />
      
      <ScrollView
        style={{ backgroundColor: '#FFBE3B' }}
        contentContainerStyle={Estilo.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <Text style={Estilo.aviso}>Atenção</Text>

        <View style={Estilo.card}>
          <Text style={Estilo.titulo}>Alguns sintomas exigem cuidado</Text>
          <Text style={Estilo.descricao}>
            Observamos sinais que merecem atenção. Em cuidados paliativos,
            é importante monitorar qualquer mudança e comunicar a equipe de saúde
            caso algo se intensifique. Estamos aqui para te acompanhar em cada passo.
          </Text>
        </View>

        <TouchableOpacity 
          style={Estilo.button}
          onPress={() => navigation.navigate("AbasPrincipais", { screen: "Home" })}
        >
          <Text style={Estilo.textButton}>Voltar ao início</Text>
        </TouchableOpacity>

      </ScrollView>
    </>
  )
}

const Estilo = StyleSheet.create({

  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },

  aviso: {
    width: "100%",
    marginTop: 40,
    marginBottom: 40,
    padding: 30,
    backgroundColor: '#FFF',
    color: '#FFBE3B',
    fontSize: 28,
    fontWeight: 'bold',
    borderRadius: 10,
    textAlign: 'center'
  },

  card: {
    width: "100%",
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
    color: "#4A4A4A"
  },

  button: {
    width: "100%",
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
