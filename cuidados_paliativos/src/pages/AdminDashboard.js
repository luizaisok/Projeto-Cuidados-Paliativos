 // Protótipo da página de administrador c/ logout
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const irParaConteudos = () => {
    navigation.navigate('GerenciarConteudos');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.subtitle}>Bem-vindo, Administrador!</Text>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={irParaConteudos}
        >
          <Text style={styles.menuButtonText}>Gerenciar Conteúdos</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#112A6C',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    color: '#FDEDD3',
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    color: '#FDEDD3',
    marginBottom: 40
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuButton: {
    backgroundColor: '#015184',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuButtonText: {
    color: '#FDEDD3',
    fontSize: 18,
    fontWeight: 'bold'
  },
  logoutButton: {
    backgroundColor: '#015184',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  },
  logoutText: {
    color: '#FDEDD3',
    fontSize: 16,
    fontWeight: 'bold'
  }
});