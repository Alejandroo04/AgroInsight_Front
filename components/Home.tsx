import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Home: React.FC = () => {
  const [userData, setUserData] = useState<{ nombre: string; apellido: string; rol: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken'); // Obtener el token desde AsyncStorage
        
        if (token) {
          // Hacer la petición al endpoint con el token
          const response = await axios.get('https://agroinsight-backend-production.up.railway.app/user/me', {
            headers: {
              Authorization: `Bearer ${token}`, // Incluir el prefijo Bearer en el token
            },
          });
    
          if (response.status === 200) {
            setUserData({
              nombre: response.data.nombre,
              apellido: response.data.apellido,
              rol: response.data.rol,
            });
          } else {
            setError('No se pudieron obtener los datos del usuario.');
          }
        } else {
          // Si no se encuentra un token, redirigir al login
          navigation.navigate('LoginScreen');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al obtener los datos del usuario.');
        navigation.navigate('LoginScreen');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken'); // Eliminar el token de AsyncStorage
      navigation.navigate('LoginScreen'); // Redirigir al usuario al Login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : userData ? (
        <>
          <Text style={styles.welcomeText}>Bienvenido, {userData.nombre} {userData.apellido}</Text>
          <Text style={styles.roleText}>Rol: {userData.rol}</Text>
        </>
      ) : (
        <Text>Cargando datos del usuario...</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleText: {
    fontSize: 18,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Home;
