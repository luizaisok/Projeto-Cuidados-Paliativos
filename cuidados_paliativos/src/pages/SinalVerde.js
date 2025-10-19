import { View, Text, StyleSheet } from 'react-native'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default function SinalVerde() {
  return (
    <>
    <Header/>
        <View style={Estilo.container}>
            <Text style={Estilo.aviso}>Tudo certo por hoje</Text>
            <View style={Estilo.card}>
                <Text style={Estilo.titulo}>Ótima notícia! Nenhum sintoma hoje</Text>
                <Text style={Estilo.descricao}>Ficamos felizes em saber que você está sem sintomas no momento. Em cuidados paliativos, cada dia de estabilidade é uma vitória. Continue seguindo as orientações da equipe de saúde e mantendo seus cuidados diários. Estamos com você!</Text>
            </View>
        </View>
        <Footer/>
    </>
  )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#9BC45A'
    },
    aviso: {
        width: 400,
        marginVertical: 50,
        padding: 30,
        backgroundColor: '#FFF',
        color: '#9BC45A',
        fontSize: 30,
        fontWeight: 'bold',
        borderRadius: '10px',
        textAlign: 'center'
    },
    card: {
        width: 400,
        padding: 30,
        backgroundColor: '#FFF',
        borderRadius: '10px',
    },
    titulo: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 30
    },
    descricao: {
        textAlign: 'center',
        fontSize: 22
    }
})