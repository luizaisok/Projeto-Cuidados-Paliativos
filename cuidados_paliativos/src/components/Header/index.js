import { View, StyleSheet, Text } from 'react-native';

export default function Header() {
  return (
    <View style={Estilo.container}>
      <Text style={Estilo.logo}>PaliVida</Text>
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    width: '100%',
    height: '12%',
    backgroundColor: '#112A6C',
    justifyContent: 'center'
  },
  logo: {
    color: '#FFF',
    marginLeft: '10%',
    fontSize: 24,
    fontWeight: 'bold',
  }
});