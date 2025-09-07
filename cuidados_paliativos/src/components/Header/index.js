import { View, StyleSheet, Text } from 'react-native';

export default function Header() {
  return (
    <View style={Estilo.container}>
      <Text style={Estilo.logo}>Acolvita</Text>
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    width: '100%',
    height: '10%',
    backgroundColor: '#767714',
    justifyContent: 'center'
  },
  logo: {
    color: '#FFF',
    marginLeft: '10%',
    fontSize: 24,
    fontWeight: 'bold'
  }
});