import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";

const BASE_URL = "http://localhost:3000/";

const createConteudo = async (car) => {
    try{
      const res = await fetch(`${BASE_URL}api/conteudos`, {
        method: "POST",
        headers: AUTH_HEADER,
        body: JSON.stringify(conteudo)
      });
  
      if(!res.ok) throw new Error(await res.text());
  
      const data = await res.json();
      console.log("Data: ", data);
      return true;
    }catch(error){
      console.error("Erro ao realizar requisição POST: ", error);
      return false;
    }
  }
  
const updateCar = async (id, car) => {
    try{
      const res = await fetch(`${BASE_URL}api/conteudo/${id}`, {
        method: "PUT",
        headers: AUTH_HEADER,
        body: JSON.stringify(conteudo)
      });
      
      if(!res.ok) throw new Error(await res.text());
  
      return true;
    }catch(error){
      console.error("Erro ao realizar requisição PUT: ", error);
      return false;
    }
}

const deleteCar = async (id) => {
    try{
      const res = await fetch(`${BASE_URL}api/conteudo/${id}`,{
        method: "DELETE",
        headers: AUTH_HEADER
      });
  
      if(!res.ok) throw new Error(await res.text());
  
      return true;
    }catch(error){
      console.error("Erro ao realizar requisição DELETE: ", error);
      return false;
    }
  }
  
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
    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [texto, setTexto] = useState("")
    const [data, setData] = useState("")

    useEffect(()=>{
        getConteudos();
      }, []);
    
    const getConteudos = async () => {
        try{
          setAtualizando(true);
          console.log("Iniciando a conexão com a API...");
          const response = await fetch(`${BASE_URL}api/conteudo`, {
            method: "GET",
          });
          console.log("Conteudo de Response: ", response);
          
          const json = await response.json();
          console.log("Conteudo do JSON: ", json);
          setConteudos(json);
          setAtualizando(false);
        }catch(error){
          console.error("Erro ao realizar requisição GET: ", error);
        }
    }

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
            <FlatList
                data={conteudos}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <Card dado={item} />}

                ListEmptyComponent={<Text>Não foram postados conteúdos.</Text>}
            />

            {
                atualizando ? (<ActivityIndicator />) : (
                <FlatList
                    data={conteudos}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <View> <Card dado={item}/>
                        {/*<Button title='Editar' onPress={() => preparaUpdate(item.id, item.marca, item.modelo)} />
                            <Button title='Remover' onPress={() => handleDelete(item.id)} />*/}              
                        </View>
                    )}
                    ListEmptyComponent={<Text>Não foram postados conteúdos.</Text>}
                />
                )
            }
        </View>
    </>
  )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#E8DAC0'
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
        margin: 'auto',
        marginBottom: 40,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 10,
        boxShadow: '5px 5px rgba(0, 0, 0, 0.2)'
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