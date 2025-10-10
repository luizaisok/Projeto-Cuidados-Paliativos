// React Native
import { StyleSheet, View } from 'react-native';
import Login from './src/pages/Login';

// Components

export default function App() {
  return (
    <View style={Estilo.container}>
        <Login/>
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1
  },
});