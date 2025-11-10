import { Image, Text, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import Header from "../components/Header/index";
import Footer from "../components/Footer/index";
import { useState } from "react";

const API_BASE = "http://localhost:3000";

export default function Cadastro(){
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [loading, setLoading] = useState(false);

    // Função de cadastro
    async function cadastrar(url) {
        if (!email || !senha || !confirmar) {
            alert("Preencha e-mail, senha e confirmação.");
            return;
        }

        if (senha !== confirmar) {
            alert("As senhas não conferem.");
            return;
        }

        try {
            setLoading(true);

            const resp = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });
        
            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data?.message || "Erro ao cadastrar.");
            }

            alert(`Cadastro realizado! ID: ${data.id}`);
        
            // Limpa os campos
            setSenha("");
            setConfirmar("");
            
            // Navegação (react-navigation)
        } catch (e) {
            alert(e.message || "Erro ao enviar.");
        } finally {
            setLoading(false);
        }
    }

    const onCadastrarPaciente = () => cadastrar(`${API_BASE}/api/pacientes`);
    const onCadastrarAcompanhante = () => cadastrar(`${API_BASE}/api/acompanhante`);

    return (
    <View style={Estilo.container}>
        <Header />

        <View style={Estilo.body}>
        <Image
            source={require("../assets/img/maos-projeto-cuidados-paliativos.png")}
            style={Estilo.imgLogo}
        />
        <Text style={[Estilo.txt, Estilo.txtCadastro]}>Cadastre-se</Text>
        </View>

        <View>
        <Text style={[Estilo.label, Estilo.txt]}>E-mail</Text>
        <TextInput
            style={Estilo.input}
            placeholder="Seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="off"
            value={email}
            onChangeText={setEmail}
        />

        <Text style={[Estilo.label, Estilo.txt]}>Senha</Text>
        <TextInput
            style={Estilo.input}
            placeholder="Sua senha"
            keyboardType="default"
            autoCapitalize="none"
            autoComplete="off"
            secureTextEntry
            autoCorrect={false}
            value={senha}
            onChangeText={setSenha}
        />

        <Text style={[Estilo.label, Estilo.txt]}>Confirmar senha</Text>
        <TextInput
            style={Estilo.input}
            placeholder="Sua senha"
            keyboardType="default"
            autoCapitalize="none"
            autoComplete="off"
            secureTextEntry
            autoCorrect={false}
            value={confirmar}
            onChangeText={setConfirmar}
        />
        </View>

        <View style={Estilo.ContainerButtons}>
        <View style={Estilo.button}>
            <TouchableOpacity onPress={onCadastrarPaciente} disabled={loading}>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <Text style={[Estilo.txt, Estilo.txtButton]}>Cadastrar como Paciente</Text>
            )}
            </TouchableOpacity>
        </View>

        <View style={Estilo.button}>
            <TouchableOpacity onPress={onCadastrarAcompanhante} disabled={loading}>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <Text style={[Estilo.txt, Estilo.txtButton]}>Cadastrar como Cuidador</Text>
            )}
            </TouchableOpacity>
        </View>
        </View>

        <Footer />
    </View>
    );
}


const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E8DAC0'
    },
    body: {
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    imgLogo: {
        width: 92,
        height: 117
    },
    txt: {
        fontFamily: "Comfortaa_400Regular"
    },
    txtCadastro: {
        color: '#112A6C',
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 30
    },
    input: {
        backgroundColor: '#8BAAC4',
        borderColor: "#8BAAC4",
        color: "#FFF6E5",
        borderRadius: 10,
        width: '100%',
        height: 50,
        padding: 10,
        marginBottom: 25,
        fontSize: 18
    },
    label: {
        color: '#532C1D',
        fontSize: 20,
        marginBottom: 5
    },

    ContainerButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#015184",
        borderRadius: 10,
        width: 170,
        height: 101,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    txtButton: {
        fontSize: 24,
        color: "#FFF6E5",
        textAlign: "center",
        lineHeight: 30,
    }
})