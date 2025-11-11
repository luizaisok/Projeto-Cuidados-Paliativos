import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:3000";

export default function Login() {

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

      // Vai para as ABAS focando a tab Home (HomePage)
      navigation.replace("AbasPrincipais", { screen: "Home" });
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
            <Text style={Estilo.titulo} >Entrar</Text>
            <View>
                <Text style={Estilo.label}>E-mail</Text>

                <TextInput 
                placeholder="Digite o seu e-mail"
                style={Estilo.input}
                autoCapitalize="none"
                autoComplete="off"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                />

                <Text style={Estilo.label}>Senha</Text>
                
                <TextInput 
                    placeholder="Digite a sua senha"
                    style={Estilo.input}
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                <TouchableOpacity style={Estilo.botaoSecundario}>
                    <Text>Esqueci minha senha</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={Estilo.botaoEntrar} onPress={entrar} disabled={loading}>
                {loading ? <ActivityIndicator /> : <Text style={Estilo.textoEntrar}>Entrar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={Estilo.botaoSecundario} onPress={() => navigation.navigate("Cadastro")}>
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