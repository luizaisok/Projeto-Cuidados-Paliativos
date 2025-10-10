import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  return (
    <>
        <Header/>
        <View style={Estilo.container}>
            <Image 
                source={require("../assets/img/LogoClara.png")} 
                style={Estilo.img}
            />
            <Text style={Estilo.titulo} >Entrar</Text>
            <View>
                <Text style={Estilo.label}>E-mail</Text>
                <TextInput 
                    placeholder="Digite o seu e-mail"
                    style={Estilo.input}
                />
                <Text style={Estilo.label}>Senha</Text>
                <TextInput 
                    placeholder="Digite a sua senha"
                    style={Estilo.input}
                />
                <TouchableOpacity style={Estilo.botaoSecundario}>
                    <Text>Esqueci minha senha</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={Estilo.botaoEntrar}>
                <Text style={Estilo.textoEntrar}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Estilo.botaoSecundario}>
                <Text>ou Cadastre-se</Text>
            </TouchableOpacity>
        </View>
        <Footer/>
    </>
    
  )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF3E5'
    },
    img: {
        width: 90,
        height: 100,
        marginTop: 80
    },
    titulo: {
        fontSize: 48,
        fontWeight: 600,
        color: '#112A6C',
        marginBottom: 80
    },
    label: {
        fontSize: 20,
        fontWeight: 500,
        color: '#532C1D',
        marginBottom: 5
    },
    input: {
        padding: 10,
        paddingLeft: 20,
        backgroundColor: '#8BAAC4',
        color: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
    },
    botaoSecundario: {
        alignItems: 'flex-end',
        textDecorationLine: 'underline',
        color: '#532C1D'
    },
    botaoEntrar: {
        marginTop: 30,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#015184',
        borderRadius: 10,
    },
    textoEntrar: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold'
    }
})