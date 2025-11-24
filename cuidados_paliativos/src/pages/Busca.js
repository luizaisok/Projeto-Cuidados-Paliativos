import React, { useState, useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";

const BASE_URL = "http://localhost:3000/";
const AUTH_HEADER = { "Content-Type": "application/json" };

// Formata a data para Dia/Mês/Ano
const formatarData = (data) => {
  if (!data) return "";
  try {
    const [ano, mes, dia] = data.toString().split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  } catch { return data; }
};

// -=-=-=-=-=-=-=-=-=-=- API

const getConteudos = async () => {
  try {
    const response = await fetch(`${BASE_URL}api/conteudos`);
    const json = await response.json();
    return json.conteudos || [];
  } catch (error) {
    console.log("Erro ao buscar:", error);
    return [];
  }
};

const createConteudo = async (dados) => {
  try {
    const response = await fetch(`${BASE_URL}api/conteudos`, {
      method: "POST",
      headers: AUTH_HEADER,
      body: JSON.stringify(dados),
    });
    return response.ok;
  } catch (error) {
    console.log("Erro ao criar:", error);
    return false;
  }
};

const updateConteudo = async (id, dados) => {
  try {
    const response = await fetch(`${BASE_URL}api/conteudos/${id}`, {
      method: "PUT",
      headers: AUTH_HEADER,
      body: JSON.stringify(dados),
    });
    return response.ok;
  } catch (error) {
    console.log("Erro ao atualizar:", error);
    return false;
  }
};

const deleteConteudo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}api/conteudos/${id}`, {
      method: "DELETE",
      headers: AUTH_HEADER,
    });
    return response.ok;
  } catch (error) {
    console.log("Erro ao deletar:", error);
    return false;
  }
};

const Card = ({ dado, usuario, abrirModal, atualizarLista }) => {
  const navigation = useNavigation();

  const apagar = async () => {
    const id = dado.id || dado._id;
    
    const sucesso = await deleteConteudo(id);
    if (sucesso) {
      atualizarLista(); // Recarrega a lista se deu certo
    } else {
      alert("Erro ao excluir!");
    }
  };

  return (
    <View style={Estilo.containerCard}>
      <Text style={Estilo.cardTitulo}>{dado?.titulo}</Text>
      <View style={Estilo.cardDivisor} />
      <Text style={Estilo.cardDescricao} numberOfLines={3}>{dado?.descricao}</Text>

      <View style={Estilo.footerCard}>
        <TouchableOpacity style={Estilo.footerButton} onPress={() => navigation.navigate("ConteudoDetalhe", { id: dado.id || dado._id })}>
          <Text style={Estilo.footerText}>Ler mais</Text>
          <Image source={require('../assets/img/seta.png')} style={{ width: 16, height: 16 }} />
        </TouchableOpacity>
        
        <Text style={Estilo.footerDate}>{formatarData(dado?.data_post || dado?.data)}</Text>
      </View>

      {usuario.tipo === "administrador" && (
        <View style={Estilo.adminActions}>
          <TouchableOpacity onPress={() => abrirModal(dado)}>
            <Text style={Estilo.textActionEdit}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={apagar}>
            <Text style={Estilo.textActionDelete}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function Busca() {
  const [conteudos, setConteudos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [usuario, setUsuario] = useState({ tipo: null });
  const [modalVisivel, setModalVisivel] = useState(false);
  
  // Estado único para os dados do formulário
  const [form, setForm] = useState({ id: null, titulo: "", descricao: "", SinaisSintomas: "", SinaisAlerta: "" });

  useEffect(() => { carregarTudo(); }, []);

  const carregarTudo = async () => {
    // 1. Identifica o usuário
    const tipo = localStorage?.getItem("userTipo") || await AsyncStorage.getItem("auth_role");
    setUsuario({ tipo });

    // 2. Busca os dados
    const lista = await getConteudos();
    setConteudos(lista);
  };

  const salvar = async () => {
    // 1. Prepara os dados (Backend exige data e texto)
    const dadosParaEnviar = { 
      ...form, 
      texto: form.descricao, 
      data_post: new Date().toISOString().split('T')[0] 
    };
    
    const id = form.id || form._id;
    let sucesso = false;

    // 2. Decide qual função chamar
    if (id) {
      sucesso = await updateConteudo(id, dadosParaEnviar);
    } else {
      sucesso = await createConteudo(dadosParaEnviar);
    }

    // 3. Finaliza
    if (sucesso) {
      setModalVisivel(false);
      carregarTudo();
    } else {
      alert("Erro ao salvar!");
    }
  };

  const abrirModal = (dados = {}) => {
    // Se recebeu dados, preenche o form (Edição). Se não, limpa (Criação).
    if (dados.id || dados._id) {
      setForm(dados);
    } else {
      setForm({ id: null, titulo: "", descricao: "", SinaisSintomas: "", SinaisAlerta: "" });
    }
    setModalVisivel(true);
  };

  // Filtro de busca na memória
  const listaFiltrada = conteudos.filter(item => 
    item.titulo?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <>
      <Header />
      <View style={Estilo.container}>
        <View style={Estilo.inputContainer}>
          <TextInput placeholder="Buscar por tema..." style={Estilo.input} value={pesquisa} onChangeText={setPesquisa} />
          <TouchableOpacity onPress={carregarTudo}>
            <Image source={require('../assets/img/lupa.png')} style={Estilo.iconeLupa} />
          </TouchableOpacity>
        </View>

        {usuario.tipo === "administrador" && (
          <TouchableOpacity onPress={() => abrirModal()} style={Estilo.btnAdd}>
            <Text style={Estilo.btnAddText}>+ Novo Conteúdo</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={listaFiltrada}
          keyExtractor={item => (item.id || item._id).toString()}
          renderItem={({ item }) => (
            <Card dado={item} usuario={usuario} abrirModal={abrirModal} atualizarLista={carregarTudo} />
          )}
        />

        <Modal visible={modalVisivel} animationType="fade" transparent onRequestClose={() => setModalVisivel(false)}>
          <View style={Estilo.modalOverlay}>
            <View style={Estilo.modalContent}>
              <ScrollView>
                <Text style={Estilo.label}>Título</Text>
                <TextInput style={Estilo.modalInput} value={form.titulo} onChangeText={t => setForm({ ...form, titulo: t })} />

                <Text style={Estilo.label}>Descrição</Text>
                <TextInput style={Estilo.modalInput} value={form.descricao} onChangeText={t => setForm({ ...form, descricao: t })} multiline />

                <Text style={Estilo.label}>Sinais e Sintomas</Text>
                <TextInput style={Estilo.modalInput} value={form.SinaisSintomas} onChangeText={t => setForm({ ...form, SinaisSintomas: t })} multiline />

                <Text style={Estilo.label}>Sinais de Alerta</Text>
                <TextInput style={Estilo.modalInput} value={form.SinaisAlerta} onChangeText={t => setForm({ ...form, SinaisAlerta: t })} multiline />
              </ScrollView>
              
              <View style={Estilo.modalButtons}>
                <TouchableOpacity style={[Estilo.btnModal, Estilo.btnCancel]} onPress={() => setModalVisivel(false)}>
                  <Text style={Estilo.btnTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Estilo.btnModal, Estilo.btnSave]} onPress={salvar}>
                  <Text style={Estilo.btnTextSave}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    width: '100%',
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
    height: 50,
    elevation: 2,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#112A6C',
    padding: 10,
    fontSize: 16,
  },
  iconeLupa: {
    width: 22,
    height: 22,
    tintColor: '#112A6C',
  },
  btnAdd: {
    backgroundColor: '#112A6C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  btnAddText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  containerCard: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112A6C',
  },
  cardDivisor: {
    height: 1,
    backgroundColor: '#E8DAC0',
    marginVertical: 10,
  },
  cardDescricao: {
    fontSize: 14,
    color: '#333',
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
  },
  footerButton: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  footerText: {
    color: '#112A6C',
    fontWeight: '600',
    fontSize: 12,
  },
  footerDate: {
    color: '#888',
    fontSize: 12,
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  textActionEdit: {
    color: "#112A6C",
    fontWeight: "bold",
  },
  textActionDelete: {
    color: "#D94141",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    maxHeight: '85%',
  },
  label: {
    color: '#112A6C',
    fontWeight: '600',
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FAFAFA',
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  btnModal: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancel: {
    borderColor: '#D94141',
    borderWidth: 1,
  },
  btnSave: {
    backgroundColor: '#112A6C',
  },
  btnTextCancel: {
    color: '#D94141',
    fontWeight: 'bold',
  },
  btnTextSave: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});