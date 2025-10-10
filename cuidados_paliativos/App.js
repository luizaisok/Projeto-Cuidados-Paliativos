// React Native
import { StyleSheet, View } from 'react-native';
import Login from './src/pages/Login';
import SinalVermelho from './src/pages/SinalVermelho';

// Components

export default function App() {
  return (
    <View style={Estilo.container}>
        <SinalVermelho />
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1
  },
});