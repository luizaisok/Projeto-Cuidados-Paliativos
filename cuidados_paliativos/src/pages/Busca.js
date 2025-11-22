import { 
  FlatList, Image, StyleSheet, Text, TextInput, 
  TouchableOpacity, View, ActivityIndicator, Modal, Button, Alert 
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import Header from "../components/Header";

const BASE_URL = "http://localhost:3000/";
const AUTH_HEADER = { "Content-Type": "application/json" };

// Funções de API
const createConteudo = async (conteudo) => {
  try {
    const res = await fetch(`${BASE_URL}api/conteudos`, {
      method: "POST",
      headers: AUTH_HEADER,
      body: JSON.stringify(conteudo),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  } catch (error) {
    console.error("Erro ao criar conteúdo: ", error);
    return false;
  }
};

const updateConteudo = async (id, conteudo) => {
  try {
    const res = await fetch(`${BASE_URL}api/conteudos/${id}`, {
      method: "PUT",
      headers: AUTH_HEADER,
      body: JSON.stringify(conteudo),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  } catch (error) {
    console.error("Erro ao editar conteúdo: ", error);
    return false;
  }
};

const deleteConteudo = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}api/conteudos/${id}`, {
      method: "DELETE",
      headers: AUTH_HEADER,
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  } catch (error) {
    console.error("Erro ao deletar conteúdo: ", error);
    return false;
  }
};

const Card = ({ dado, usuario, abrirModalEdicao, getConteudos }) => {
  const navigation = useNavigation();

  return (
    <View style={Estilo.containerCard}>
      <Text style={Estilo.cardTitulo}>{dado?.titulo}</Text>
      <View style={Estilo.cardDivisor}></View>
      <Text style={Estilo.cardDescricao}>{dado?.descricao}</Text>

      <View style={Estilo.footerCard}>
        <TouchableOpacity 
          style={Estilo.footerButton}
          onPress={() => navigation.navigate("ConteudoDetalhe", { id: dado.id })}
        >
          <Text style={Estilo.footerText}>Ler mais</Text>
          <Image source={require('../assets/img/seta.png')} style={{width: 16, height: 16}}/>
        </TouchableOpacity>
        <Text style={Estilo.footerDate}>{dado?.data}</Text>
      </View>

      {usuario.tipo === "adm" && (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <TouchableOpacity onPress={() => abrirModalEdicao(dado)}>
            <Text style={{ color: "#112A6C", fontWeight: "bold" }}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            Alert.alert(
              "Confirmar exclusão",
              "Deseja realmente excluir?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: async () => {
                    const sucesso = await deleteConteudo(dado.id);
                    if (sucesso) getConteudos();
                } }
              ]
            );
          }}>
            <Text style={{ color: "#D94141", fontWeight: "bold" }}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Página principal
export default function Busca() {
  const [conteudos, setConteudos] = useState([]);
  const [atualizando, setAtualizando] = useState(false);
  const [pesquisa, setPesquisa] = useState("");

  const [usuario, setUsuario] = useState({ tipo: "adm" });

  const [modalVisivel, setModalVisivel] = useState(false);
  const [conteudoModal, setConteudoModal] = useState({
    id: null,
    titulo: "",
    descricao: "",
    SinaisSintomas: "",
    SinaisAlerta: "",
  });

  useEffect(() => {
    getConteudos();
  }, []);

  const getConteudos = async () => {
    try {
      setAtualizando(true);
      const response = await fetch(`${BASE_URL}api/conteudos`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const json = await response.json();
      setConteudos(json.conteudos);
    } catch (error) {
      console.error("Erro ao realizar requisição GET: ", error);
    } finally {
      setAtualizando(false);
    }
  };

  const abrirModalEdicao = (dado) => {
    setConteudoModal(dado);
    setModalVisivel(true);
  };

  const handleSalvar = async () => {
    let sucesso = false;
    if (conteudoModal.id) {
      sucesso = await updateConteudo(conteudoModal.id, conteudoModal);
    } else {
      sucesso = await createConteudo(conteudoModal);
    }

    if (sucesso) {
      setModalVisivel(false);
      setConteudoModal({ id: null, titulo: "", descricao: "", SinaisSintomas: "", SinaisAlerta: "" });
      getConteudos();
    } else {
      alert("Erro ao salvar conteúdo");
    }
  };

  const conteudosFiltrados = conteudos.filter((item) =>
    item.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
    item.descricao.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <>
      <Header />

      <View style={Estilo.container}>

        <View style={Estilo.inputContainer}>
          <TextInput
            placeholder="Procurar por tema"
            style={Estilo.input}
            value={pesquisa}
            onChangeText={(texto) => setPesquisa(texto)}
          />
          <TouchableOpacity onPress={() => console.log('Buscando...', pesquisa)}>
            <Image
              source={require('../assets/img/lupa.png')}
              style={Estilo.iconeLupa}
            />
          </TouchableOpacity>
        </View>

        {usuario.tipo === "adm" && (
          <TouchableOpacity onPress={() => setModalVisivel(true)} style={{ marginBottom: 20 }}>
            <Text style={{ color: "#112A6C", fontWeight: "bold" }}>Adicionar Conteúdo</Text>
          </TouchableOpacity>
        )}

        {atualizando ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={conteudosFiltrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card dado={item} usuario={usuario} abrirModalEdicao={abrirModalEdicao} getConteudos={getConteudos} />
            )}
            ListEmptyComponent={<Text>Não foram postados conteúdos.</Text>}
          />
        )}

        {/* Modal */}
        <Modal visible={modalVisivel} animationType="slide">
          <View style={{ padding: 20, flex: 1 }}>
            <TextInput
              placeholder="Título"
              value={conteudoModal.titulo}
              onChangeText={(t) => setConteudoModal({ ...conteudoModal, titulo: t })}
              style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
            />
            <TextInput
              placeholder="Descrição"
              value={conteudoModal.descricao}
              onChangeText={(t) => setConteudoModal({ ...conteudoModal, descricao: t })}
              style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
            />
            <TextInput
              placeholder="Sinais e Sintomas"
              value={conteudoModal.SinaisSintomas}
              onChangeText={(t) => setConteudoModal({ ...conteudoModal, SinaisSintomas: t })}
              style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
            />
            <TextInput
              placeholder="Sinais de Alerta"
              value={conteudoModal.SinaisAlerta}
              onChangeText={(t) => setConteudoModal({ ...conteudoModal, SinaisAlerta: t })}
              style={{ marginBottom: 20, borderBottomWidth: 1, borderColor: "#ccc" }}
            />

            <Button title="Salvar" onPress={handleSalvar} />
            <Button title="Cancelar" onPress={() => setModalVisivel(false)} color="#D94141" />
          </View>
        </Modal>

      </View>
    </>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8DAC0',
    paddingTop: 20,
    alignItems: 'center',
    width: '100%'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 40,
    width: '80%'
  },
  input: {
    flex: 1,
    color: '#5A90BF',
    padding: 10
  },
  iconeLupa: {
    width: 24,
    height: 24
  },
  containerCard: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 40,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitulo: {
    fontSize: 20,
    color: '#112A6C',
  },
  cardDivisor: {
    width: '100%',
    height: 1,
    backgroundColor: '#112A6C',
    marginVertical: 8
  },
  cardDescricao: {
    fontSize: 16,
    color: '#112A6C'
  },
  footerCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  footerButton: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  footerText: {
    color: '#112A6C'
  },
  footerDate: {
    color: '#112A6C'
  }
});
