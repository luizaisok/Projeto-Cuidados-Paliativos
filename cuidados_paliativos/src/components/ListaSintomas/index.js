import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SINTOMAS } from "../../data/sintomas";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

const Item = ({dado}) => (
    <View style={Estilo.card}>
        <TouchableOpacity>
            <Text style={Estilo.textCard}>{dado?.nome}</Text>
        </TouchableOpacity>
    </View>
)

export default function ListaSintomas(){
    return(
        <View style={Estilo.container}>
            <FlatList
                data={SINTOMAS} //Data
                numColumns={2}
                keyExtractor={(item) => item.id} //KeyExtrator -> precisa ser String
                renderItem={({item}) => <Item dado={item} />} //RenderItem

                ListEmptyComponent={<Text>Não existem elementos na lista.</Text>}
            />
            <View>
                <TouchableOpacity style={Estilo.button}>
                <Text style={Estilo.textButton}>Não tive nenhum desses sintomas</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1
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