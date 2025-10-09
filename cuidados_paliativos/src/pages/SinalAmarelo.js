import { ScrollView, View, Text, StyleSheet } from 'react-native';

import Header from "../components/Header";
import Footer from "../components/Footer";

import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";

export default () => {
    let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
    });

    return ( 
    // Optei pela utilização do ScrollView pois, na Web, a largura ultrassa o limite de visualização da tela   
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* Badge (ex.: Atenção moderada, etc.) */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Atenção moderada</Text>
        </View>
        {/* "Div" principal que conterá o conteúdo da página */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fique atento aos sinais do seu corpo</Text>

          <Text style={styles.cardDescription}>Os sintomas que você relatou merecem acompanhamento, mas não são alarmantes neste momento. Em cuidados paliativos, é importante manter o bem-estar físico e emocional. Hidrate-se, descanse e, se os sintomas piorarem ou novos surgirem, avise sua equipe de saúde.</Text>
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8994B',
  },

  content: {
    paddingVertical: 16, paddingHorizontal: 8,
  },

  badge: {
    backgroundColor: '#FFF',
    height: "auto", width: "auto",
    borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 8,
    marginVertical: 20,marginHorizontal: "auto",
    boxShadow: "4px 4px 4px rgba (0, 0, 0, 0.25)",
  },

  badgeText: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 32,
    fontWeight: 700,
    color: '#E8994B',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFF',
    height: "auto", width: "auto",
    borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 8,
    boxShadow: "4px 4px 4px rgba (0, 0, 0, 0.25)", 
  },

  cardTitle: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 24,
    fontWeight: 700,
    color: '#E8994B',
    textAlign: 'center',
    marginVertical: 20, marginHorizontal: 5, 
  },

  cardDescription: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 24,
    fontWeight: 400,
    color: '#E8994B',
    textAlign: 'center',
    lineHeight: 35,
    marginTop: 20, marginBottom: 40,
    marginHorizontal: 5, 
  },
});
