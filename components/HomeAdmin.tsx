import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import CustomDrawerContent from './CustomDrawerContent'; // Importa el CustomDrawerContent desde tu archivo

const HomeAdmin: React.FC = () => {
  const [userData, setUserData] = useState<{ nombre: string; apellido: string; rol: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          const response = await axios.get('https://agroinsight-backend-production.up.railway.app/user/me', {
            headers: {
              Authorization: `Bearer ${token}`,
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
          navigation.navigate('Login');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al obtener los datos del usuario.');
        navigation.navigate('Login');
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : userData ? (
          <>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <View style={styles.userInfo}>
              <View style={styles.avatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{userData.nombre} {userData.apellido}</Text>
                <Text style={styles.userRole}>{userData.rol}</Text>
              </View>
            </View>
            
            {/* Contenedor con la imagen de la finca y el texto alineado */}
            <View style={styles.card}>
              <Image
                source={require('../assets/farm-icon.png')}
                style={styles.image}
              />
              <View style={styles.cardText}>
                <Text style={styles.title}>Gestiona ahora tus fincas</Text>
                <Text style={styles.description}>En este módulo podrás gestionar tus fincas, acceder a tus lotes y cultivos.</Text>
              </View>
            </View>
          </>
        ) : (
          <Text>Cargando datos del usuario...</Text>
        )}
      </View>

      {/* Renderiza el CustomDrawerContent aquí */}
      <CustomDrawerContent isVisible={isDrawerVisible} onClose={() => setDrawerVisible(false)} />
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
    flex: 1,
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
  card: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  cardText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default HomeAdmin;
