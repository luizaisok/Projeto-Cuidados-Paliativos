import { useNavigation } from "@react-navigation/native";
import { Image, Text, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import Header from "../components/Header/index";
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

            setSenha("");
            setConfirmar("");
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

            <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

                <Image 
                    source={require("../assets/img/LogoClara.png")} 
                    style={Estilo.img}
                />

                <Text style={[Estilo.titulo, Estilo.txt]}>Cadastre-se</Text>

                <View>
                    <Text style={[Estilo.label, Estilo.txt]}>E-mail</Text>
                    <TextInput
                        style={[Estilo.input, Estilo.txt]}
                        placeholder="Digite o seu e-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="off"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={[Estilo.label, Estilo.txt]}>Senha</Text>
                    <TextInput
                        style={[Estilo.input, Estilo.txt]}
                        placeholder="Digite a sua senha"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />

                    <Text style={[Estilo.label, Estilo.txt]}>Confirmar senha</Text>
                    <TextInput
                        style={[Estilo.input, Estilo.txt]}
                        placeholder="Confirme sua senha"
                        secureTextEntry
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

                <TouchableOpacity 
                    style={Estilo.buttonVoltar}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={Estilo.textButtonVoltar}>Voltar ao Login</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}


const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF3E5'
    },
    txt: {
        fontFamily: "Comfortaa_400Regular"
    },
    img: {
        width: 90,
        height: 100,
        marginTop: 20
    },
    titulo: {
        fontSize: 48,
        fontWeight: 600,
        color: '#112A6C',
        marginBottom: 25,
        marginTop: 15
    },
    label: {
        fontSize: 20,
        color: '#532C1D',
        marginBottom: 5,
        fontWeight: 'bold'
    },
    input: {
        padding: 10,
        paddingLeft: 20,
        backgroundColor: '#8BAAC4',
        color: '#FFF',
        borderRadius: 10,
        width: 230,
        height: 50,
        marginBottom: 15,
    },

    ContainerButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        marginTop: 25,
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
        fontSize: 18,
        color: "#FFF6E5",
        textAlign: "center",
        lineHeight: 26,
    },

    buttonVoltar: {
        width: "85%",
        backgroundColor: "#fff",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 6,
    },
    textButtonVoltar: {
        color: "#4A4A4A",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    }
});
