import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";

const Item = ({dado}) => (
    <View style={Estilo.card}>
        <TouchableOpacity>
            <Text style={Estilo.textCard}>{dado?.nome}</Text>
        </TouchableOpacity>
    </View>
)

export default function ListaSintomas({ onSelecionar }){
    const BASE_URL = "http://localhost:3000/";
    const [sintomas, setSintomas] = useState([]);
    const navigation = useNavigation();

    const fetchSintomas = async () => {
        try {
            const resposta = await fetch(`${BASE_URL}api/sintomas`);
            const json = await resposta.json();
            console.log("JSON RECEBIDO:", json);

            if (Array.isArray(json)) setSintomas(json);
            else if (Array.isArray(json.sintomas)) setSintomas(json.sintomas);
            else setSintomas([]);

        } catch (error) {
            console.log("Erro ao buscar sintomas:", error);
            setSintomas([]);
        }
    };

    useEffect(() => { fetchSintomas(); }, []);

    const handlePress = (item) => {
        console.log("Clicou em:", item);
        onSelecionar(item);
    };

    return(
        <View style={Estilo.container}>
            <FlatList
                data={sintomas}
                numColumns={2}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={Estilo.card}
                        onPress={() => handlePress(item)}
                    >
                        <Text style={Estilo.textCard}>{item.nome_sintoma}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>Não há sintomas cadastrados.</Text>}
            />
            <View>
                <TouchableOpacity
                    style={Estilo.button}
                    onPress={() => navigation.navigate("SinalVerde")}    
                >
                <Text style={Estilo.textButton}>Não tive nenhum desses sintomas</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: "100%"
    },
    card: {
        flex: 1,
        margin: 6,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 12,
        backgroundColor: "#f9f6ee",
        alignItems: "center",
        justifyContent: "center"
    },
    textCard: {
        fontSize: 14,
        textAlign: "center",
        color: "#333",
        fontFamily: "Comfortaa_400Regular"
    },
    button: {
        backgroundColor: "#5A90BF",
        borderRadius: 10,
        paddingVertical: 12,
        width: 252,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center", 
        marginTop: 12,
        marginBottom: 20,

        //Sombra pro IOS
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        //Sombra pro Android
        elevation: 8,
    },
    textButton: {
        color: "#fff",
        fontSize: 20,
        textAlign: "center",
        fontFamily: "Comfortaa_400Regular",
    },
})