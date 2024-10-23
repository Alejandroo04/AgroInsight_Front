import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import CustomDrawerContent from './CustomDrawerContent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeAdmin: React.FC = () => {
  const [userData, setUserData] = useState<{ nombre: string; apellido: string; rol: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwtToken');
        if (storedToken) {
          setToken(storedToken); // Set the token in state
          const response = await axios.get('https://agroinsight-backend-production.up.railway.app/user/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
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
          navigation.navigate('Login'); // Navigate to Login if no token is found
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al obtener los datos del usuario.');
        navigation.navigate('Login');
      }
    };

    fetchUserData();
  }, [token]);

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
                <Text style={styles.userRole}>Administrador de finca</Text>
              </View>
            </View>

            {/* Primer card */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                if (token) {
                  navigation.navigate('ViewFarms', { token });
                }
              }}
            >
              <Image
                source={require('../assets/farm-icon.png')}
                style={styles.image}
              />
              <View style={styles.cardText}>
                <Text style={styles.title}>Gestiona ahora tus fincas</Text>
                <Text style={styles.description}>En este módulo podrás gestionar tus fincas, acceder a tus lotes y cultivos.</Text>
              </View>
            </TouchableOpacity>

            {/* Segundo card con el texto de la imagen */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                if (token) {
                  navigation.navigate('MyTask', { token });
                }
              }}
            >
              <Image
                source={require('../assets/farm-icon.png')}  // Usa aquí tu icono correspondiente
                style={styles.image}
              />
              <View style={styles.cardText}>
                <Text style={styles.title}>Labores asignadas</Text>
                <Text style={styles.description}>En este módulo podrás ver las labores que te han sido asignadas y ejecutarlas.</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Cargando datos del usuario...</Text>
        )}
      </View>
      <View style={styles.menuButtonContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      </View>

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
    marginBottom: 20, // Ajuste del margen inferior
    height: 150, // Altura fija para que ambas cards tengan el mismo tamaño
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
  menuButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerLine: {
    width: 30,
    height: 4,
    backgroundColor: '#fff',
    marginVertical: 3,
    borderRadius: 2,
  },
});

export default HomeAdmin;
