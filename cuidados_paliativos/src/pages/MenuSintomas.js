import { StyleSheet, Text, View } from "react-native";
import ListaSintomas from "../components/ListaSintomas";
import Header from "../components/Header/index";
import Footer from "../components/Footer/index";
import IntensidadeDor from '../components/Modals/IntensidadeDor';
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import { useState,  useEffect } from "react";

export default function MenuSintomas(){
    const [modalVisible, setModalVisible] = useState(false);
    const [sintomaSelecionado, setSintomaSelecionado] = useState(null);
    
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });

    useEffect(() => {
        console.log("Menu Sintomas Apareceu!!! aaaaaaaaa");
    }, []);

    const handleSelecionarSintoma = (sintoma) => {
        setSintomaSelecionado(sintoma);
        setModalVisible(true);
    };

    return(
        <View style={Estilo.container}>
            <Header />
            <Text style={Estilo.title}>
                Você apresentou algum desses sintomas hoje?
            </Text>
            <ListaSintomas onSelecionar={handleSelecionarSintoma} />
            <Footer />

            <IntensidadeDor
                visible={modalVisible}
                sintoma={sintomaSelecionado}
                onClose={() => setModalVisible(false)}
            />
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
        fontSize: 35,
        marginTop: 25,                                                                                                             
        marginBottom: 25,
        textAlign: "center",
        color: "#112A6C"
    }
})