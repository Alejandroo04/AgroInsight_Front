import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import Header from './Header'; // Asegúrate de importar tu componente Header

const Home: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Navegar a LoginScreen y reiniciar los campos de entrada
    navigation.navigate('Login', { resetFields: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <View style={styles.userInfo}>
          <View style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>Alejandro Garcia Pimentel</Text>
            <Text style={styles.userRole}>Superusuario</Text>
          </View>
        </View>
        <Text style={styles.message}>
          Bienvenido Admin
        </Text>
      </View>

      {/* Botón de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    flex: 1, // Permite que el contenido se expanda
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#d3d3d3',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: 'gray',
  },
  message: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    right: 20, // Mueve el botón a la derecha
    backgroundColor: '#FF0000', // Color rojo
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
