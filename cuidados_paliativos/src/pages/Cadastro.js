import { useNavigation } from "@react-navigation/native";
import { Image, Text, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import Header from "../components/Header/index";
import Footer from "../components/Footer/index";
import { useState } from "react";

const API_BASE = "http://localhost:3000";

export default function Cadastro(){
    const navigation = useNavigation();

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
            
            // Redirecionamento para Login
            navigation.navigate('Login', { emailPrefill: email }); 
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

        {/*<Footer />*/}
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
        marginTop: 20,
        width: 85,
        height: 90,
    },
    txt: {
        fontFamily: "Comfortaa_400Regular"
    },
    txtCadastro: {
        color: '#112A6C',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 3,
        marginTop: 15,
        marginBottom: 15
    },
    input: {
        backgroundColor: '#8BAAC4',
        borderColor: "#8BAAC4",
        color: "#FFF6E5",
        borderRadius: 10,
        width: '100%',
        height: 45,
        padding: 10,
        marginBottom: 20,
        fontSize: 18
    },
    label: {
        color: '#532C1D',
        fontSize: 16,
        marginBottom: 3,
        fontWeight: 'bold',
    },

    ContainerButtons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        marginTop: 3,
    },
    button: {
        backgroundColor: "#015184",
        borderRadius: 10,
        width: 150,
        height: 101,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8
    },
    txtButton: {
        fontSize: 20,
        color: "#FFF6E5",
        textAlign: "center",
        lineHeight: 30,
    }
})