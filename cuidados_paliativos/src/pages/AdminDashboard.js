// Protótipo da página de administrador c/ logout
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.subtitle}>Bem-vindo, Administrador!</Text>
      
      {/* Área para o seu colega desenvolver */}
      <View style={styles.content}>
        <Text style={styles.info}>Desenvolva suas funcionalidades aqui</Text>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    color: '#FDEDD3',
    fontSize: 16
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