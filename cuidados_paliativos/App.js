// import { useFonts, Comfortaa_400Regular } from '@expo-google-fonts/comfortaa';

// React Native
import { StyleSheet, View } from 'react-native';

// Components
import Header from './src/components/Header';

export default function App() {
  /* const [fontsLoaded] = useFonts({ Comfortaa_400Regular }); 
  if (!fontsLoaded) {
    return (
      <View style={Estilo.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }*/

  return (
    <View style={Estilo.container}>
        <Header/>
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Ignorar comentários acima, ainda estou descobrindo como posso deixar mais fácil aplicar a fonte -Luiza