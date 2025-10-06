import { StyleSheet, Text, View } from "react-native";
import ListaSintomas from "../components/ListaSintomas";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

export default function MenuSintomas(){
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });

    return(
        <View style={Estilo.container}>
            <Text style={Estilo.title}>
                Você apresentou algum desses sintomas hoje?
            </Text>
            <ListaSintomas />
        </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#FFF3E5",
    },
    title: {                                                                                      
        fontFamily: "Comfortaa_400Regular",
        fontSize: 42,
        marginTop: 25,                                                                                                             
        marginBottom: 25,
        textAlign: "center",
        color: "#112A6C"
    }
})