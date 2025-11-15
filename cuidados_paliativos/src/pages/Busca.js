import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import Header from "../components/Header";

const BASE_URL = "http://192.168.0.31:3000/";
const AUTH_HEADER = {
  "Content-Type": "application/json",
};

const createConteudo = async (conteudo) => {
  try {
    const res = await fetch(`${BASE_URL}api/conteudos`, {
      method: "POST",
      headers: AUTH_HEADER,
      body: JSON.stringify(conteudo),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    console.log("Conteúdo criado: ", data);
    return true;
  } catch (error) {
    console.error("Erro ao realizar requisição POST: ", error);
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
    console.error("Erro ao realizar requisição PUT: ", error);
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
    console.error("Erro ao realizar requisição DELETE: ", error);
    return false;
  }
};

  
const Card = ({dado}) => (
    <View style={Estilo.containerCard}>
        <Text style={Estilo.cardTitulo}>{dado?.titulo}</Text>
        <View style={Estilo.cardDivisor}></View>
        <Text style={Estilo.cardDescricao}>{dado?.descricao}</Text>
        <View style={Estilo.footerCard}>
            <TouchableOpacity style={Estilo.footerButton}>
                <Text style={Estilo.footerText}>Ler mais</Text>
                <Image source={require('../assets/img/seta.png')} style={{width: 16, height: 16}}/>
            </TouchableOpacity>
            <Text style={Estilo.footerDate}>{dado?.data}</Text>
        </View>
    </View>
)

export default function Busca() {
    const [conteudos, setConteudos] = useState([])
    const [atualizando, setAtualizando] = useState(false)

    useEffect(()=>{
        getConteudos();
      }, []);
    
    const getConteudos = async () => {
      try {
        setAtualizando(true);
        console.log("Iniciando a conexão com a API...");
        const response = await fetch(`${BASE_URL}api/conteudos`);
        
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const json = await response.json();
        console.log("Conteúdos recebidos: ", json);
        setConteudos(json.conteudos);
      } catch (error) {
        console.error("Erro ao realizar requisição GET: ", error);
      } finally {
        setAtualizando(false);
      }
    };


  return (
    <>
        <Header/>
        <View style={Estilo.container}>
            <View style={Estilo.inputContainer}>
                <TextInput
                    placeholder="Procurar por tema"
                    style={Estilo.input}
                />
                <TouchableOpacity onPress={() => console.log('Pesquisar...')}>
                    <Image
                    source={require('../assets/img/lupa.png')}
                    style={Estilo.iconeLupa}
                    />
                </TouchableOpacity>
            </View>
            {atualizando ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={conteudos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Card dado={item} />}
                ListEmptyComponent={<Text>Não foram postados conteúdos.</Text>}
              />
            )}
        </View>
    </>
  )
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
})