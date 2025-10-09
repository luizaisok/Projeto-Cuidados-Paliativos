// React Native
import { StyleSheet, View } from 'react-native';

// Components
import AvisoVerde from './src/pages/AvisoVerde';

export default function App() {
  return (
    <View style={Estilo.container}>
        <AvisoVerde/>
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1
  },
});