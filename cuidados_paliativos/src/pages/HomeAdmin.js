import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Platform, TouchableOpacity, TextInput, Alert } from "react-native";
import { useFonts, Comfortaa_400Regular, Comfortaa_700Bold } from "@expo-google-fonts/comfortaa";
import { CartesianChart, Bar, useChartPressState } from "victory-native";
import { Circle } from "@shopify/react-native-skia";

import Header from "../components/Header";

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

const getCorPorID = (id) => {
  const index = id % PALETA_CORES.length;
  return PALETA_CORES[index];
};

const COR_PADRAO = "#112A6C";

const processarDados = (registros, listaSintomas) => {
  const mapaNomes = {};
  if (listaSintomas && Array.isArray(listaSintomas)) {
    listaSintomas.forEach((s) => {
      mapaNomes[s.id] = s.nome_sintoma;
    });
  }

  const grupos = {};

  registros.forEach((reg) => {
    const sId = Number(reg.sintoma_id);
    const int = Number(reg.intensidade);
    
    if (!grupos[sId]) grupos[sId] = [];
    grupos[sId].push(int);
  });

  const ids = Object.keys(grupos).map(Number);

  const montarObjeto = (id, valorCalculado) => ({
    label: mapaNomes[id] || `ID ${id}`,
    value: Number(valorCalculado),
    color: getCorPorID(id),
  });

  // 1. Média
  const dadosMedia = ids.map((id) => {
    const valores = grupos[id];
    const soma = valores.reduce((a, b) => a + b, 0);
    const media = (soma / valores.length).toFixed(1);
    return montarObjeto(id, media);
  });

  // 2. Moda / Frequência
  const dadosModa = ids.map((id) => {
    return montarObjeto(id, grupos[id].length);
  });

  // 3. Mediana
  const dadosMediana = ids.map((id) => {
    const valores = [...grupos[id]].sort((a, b) => a - b);
    const mid = Math.floor(valores.length / 2);
    const mediana =
      valores.length % 2 !== 0
        ? valores[mid]
        : (valores[mid - 1] + valores[mid]) / 2;

    return montarObjeto(id, mediana);
  });

  // 4. Variância (NOVO) - Quão espalhados estão os dados
  const dadosVariancia = ids.map((id) => {
    const valores = grupos[id];
    const n = valores.length;
    // Passo 1: Calcular Média
    const soma = valores.reduce((a, b) => a + b, 0);
    const media = soma / n;
    // Passo 2: Calcular Soma dos Quadrados das Diferenças
    const somaDifQuad = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0);
    // Passo 3: Variância Populacional
    const variancia = (somaDifQuad / n).toFixed(2);
    
    return montarObjeto(id, variancia);
  });

  // 5. Desvio Padrão (NOVO) - Raiz quadrada da variância
  const dadosDesvioPadrao = ids.map((id) => {
    const valores = grupos[id];
    const n = valores.length;
    const soma = valores.reduce((a, b) => a + b, 0);
    const media = soma / n;
    const somaDifQuad = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0);
    const variancia = somaDifQuad / n;
    const desvio = Math.sqrt(variancia).toFixed(2);

    return montarObjeto(id, desvio);
  });

  return { dadosMedia, dadosModa, dadosMediana, dadosVariancia, dadosDesvioPadrao };
};

const GraficoWeb = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const alturaTotal = 200;

  return (
    <View style={{ height: alturaTotal, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingHorizontal: 10 }}>
      {data.map((item, index) => {
        const alturaBarra = maxVal > 0 ? (item.value / maxVal) * alturaTotal : 0;
        
        return (
          <View key={index} style={{ alignItems: 'center', flex: 1 }}>
             <View style={{ 
               width: 24, 
               height: alturaBarra, 
               backgroundColor: item.color, 
               borderTopLeftRadius: 6,
               borderTopRightRadius: 6,
               minHeight: item.value > 0 ? 4 : 0 
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

// Gerenciador de Sintomas
const GerenciadorSintomas = ({ onAtualizar }) => {
  const [expandido, setExpandido] = useState(false);
  const [verTodos, setVerTodos] = useState(false);
  const [sintomas, setSintomas] = useState([]);
  const [novoSintoma, setNovoSintoma] = useState("");

  // Carrega sintomas da API
  const carregarSintomas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/sintomas");
      const data = await res.json();
      if (data.success) setSintomas(data.sintomas);
    } catch (error) {
      console.error("Erro ao carregar sintomas:", error);
    }
  };

  // Carrega quando expande
  useEffect(() => {
    if (expandido) carregarSintomas();
  }, [expandido]);

  // Remove sintoma
  const removerSintoma = async (id, nome) => {
    const confirmar = Platform.OS === 'web' 
      ? window.confirm(`Remover "${nome}"?`)
      : await new Promise((resolve) => {
          Alert.alert("Confirmar", `Remover "${nome}"?`, [
            { text: "Cancelar", onPress: () => resolve(false) },
            { text: "Remover", onPress: () => resolve(true) }
          ]);
        });

    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3000/api/sintomas/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setSintomas(sintomas.filter(s => s.id !== id));
        onAtualizar();
      }
    } catch (error) {
      console.error("Erro ao remover:", error);
    }
  };

  // Adiciona novo sintoma
  const adicionarSintoma = async () => {
    if (!novoSintoma.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/api/sintomas", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_sintoma: novoSintoma.trim() }),
      });

      const data = await res.json();
      
      if (data.success) {
        setNovoSintoma("");
        carregarSintomas();
        onAtualizar();
      }
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    }
  };

  const sintomasVisiveis = verTodos ? sintomas : sintomas.slice(0, 3);

  return (
    <View style={Estilo.gerenciadorContainer}>
      {/* Botão expandir/recolher */}
      <TouchableOpacity style={Estilo.botaoExpandir} onPress={() => setExpandido(!expandido)}>
        <Text style={Estilo.botaoExpandirTexto}>
          {expandido ? "Fechar Gerenciamento de Sintomas" : "Gerenciar Sintomas"}
        </Text>
      </TouchableOpacity>

      {/* Conteúdo expandido */}
      {expandido && (
        <View style={Estilo.painelExpandido}>
          <Text style={Estilo.subtitulo}>Lista de Sintomas</Text>

          {/* Lista de sintomas */}
          {sintomasVisiveis.map((sintoma) => (
            <View key={sintoma.id} style={Estilo.sintomaItem}>
              <Text style={Estilo.sintomaNome}>{sintoma.nome_sintoma}</Text>
              <TouchableOpacity
                style={Estilo.botaoRemover}
                onPress={() => removerSintoma(sintoma.id, sintoma.nome_sintoma)}
              >
                <Text style={Estilo.botaoRemoverTexto}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Botão "Ver mais" */}
          {sintomas.length > 3 && (
            <TouchableOpacity onPress={() => setVerTodos(!verTodos)}>
              <Text style={Estilo.verMais}>
                {verTodos ? "Ver menos" : "Ver mais"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Formulário adicionar */}
          <View style={Estilo.formularioAdicionar}>
            <Text style={Estilo.subtitulo}>Adicionar Novo Sintoma</Text>
            
            <TextInput
              style={Estilo.input}
              placeholder="Nome do sintoma"
              placeholderTextColor="#999"
              value={novoSintoma}
              onChangeText={setNovoSintoma}
            />

            <TouchableOpacity style={Estilo.botaoAdicionar} onPress={adicionarSintoma}>
              <Text style={Estilo.botaoAdicionarTexto}>Adicionar Sintoma</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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

  // Função para carregar dados da API
  const carregarDados = async () => {
    try {
      const BASE_URL = getBaseUrl();
      console.log("Conectando em:", BASE_URL);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const [resRegistros, resSintomas] = await Promise.all([
        fetch(`${BASE_URL}/api/registros`, { signal: controller.signal }),
        fetch(`${BASE_URL}/api/sintomas`, { signal: controller.signal })
      ]);

      clearTimeout(timeoutId);

      const jsonRegistros = await resRegistros.json();
      const jsonSintomas = await resSintomas.json();

      if (jsonRegistros.success && jsonSintomas.success) {
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

  useEffect(() => {
    carregarDados();
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

            <MeuGraficoBarras
              titulo="Variância da Intensidade"
              data={metricas.dadosVariancia}
              corTemaMobile="#008080" // Verde Azulado
            />

            <MeuGraficoBarras
              titulo="Desvio Padrão da Intensidade"
              data={metricas.dadosDesvioPadrao}
              corTemaMobile="#800080" // Roxo
            />

            <GerenciadorSintomas onAtualizar={carregarDados} />
          </>
        ) : (
          <Text style={[Estilo.txt, Estilo.card, {textAlign: 'center'}]}>
            Não foi possível carregar os dados.
          </Text>
        )}
      </ScrollView>
      
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
   gerenciadorContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  botaoExpandir: {
    padding: 16,
    backgroundColor: "#015184",
    alignItems: "center",
  },
  botaoExpandirTexto: {
    fontFamily: "Comfortaa_700Bold",
    color: "#FFF6E5",
    fontSize: 16,
  },
  painelExpandido: {
    padding: 14,
  },
  subtitulo: {
    fontFamily: "Comfortaa_700Bold",
    fontSize: 16,
    color: "#112A6C",
    marginBottom: 12,
    marginTop: 8,
  },
  sintomaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    marginBottom: 8,
  },
  sintomaNome: {
    fontFamily: "Comfortaa_400Regular",
    fontSize: 14,
    color: "#532C1D",
    flex: 1,
  },
  botaoRemover: {
    backgroundColor: "#a00000",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoRemoverTexto: {
    fontFamily: "Comfortaa_700Bold",
    color: "#FFF6E5",
    fontSize: 12,
  },
  verMais: {
    fontFamily: "Comfortaa_700Bold",
    color: "#015184",
    textAlign: "center",
    marginTop: 12,
    textDecorationLine: "underline",
    fontSize: 14,
  },
  formularioAdicionar: {
    marginTop: 0,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  input: {
    fontFamily: "Comfortaa_400Regular",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#532C1D",
    borderWidth: 1,
    borderColor: "#F4F4F4",
  },
  botaoAdicionar: {
    backgroundColor: "#8BAAC4",
    padding: 14,marginTop: 5,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  botaoAdicionarTexto: {
    fontFamily: "Comfortaa_700Bold",
    color: "#FFF6E5",
    fontSize: 16,
    fontWeight: "700",
  },
});