import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import Header from "../components/Header";

const API_BASE = "http://localhost:3000";

export default function Login() {
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });

  const navigation = useNavigation();
  const route = useRoute();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      alert("Preencha e-mail e senha.");
      return;
    }
    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });
      const data = await resp.json();

      if (!resp.ok || data?.error) {
        throw new Error(data?.message || "Falha no login");
      }

      // Salva token e infos básicas (para próximos CRUDs)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", String(data.user.id));
      localStorage.setItem("userTipo", data.user.tipo);
      localStorage.setItem("userEmail", data.user.email);

      await AsyncStorage.multiSet([
         ["auth_token", data.token],
         ["auth_id", String(data.user.id)],
         ["auth_role", data.user.tipo],
         ["auth_email", data.user.email],
      ]);

        navigation.replace("MenuSintomas");

    } catch (e) {
      alert(e.message || "Erro ao conectar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
        <Header/>
        <View style={Estilo.container}>
            <Image 
                source={require("../assets/img/LogoClara.png")} 
                style={Estilo.img}
            />
            <Text style={[Estilo.titulo, Estilo.txt]} >Entrar</Text>
            <View>
                <Text style={[Estilo.label, Estilo.txt]}>E-mail</Text>

                <TextInput 
                placeholder="Digite o seu e-mail"
                style={[Estilo.input, Estilo.txt]}
                autoCapitalize="none"
                autoComplete="off"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                />

                <Text style={[Estilo.label, Estilo.txt]}>Senha</Text>
                
                <TextInput 
                    placeholder="Digite a sua senha"
                    style={[Estilo.input, Estilo.txt]}
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                <TouchableOpacity style={Estilo.botaoSecundario}>
                    <Text style={[Estilo.txt, {fontSize: 13}]}>Esqueci minha senha</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={Estilo.botaoEntrar} onPress={entrar} disabled={loading}>
                {loading ? <ActivityIndicator /> : <Text style={[Estilo.textoEntrar, Estilo.txt]}>Entrar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={Estilo.botaoSecundario} onPress={() => navigation.navigate("Cadastro")}>
                <Text style={[Estilo.txt, {fontSize: 20}]}>ou Cadastre-se</Text>
            </TouchableOpacity>
        </View>
        {/*<Footer/>*/}
    </>
    
  )
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
        fontWeight: 500,
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
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoEntrar: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold'
    }
})