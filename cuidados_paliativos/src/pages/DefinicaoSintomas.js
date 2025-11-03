import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

const BASE_URL = "http://localhost:3000/";

import Header from "../components/Header/index";
import Footer from "../components/Footer/index";

export default function Conteudo(){
  const [conteudo, setConteudo] = useState(null)

  const getConteudos = async () => {
      try{
        console.log("Iniciando a conexão com a API...");
        const response = await fetch(`${BASE_URL}api/conteudo/${id}`, {
          method: "GET",
        });
        console.log("Conteudo de Response: ", response);
        
        const json = await response.json();
        console.log("Conteudo do JSON: ", json);
        setConteudo(json);
      }catch(error){
        console.error("Erro ao realizar requisição GET: ", error);
      }
  }

  useEffect(() => {
    getConteudos();
  }, []);

    return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{conteudo.titulo}</Text>
          <View style={styles.titleUnderline} />
        </View>

        <View style={styles.definitionSection}>
          <Text style={styles.definitionSectionTitle}>Definição: <Text style={styles.definitionSectionText}>{conteudo.texto}</Text></Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinais e Sintomas: </Text><Text style={styles.sectionText}>{conteudo.sinaisSintomas}</Text>
        </View>

        <TouchableOpacity 
          style={styles.buttonOrange} 
          onPress={handleSintomasPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Sinto um ou mais{"\n"}dos sinais e sintomas</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinais de Alerta: </Text>
          <Text style={styles.sectionText}>{conteudo.sinaisAlerta}</Text>
        </View>

        <TouchableOpacity 
          style={styles.buttonRed} 
          onPress={handleAlertaPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Sinto um ou mais{"\n"}dos sinais de alerta</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8DAC0',
  },

  content: {
    paddingTop: 40, paddingBottom: 40,
    paddingLeft: 20, paddingRight: 20,
  },

  title: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 32,
    fontWeight: 700,
    color: "#112A6C",
    textAlign: "center",
  },
  
  titleUnderline: {
    height: 3,
    backgroundColor: '#FFF',
    width: '100%',
    marginTop: 20, marginBottom: 20,
  },

  definitionSection: {
    marginTop: 0, marginBottom: 20,
  },

  definitionSectionTitle: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 24,
    fontWeight: 700,
    color: "#112A6C",
  },

  definitionSectionText: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 24,
    fontWeight: 400,
    color: "#112A6C",
  },

  sectionTitle: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 24,
    fontWeight: 700,
    color: "#000",
    lineHeight: 35,
  },

  sectionText: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 24,
    fontWeight: 400,
    color: "#000",
    lineHeight: 35,
  },

  buttonOrange: {
    backgroundColor: '#E8994B',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    margin: "auto",
    width: 290, height: 67,
    marginTop: 20, marginBottom: 20,
  },

  buttonRed: {
    backgroundColor: '#D00000',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    margin: "auto",
    width: 290, height: 67,
    marginTop: 20, marginBottom: 0,
  },

  // não consigo centralizar esse negóciooooooo
  buttonText: {
    fontSize: 20,
    // textAlign: "center",
    fontWeight: 700,
    color: '#FFF',
    textShadow: "4px 4px 4px rgba(0, 0, 0, 0.25)",
  },
});
