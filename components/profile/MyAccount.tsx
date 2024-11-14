import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyAccount: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwtToken');
        if (storedToken) {
          setToken(storedToken);
          const response = await axios.get('https://agroinsight-backend-production.up.railway.app/user/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`, // Fixed syntax for Bearer token
            },
          });

          if (response.status === 200) {
            setNombre(response.data.nombre);
            setApellido(response.data.apellido);
            setEmail(response.data.email);
          } else {
            Alert.alert('Error', 'No se pudieron obtener los datos del usuario.');
          }
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Error al obtener los datos del usuario.');
        navigation.navigate('Login');
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    if (!token) return;
  
    try {
      const response = await axios.put(
        'https://agroinsight-backend-production.up.railway.app/user/me/update',
        { nombre, apellido, email },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed syntax for Bearer token
          },
        }
      );
  
      if (response.status === 200) {
        Alert.alert('Éxito', 'Información actualizada correctamente.');
  
        // Navega de regreso a HomeAdmin con los datos actualizados
        navigation.navigate('HomeAdmin', { token });
      } else {
        Alert.alert('Error', 'No se pudieron guardar los cambios.');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Error al guardar los cambios.');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Mi Cuenta</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyAccount;
