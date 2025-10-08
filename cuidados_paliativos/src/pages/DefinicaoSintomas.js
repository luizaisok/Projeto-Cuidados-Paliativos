import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

import Header from "../components/Header/index";
import Footer from "../components/Footer/index";


const handleSintomasPress = () => {
    console.log('Botão "Sinto um ou mais dos sinais e sintomas" pressionado');
};

const handleAlertaPress = () => {
    console.log('Botão "Sinto um ou mais dos sinais de alerta" pressionado');
};

// Optei por usar passagem de props pensando na API futuramente
export default ({tituloPrincipal = "Constipação Intestinal", definicao = "Caracterizado por evacuações pouco frequentes, podendo ser também incompletas e difíceis.", sinaisESintomas = "Dificuldade ou incapacidade de evacuar;\nEsforço excessivo ou força para evacuar;\nMenos de três evacuações por semana;\nEliminação de fezes endurecidas;\nSensação de esvaziamento incompleto do reto.", sinaisDeAlerta = "Início rápido;\nNáuseas e/ou vômito;\nDificuldade na eliminação de flatos;\nDor intensa e distenção abdominal;\nPerda de peso sem explicação;\nSangramento retal;\nAnemia ferropriva inexplicável;\nHistória familiar de câncer de cólon."}) => {
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });

    return (
    // Optei por ScrollView porquê a largura ultrapassa a tela 
    <ScrollView style={styles.container}>
      {/* Cabeçálio */}
      <Header />
      <View style={styles.content}>
        {/* Título principal (ex.: constipação intestinal) */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tituloPrincipal}</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Definição (ex.: caracterizado por...) */}
        <View style={styles.definitionSection}>
          <Text style={styles.definitionSectionTitle}>Definição: <Text style={styles.definitionSectionText}>{definicao}</Text></Text>
        </View>

        {/* Sinais e sintomas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinais e Sintomas: </Text><Text style={styles.sectionText}>{sinaisESintomas}</Text>
        </View>

        {/* Botão de alerta: 1 ou + sinais ou sintomas presentes*/}
        <TouchableOpacity 
          style={styles.buttonOrange} 
          onPress={handleSintomasPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Sinto um ou mais{"\n"}dos sinais e sintomas</Text>
        </TouchableOpacity>

        {/* Sinais de Alerta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinais de Alerta: </Text>
          <Text style={styles.sectionText}>{sinaisDeAlerta}</Text>
        </View>

        {/* Botão Alerta: 1 ou + sinais de alerta presentes */}
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
