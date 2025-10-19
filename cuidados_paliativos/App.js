// React Native
import { StyleSheet, View } from 'react-native';

import Busca from './src/pages/Busca';

export default function App() {
  return (
    <View style={Estilo.container}>
        <Busca/>
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1
  },
});