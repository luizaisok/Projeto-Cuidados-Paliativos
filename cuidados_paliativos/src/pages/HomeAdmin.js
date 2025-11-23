import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useFonts, Comfortaa_400Regular, Comfortaa_700Bold } from "@expo-google-fonts/comfortaa";
import { CartesianChart, Bar, useChartPressState } from "victory-native";
import { Circle } from "@shopify/react-native-skia";

import Header from "../components/Header";
import Footer from "../components/Footer";

// Paleta de cores para gerar cores automáticas para novos sintomas
const PALETA_CORES = [
  "#E4572E", // Laranja
  "#F3A712", // Amarelo
  "#A8C686", // Verde
  "#669BBC", // Azul Claro
  "#29335C", // Azul Escuro
  "#8E6C88", // Roxo
  "#FF6B6B", // Rosa
  "#4ECDC4", // Turquesa
  "#C7F464", // Lima
  "#556270", // Cinza Azulado
];

// Função que escolhe uma cor baseada no ID (sempre a mesma cor para o mesmo ID)
const getCorPorID = (id) => {
  const index = id % PALETA_CORES.length;
  return PALETA_CORES[index];
};

const COR_PADRAO = "#112A6C";

const processarDados = (registros, listaSintomas) => {
  // 1. Cria um dicionário para traduzir ID -> Nome rápido
  const mapaNomes = {};
  if (listaSintomas && Array.isArray(listaSintomas)) {
    listaSintomas.forEach((s) => {
      // Ajuste conforme o nome da coluna no seu banco (id e nome_sintoma)
      mapaNomes[s.id] = s.nome_sintoma;
    });
  }

  const grupos = {};

  // 2. Agrupa os registros por ID do sintoma
  registros.forEach((reg) => {
    const sId = Number(reg.sintoma_id);
    const int = Number(reg.intensidade);
    
    if (!grupos[sId]) grupos[sId] = [];
    grupos[sId].push(int);
  });

  const ids = Object.keys(grupos).map(Number);

  // Função auxiliar para montar o dado do gráfico
  const montarObjeto = (id, valorCalculado) => ({
    // Se achar o nome na lista da API, usa ele. Se não, usa "ID X"
    label: mapaNomes[id] || `ID ${id}`,
    value: Number(valorCalculado),
    color: getCorPorID(id),
  });

  // Média
  const dadosMedia = ids.map((id) => {
    const valores = grupos[id];
    const soma = valores.reduce((a, b) => a + b, 0);
    const media = (soma / valores.length).toFixed(1);
    return montarObjeto(id, media);
  });

  // Moda (Frequência)
  const dadosModa = ids.map((id) => {
    return montarObjeto(id, grupos[id].length);
  });

  // Mediana
  const dadosMediana = ids.map((id) => {
    const valores = [...grupos[id]].sort((a, b) => a - b);
    const mid = Math.floor(valores.length / 2);
    const mediana =
      valores.length % 2 !== 0
        ? valores[mid]
        : (valores[mid - 1] + valores[mid]) / 2;

    return montarObjeto(id, mediana);
  });

  return { dadosMedia, dadosModa, dadosMediana };
};

// --- Componentes Visuais ---

const GraficoWeb = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const alturaTotal = 200;

  return (
    <View style={{ height: alturaTotal, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingHorizontal: 10 }}>
      {data.map((item, index) => {
        const alturaBarra = (item.value / maxVal) * alturaTotal;
        
        return (
          <View key={index} style={{ alignItems: 'center', flex: 1 }}>
             <View style={{ 
               width: 24, 
               height: alturaBarra, 
               backgroundColor: item.color, 
               borderTopLeftRadius: 6,
               borderTopRightRadius: 6,
               minHeight: 4 
             }} />
          </View>
        );
      })}
    </View>
  );
};

const GraficoNativo = ({ data, corPadrao }) => {
  const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });

  return (
    <View style={{ height: 200, width: "100%" }}>
      <CartesianChart
        data={data}
        xKey="label"
        yKeys={["value"]}
        domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => (
          <>
            <Bar
              points={points.value}
              chartBounds={chartBounds}
              color={corPadrao}
              roundedCorners={{ topLeft: 4, topRight: 4 }}
            />
            {isActive && (
              <Circle
                cx={state.x.position}
                cy={state.y.value.position}
                r={8}
                color={corPadrao}
                opacity={0.5}
              />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
};

const MeuGraficoBarras = ({ titulo, data, corTemaMobile }) => {
  return (
    <View style={Estilo.cardGrafico}>
      <Text style={Estilo.cardTitle}>{titulo}</Text>
      
      {Platform.OS === 'web' ? (
         <GraficoWeb data={data} />
      ) : (
         <GraficoNativo data={data} corPadrao={corTemaMobile} />
      )}

      <View style={Estilo.legendaContainer}>
        {data.map((item, index) => (
          <View key={index} style={Estilo.legendaItem}>
            <View style={[Estilo.legendaCor, { backgroundColor: item.color }]} />
            <Text style={Estilo.legendaTexto}>
              {item.label}: <Text style={{fontWeight: 'bold', color: '#333'}}>{item.value}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function HomeAdmin() {
  let [fontsLoaded] = useFonts({
    Comfortaa_400Regular,
    Comfortaa_700Bold,
  });

  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState(null);

  const getBaseUrl = () => {
    if (Platform.OS === 'web') return "http://localhost:3000";
    if (Platform.OS === 'android') return "http://10.0.2.2:3000";
    return "http://192.168.1.15:3000"; 
  };

  useEffect(() => {
    const carregarTudo = async () => {
      try {
        const BASE_URL = getBaseUrl();
        console.log("Conectando em:", BASE_URL);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        // Busca Registros E Sintomas ao mesmo tempo
        const [resRegistros, resSintomas] = await Promise.all([
          fetch(`${BASE_URL}/api/registros`, { signal: controller.signal }),
          fetch(`${BASE_URL}/api/sintomas`, { signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        const jsonRegistros = await resRegistros.json();
        const jsonSintomas = await resSintomas.json();

        if (jsonRegistros.success && jsonSintomas.success) {
          // Passamos as duas listas para processar
          const dadosFinais = processarDados(jsonRegistros.registros, jsonSintomas.sintomas);
          setMetricas(dadosFinais);
        } else {
          throw new Error("Falha na resposta da API");
        }
      } catch (error) {
        console.warn("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTudo();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={Estilo.container}>
        <ActivityIndicator size="large" color="#112A6C" />
        <Text style={Estilo.txt}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={Estilo.container}>
      <Header /> 
      
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={[Estilo.txt, Estilo.title]}>Dashboard</Text>

        {metricas ? (
          <>
            <MeuGraficoBarras
              titulo="Média Intensidade"
              data={metricas.dadosMedia}
              corTemaMobile="#112A6C"
            />

            <MeuGraficoBarras
              titulo="Frequência (Moda)"
              data={metricas.dadosModa}
              corTemaMobile="#E4572E"
            />

            <MeuGraficoBarras
              titulo="Mediana Intensidade"
              data={metricas.dadosMediana}
              corTemaMobile="#29335C"
            />
          </>
        ) : (
          <Text style={[Estilo.txt, Estilo.card, {textAlign: 'center'}]}>
            Não foi possível carregar os dados.
          </Text>
        )}
      </ScrollView>
      
      <Footer />
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8DAC0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    fontFamily: "Comfortaa_400Regular",
    color: "#112A6C",
  },
  title: {
    fontFamily: "Comfortaa_700Bold",
    fontSize: 28,
    color: "#112A6C",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    margin: 10,
    borderRadius: 10,
  },
  cardGrafico: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontFamily: "Comfortaa_700Bold",
    fontSize: 18,
    color: "#112A6C",
    marginBottom: 15,
    textAlign: "center",
  },
  legendaContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendaCor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendaTexto: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 12,
    color: "#666",
  },
});