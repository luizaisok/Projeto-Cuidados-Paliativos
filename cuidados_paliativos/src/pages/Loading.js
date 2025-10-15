import { Image, StyleSheet, Text, View } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

export default function Loading(){
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });

    return(
        <View style={Estilo.container}>
            <View style={{marginBottom: 10}}>
                <Image 
                    source={require("../assets/img/maos-projeto-cuidados-paliativos.png")} 
                    style={Estilo.imgLogo}
                />
            </View>
            <Text style={[Estilo.txt, {fontSize: '48px'}]}>PaliVida</Text>
            <View style={Estilo.containerDots}>
                <View style={Estilo.dot1} />
                <View style={Estilo.dot2} />
                <View style={Estilo.dot3} />
            </View>
            <Text style={[Estilo.txt, {fontSize: '36px', marginTop: 110}]}>Bem vindo(a)!</Text>
        </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#112A6C'
    },
    imgLogo: {
        width: 195,
        height: 247
    },
    txt: {
        fontFamily: "Comfortaa_400Regular",
        color: '#FDEDD3'
    },
    containerDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 110,
        gap: 10
    },
    dot1: {
        backgroundColor: '#8CAAC4',
        width: 40,
        height: 40,
        borderRadius: 20
    },
    dot2: {
        backgroundColor: '#5A90BF',
        width: 50,
        height: 50,
        borderRadius: 25
    },
    dot3: {
        backgroundColor: '#015184',
        width: 60,
        height: 60,
        borderRadius: 30
    }
})