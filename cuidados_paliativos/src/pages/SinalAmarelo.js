import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Header from '../components/Header'

export default function SinalAmarelo() {

  const navigation = useNavigation();

  return (
    <>
      <Header />

      <View style={Estilo.container}>
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

      </View>
    </>
  )
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFBE3B'
  },
  aviso: {
    width: 400,
    marginVertical: 50,
    padding: 30,
    backgroundColor: '#FFF',
    color: '#FFBE3B',
    fontSize: 30,
    fontWeight: 'bold',
    borderRadius: 10,
    textAlign: 'center'
  },
  card: {
    width: 400,
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  titulo: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 30
  },
  descricao: {
    textAlign: 'center',
    fontSize: 22
  },
  button: {
    marginTop: 40,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  textButton: {
    color: "#4A4A4A",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  }
})
