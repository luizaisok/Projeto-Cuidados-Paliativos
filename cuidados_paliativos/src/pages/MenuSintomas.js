import { StyleSheet, Text, View } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ListaSintomas from "../components/ListaSintomas";
import Header from "../components/Header/index";
import Footer from "../components/Footer/index";
import IntensidadeDor from "../components/Modals/IntensidadeDor";

export default function MenuSintomas() {
  //console.log("MenuSintomas carregou!");

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [sintomaSelecionado, setSintomaSelecionado] = useState(null);

  const handleSelecionarSintoma = async (sintoma) => {
    console.log("Sintoma selecionado:", sintoma);
    setSintomaSelecionado(sintoma);
    setModalVisible(true);
  };

  return (
    <View style={Estilo.container}>
      <Header />
      <Text style={Estilo.title}>
        Você apresentou algum desses sintomas hoje?
      </Text>
      <ListaSintomas onSelecionar={handleSelecionarSintoma} />
      <Footer />

      <IntensidadeDor
        visible={modalVisible}
        sintoma={sintomaSelecionado}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E5",
  },
  title: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 35,
    marginTop: 25,
    marginBottom: 25,
    textAlign: "center",
    color: "#112A6C",
  },
});