import { StyleSheet, View, Text } from "react-native";

import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

import Header from "../components/Header/index";
import Footer from "../components/Footer/index";

export default ({user = "Usuário"}) => {
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });
    
    return(
        <View style={Estilo.container}>
            <Header />

            <View style={Estilo.bodyContainer}>
                <Text style={Estilo.welcomeText}>Bem vindo {user}!</Text>
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
    },
})
