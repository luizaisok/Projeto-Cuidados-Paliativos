import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

import Header from "../components/Header/index";
import Footer from "../components/Footer/index";

const handleProntuario = () => {
    console.log("Precisa implementar navegação para prontuário")
}

export default ({user = "Usuário"}) => {
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });
    
    return(
        <View style={Estilo.container}>
            <Header />

            <View style={Estilo.bodyContainer}>
                {/* Mensagem de boas vindas com placeholder padrão como "Usuário" */}
                <Text style={Estilo.welcomeText}>Bem vindo {user}!</Text>

                {/* Botão para prontuário */}
                <TouchableOpacity 
                    style={Estilo.prontuarioButton}
                    onPress={handleProntuario} // dispara função de nevegação interna
                    activeOpacity={0.8}
                >
                    <Text style={Estilo.prontuarioButtonText}>Prontuário Eletrônico</Text>
                    <Text style={Estilo.prontuarioButtonText}>→</Text>
                </TouchableOpacity>
            </View>

            <Footer />
        </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#FFF3E5",
    },

    welcomeText: {
        fontFamily: "Comfortaa_400Regular",
        fontSize: 24,
        fontWeight: 600,
        margin: 25, marginLeft: 39,
        textAlign: "left",
        color: "#183102",
    },

    prontuarioButton: {
        backgroundColor: "#E8994B",
        height: 67, width: 290,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",

    },
    prontuarioButtonText: {
        fontFamily: "Comfortaa_400Regular",
        color: '#fff',
        fontSize: 20,
        fontWeight: 700,
    },
})
