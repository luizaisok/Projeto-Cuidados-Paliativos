import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomeAdmin() {
  let [fontsLoaded] = useFonts({
    Comfortaa_400Regular,
  });

  return (
    <View style={Estilo.container}>
      <Header />
      <ScrollView>
        <Text style={[Estilo.txt, Estilo.title]}>Dashboard Administrativo</Text>
        <Text style={[Estilo.txt, Estilo.subtitle]}>Intensidade do Sintoma X Idade</Text>
        <Text style={[Estilo.txt, Estilo.card]}>
          Aqui serão inseridos todos os gráficos
        </Text>
      </ScrollView>
      <Footer />
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8DAC0",
  },
  txt: {
    fontFamily: "Comfortaa_400Regular",
  },
  title: {
    fontSize: 30,
    color: "#112A6C",
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center"
  },
  subtitle:{
    fontSize: 16,
    color: "#112A6C",
    marginTop: 30,
    textAlign: "center"
  },
  card: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 40,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 20,
  },
});