import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function IntensidadeDor({ visible, onClose, sintoma }) {
  const [escalaSelecionada, setEscalaSelecionada] = useState(null);
  const BASE_URL = "http://localhost:3000/";
  const navigation = useNavigation();

  const handleConfirmar = async () => {
    if (escalaSelecionada === null) {
      alert("Selecione uma intensidade!");
      return;
    }

    const pacienteIdStr = await AsyncStorage.getItem("auth_id");
    const pacienteId = parseInt(pacienteIdStr, 10);

    if (!pacienteId) {
      alert("Erro: paciente não encontrado.");
      return;
    }

    const hoje = new Date().toISOString().split("T")[0];
    await AsyncStorage.setItem("ultimaDataSintoma", hoje);

    navigation.reset({
      index: 0,
      routes: [
        {
          name: "AbasPrincipais",
          state: {
            index: 0,
            routes: [{ name: "Home" }],
          },
        },
      ],
    });

    try {
      const resposta = await fetch(`${BASE_URL}api/registros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: pacienteId,
          sintoma_id: sintoma?.id,
          intensidade: escalaSelecionada,
        }),
      });

      const json = await resposta.json();

      if (json.success) {
        setEscalaSelecionada(null);
        onClose();
        if (onConfirm) onConfirm();
      }
    } catch (error) {
      console.log("Erro ao enviar intensidade:", error);
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={Estilo.modalOverlay}>
        <View style={Estilo.modalContainer}>
          <Text style={[Estilo.titulo, Estilo.txt]}>
            Qual é a intensidade do sintoma?
          </Text>
          <View style={Estilo.escalaContainer}>
            {[...Array(11).keys()].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  Estilo.botaoEscala,
                  escalaSelecionada === num && Estilo.botaoSelecionado,
                ]}
                onPress={() => setEscalaSelecionada(num)}
              >
                <Text
                  style={[
                    Estilo.textoEscala,
                    Estilo.txt,
                    escalaSelecionada === num && Estilo.textoSelecionado,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={Estilo.botoesContainer}>
            <TouchableOpacity
              style={[Estilo.botao, Estilo.cancelar]}
              onPress={onClose}
            >
              <Text style={[Estilo.textoBotao, Estilo.txt]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[Estilo.botao, Estilo.confirmar]}
              onPress={handleConfirmar}
            >
              <Text style={[Estilo.textoBotao, Estilo.txt]}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontFamily: "Comfortaa_400Regular",
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