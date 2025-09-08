// React Native
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';

// Fonts
import { useFonts, Comfortaa_400Regular } from '@expo-google-fonts/comfortaa';

// Data
import { PACIENTE } from '../data/paciente';

export default function PerfilProntuario() {
    const [fontsLoaded] = useFonts({
        Comfortaa_400Regular,
    });

    function Campo({ label, valor }) {
        return (
            <View style={{ marginBottom: 15 }}>
                <Text style={Estilo.label}>{label}:</Text>
                <Text style={Estilo.textValue}>{valor}</Text>
            </View>
        );
    }

    const dataNascimentoFormatada = new Date(PACIENTE.dataNascimento).toLocaleDateString('pt-BR');

    return (
        <ScrollView style={Estilo.container}>
        <Header/>
            <ScrollView contentContainerStyle={Estilo.dados} nestedScrollEnabled={true}>
                <Text style={Estilo.nome}>{PACIENTE.nome}</Text>
                <Campo label="Email" valor={PACIENTE.email} />
                <Campo label="Data de Nascimento" valor={dataNascimentoFormatada} />
                <Campo label="Estado" valor={PACIENTE.estado} />
                <Campo label="Cidade" valor={PACIENTE.cidade} />
                <Campo label="Gênero" valor={PACIENTE.genero} />
                <Campo label="Tipo Sanguíneo" valor={PACIENTE.tipoSanguineo} />

                <TouchableOpacity style={Estilo.button}>
                    <Text style={Estilo.buttonText}>Editar informações</Text>
                </TouchableOpacity>

                <Text style={Estilo.tituloSecao}>Condições Médicas:</Text> {/* FlatList dava BO */}
                {PACIENTE.condicoesMedicas.map((item) => (
                    <View style={Estilo.itemContainer} key={item}>
                        <Text style={Estilo.textValue}>{item}</Text>
                        <TouchableOpacity onPress={() => console.log(`Excluir: ${item}`)}>
                            <Text style={Estilo.excluir}>x</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={Estilo.button}>
                    <Text style={Estilo.buttonText}>Adicionar condição</Text>
                </TouchableOpacity>
            
                <Text style={Estilo.tituloSecao}>Medicações:</Text> {/* FlatList dava BO */}
                {PACIENTE.medicacoes.map((item) => (
                    <View style={Estilo.itemContainer} key={item.nome}>
                        <Text style={Estilo.textValue}>
                            {item.nome} – {item.dosagem}
                        </Text>
                        <TouchableOpacity onPress={() => console.log(`Excluir: ${item.nome}`)}>
                            <Text style={Estilo.excluir}>x</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={Estilo.button}>
                    <Text style={Estilo.buttonText}>Adicionar medicamento</Text>
                </TouchableOpacity>
            </ScrollView>
            <Footer/>
        </ScrollView>
    );
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF3E5"
    },
    dados: {
        padding: 30,
    },
    nome: {
        fontSize: 36,
        color: '#183102',
        marginBottom: 20
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        fontFamily: 'Comfortaa_400Regular'
    },
    textValue: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: "rgba(255, 255, 255, .5)",
        borderRadius: 5,
        fontFamily: 'Comfortaa_400Regular',
        lineHeight: 22,
        flex: 1,              // 🔹 ocupa só o espaço disponível
        marginRight: 8,
        flexWrap: 'wrap'
    },
    tituloSecao: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
        fontFamily: 'Comfortaa_400Regular'
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
        backgroundColor: "rgba(255, 255, 255, .5)",
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 5,
        minHeight: 36 // Os itens dentro estavam sendo cortados
    },
    excluir: {
        color: '#900',
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        lineHeight: 22,
        textAlignVertical: 'top'
    },
    // Button
    button: {
        backgroundColor: 'rgba(24, 49, 2, .5)',
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 8,
        width: '60%',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16
    }
});
