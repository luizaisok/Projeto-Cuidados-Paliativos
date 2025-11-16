import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Header from '../components/Header'

export default function SinalVermelho() {

    const navigation = useNavigation();
    
    return (
    <>
      <Header />

      <View style={Estilo.container}>
        <Text style={Estilo.aviso}>Atenção</Text>

        <View style={Estilo.card}>
          <Text style={Estilo.titulo}>Sintomas podem indicar agravamento</Text>
          <Text style={Estilo.descricao}>
            Os sinais relatados indicam que seu estado de saúde pode estar se agravando. 
            Em cuidados paliativos, buscar avaliação médica rápida é essencial para garantir 
            conforto e segurança. Entre em contato com a equipe de saúde assim que possível.
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
    backgroundColor: '#D00000' // vermelho original
  },
  aviso: {
    width: 400,
    marginVertical: 50,
    padding: 30,
    backgroundColor: '#FFF',
    color: '#D00000',
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
