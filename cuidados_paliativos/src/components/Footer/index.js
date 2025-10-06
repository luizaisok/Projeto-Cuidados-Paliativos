import { View, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";

const icons = [
  { id: '1', source: require('../../assets/img/Home.png') },
  { id: '2', source: require('../../assets/img/Question.png') },
  { id: '3', source: require('../../assets/img/User.png') },
];

export default function Footer() {
    return (
        <View style={Estilo.footer}>
            <FlatList
                data={icons}
                keyExtractor={(item) => item.id}
                horizontal
                contentContainerStyle={{ justifyContent: 'space-around', flex: 1 }}
                renderItem={({item}) => (
                    <TouchableOpacity>
                        <Image source={item.source} style={{width: 24, height: 24}}/>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const Estilo = StyleSheet.create({
  footer: {
    padding: 16,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});