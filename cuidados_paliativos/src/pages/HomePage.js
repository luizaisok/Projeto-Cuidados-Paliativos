import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header/index";

const API_BASE = "http://localhost:3000";

export default ({user = "Usuário"}) => {
    const [nomeSocial, setNomeSocial] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      (async () => {
        try {
            setLoading(true);
            const role  = (await AsyncStorage.getItem("auth_role")) || localStorage.getItem("userTipo");
            const id    = (await AsyncStorage.getItem("auth_id"))   || localStorage.getItem("userId");
            const token = (await AsyncStorage.getItem("auth_token"))|| localStorage.getItem("token");
            console.log("[Home] role:", role, "id:", id, "hasToken:", !!token);
            if (!role || !id) {
                console.log("[Home] Sem role/id no AsyncStorage — não vou buscar API.");
                return;
            }
            const url =
                role === "acompanhante"
                  ? `${API_BASE}/api/acompanhantes/${id}`
                  : `${API_BASE}/api/pacientes/${id}`;
            console.log("[Home] GET:", url);
            const resp = await fetch(url, {
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            const json = await resp.json();
            const row = json?.data || json;
            setNomeSocial(row?.nome_social || row?.nome || null);
        } catch (e) {
          console.log("[Home] erro:", e?.message || e);
        } finally {
          setLoading(false);
        }
      })();
    }, []);

    const saudacao = nomeSocial ? `Bem vindo, ${nomeSocial}!` : `Bem vindo!`;

    const navigation = useNavigation();

    const handleProntuario = () => {
        console.log("Precisa implementar navegação para prontuário");
    };

    const handleDuvidas = () => {
        console.log("Precisa implementar navegação para prontuário");
    };

    const handleHospital = () => {
        console.log("Precisa implementar navegação para prontuário");
    };

    const handleFamilia = () => {
        console.log("Precisa implementar navegação para prontuário");
    };

    const handleSAC = () => {
        console.log("Precisa implementar navegação para prontuário");
    };

    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });
    
    return(
        <View style={Estilo.container}>
            <Header style={Estilo.header}/>

            <View style={Estilo.bodySection}>
                {/* Mensagem de boas vindas com placeholder padrão como "Usuário" */}
                <Text style={Estilo.BodyTitle}>{saudacao}</Text>

                {/* Botão para prontuário */}
                <TouchableOpacity 
                    style={Estilo.prontuarioButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("Perfil")}
                >
                    <Text style={Estilo.prontuarioButtonText}>Prontuário Eletrônico</Text>
                </TouchableOpacity>

                {/* Botão para info/dúvidas */}
                <TouchableOpacity 
                    style={Estilo.duvidasButton}
                    onPress={() => navigation.navigate("Busca")}
                    activeOpacity={0.8}
                >
                    <Text style={Estilo.duvidasButtonText}>Dúvidas</Text>
                </TouchableOpacity>

                {/* Seção (sub-view) dos contatos */}
                <View style={Estilo.contatosSection}>
                    <Text style={Estilo.contatosTitle}>Contatos:</Text>
                    
                    {/* Botões de contato organizados horizontalmente */}
                    <View style={Estilo.contatosButtons}>
                        <TouchableOpacity 
                            style={Estilo.contatoButton}
                            onPress={handleHospital}
                            activeOpacity={0.8}
                        >
                            <Text style={Estilo.contatoButtonText}>Hospital</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={Estilo.contatoButton}
                            onPress={handleFamilia}
                            activeOpacity={0.8}
                        >
                            <Text style={Estilo.contatoButtonText}>Família</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={Estilo.contatoButton}
                            onPress={handleSAC}
                            activeOpacity={0.8}
                        >
                            <Text style={Estilo.contatoButtonText}>SAC</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const Estilo = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#FFF3E5",
    },

    header: {
        flex: 1,
    },

    bodySection: {
        flex: 3,
    },

    footer: {
        flex: 1,
    },

    BodyTitle: {
        fontFamily: "Comfortaa_400Regular",
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 25, marginLeft: 39,
        textAlign: "left",
        color: "#183102",
    },

    prontuarioButton: {
        backgroundColor: "#E8994B",
        height: 67, width: 290,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",

    },
    prontuarioButtonText: {
        fontFamily: "Comfortaa_400Regular",
        color: '#fff',
        fontSize: 20,
        fontWeight: 700,
    },

    duvidasButton: {
        height: 250, width: 250,
        backgroundColor: 'white',
        borderWidth: 2, borderColor: '#767714',
        borderRadius: "50%",
        margin: "auto",
        justifyContent: 'center',
        alignItems: 'center',
    },

    duvidasButtonText: {
        fontFamily: "Comfortaa_400Regular",
        fontSize: 32,
        fontWeight: 700,
        color: '#183102',
    },

    contatosSection: {
        marginVertical: 35,
    },

    contatosTitle: {
        marginBottom: 7,
        fontFamily: "Comfortaa_400Regular",
        fontSize: 24,
        fontWeight: 700,
        textAlign: "left", marginLeft: 40,
        color: '#183102',
    },

    contatosButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },

    contatoButton: {
        backgroundColor: "#fff",
        height: "auto", width: 125,
        paddingTop: 8, paddingBottom: 8,
        paddingLeft: 16, paddingRight: 16,
        borderWidth: 2, borderColor: '#fff',
        borderRadius: 10,
        boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
        alignItems: 'center',
    },

    contatoButtonText: {
        fontFamily: "Comfortaa_400Regular",
        fontSize: 20,
        fontWeight: 700,
        color: '#000',
    },
});
