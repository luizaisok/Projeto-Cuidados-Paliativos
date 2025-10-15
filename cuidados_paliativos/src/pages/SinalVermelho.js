import { StyleSheet, View, Text } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SinalVermelho(){
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });

    return(
        <>
        <Header />
        <View style={Estilo.container}>
            <Text style={[Estilo.aviso, Estilo.txt]}>Atenção</Text>
            <View style={Estilo.card}>
                <Text style={[Estilo.titulo, Estilo.txt]}>Seus sintomas indicam um possível agravamento do seu estado de saúde!</Text>
                <Text style={[Estilo.descricao, Estilo.txt]}>Você relatou sinais que exigem uma avaliação médica imediata. Em cuidados paliativos, é essencial manter o conforto e a estabilidade. Recomendamos que entre em contato com a equipe de saúde ou vá até uma unidade de atendimento o quanto antes. Estamos aqui para te apoiar.</Text>
            </View>
        </View>
        <Footer />
        </>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D00000'
    },
    header: {
        flex: 1,
    },
    footer: {
        flex: 1,
    },
    txt: {
        fontFamily: "Comfortaa_400Regular",
        color: '#D00000',
    },
    aviso: {
        width: 200,
        marginVertical: 30,
        padding: 15,
        backgroundColor: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        borderRadius: '10px',
        textAlign: 'center'
    },
    card: {
        width: 450,
        padding: 40,
        backgroundColor: '#FFF',
        borderRadius: '10px',
    },
    titulo: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: 'bold'
    },
    descricao: {
        textAlign: 'center',
        fontSize: 24
    }
})