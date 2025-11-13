import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Button} from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IntensidadeDor({ visible, onClose, sintoma }) {
  const navigation = useNavigation();
  const [escalaSelecionada, setEscalaSelecionada] = useState(null);
  const BASE_URL = "http://localhost:3000/";

  let [fontsLoaded] = useFonts({
        Comfortaa_400Regular
  });

  async function handleModalIntensidadeDor(){
    try{
      const res = await fetch(`${BASE_URL}api/registros`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({intensidade: escalaSelecionada})
      });
      if(!res.ok) throw new Error(await res.text());
      const data = await res.json();
      console.log("Resposta API: ", data);
      //alert("Registro realizado com sucesso!")
      
      onClose();

      const hoje = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem("ultimaDataSintoma", hoje);

      navigation.reset({
        index: 0,
        routes: [{ name: "AbasPrincipais", params: { screen: "Home" } }],
      });

    }catch(error){
      console.error("Erro ao realizar registro: ", error);
    }
  }

  return (
    <View style={styles.container}>

      <Modal
        transparent
        animationType="fade"
        visible={visible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.titulo, styles.txt]}>Qual é a intensidade do sintoma?</Text>

            <View style={styles.escalaContainer}>
              {[...Array(11).keys()].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.botaoEscala,
                    escalaSelecionada === num && styles.botaoSelecionado,
                  ]}
                  onPress={() => setEscalaSelecionada(num)}
                >
                  <Text
                    style={[
                      styles.textoEscala,
                      styles.txt,
                      escalaSelecionada === num && styles.textoSelecionado,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.botoesContainer}>
              <TouchableOpacity
                style={[styles.botao, styles.cancelar]}
                onPress={onClose}
              >
                <Text style={[styles.textoBotao, styles.txt]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.confirmar]}
                onPress={handleModalIntensidadeDor}
              >
                <Text style={[styles.textoBotao, styles.txt]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontFamily: "Comfortaa_400Regular"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#f7f2edff",
    borderRadius: 20,
    padding: 15,
    width: "80%",
    elevation: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  escalaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  botaoEscala: {
    width: 45,
    height: 45,
    borderRadius: 25,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  botaoSelecionado: {
    backgroundColor: "#7fb8b0",
  },
  textoEscala: {
    fontSize: 16,
    color: "#333",
  },
  textoSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botao: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmar: {
    backgroundColor: "#59a87d",
  },
  cancelar: {
    backgroundColor: "#d63031",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
});