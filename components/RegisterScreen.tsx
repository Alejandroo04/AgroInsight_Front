import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Header from './Header';

const RegisterScreen: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false); // Para manejar el modal de éxito
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga

  const navigation = useNavigation();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 12;
  };

  const handleNext = async () => {
    // Validaciones previas...
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      setErrorMessage('Por favor, llena todos los campos.');
      setModalVisible(true);
      return;
    }
  
    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      setModalVisible(true);
      return;
    }
  
    if (!isValidPassword(password)) {
      setErrorMessage('La contraseña debe tener al menos 12 caracteres.');
      setModalVisible(true);
      return;
    }
  
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setModalVisible(true);
      return;
    }
  
    // Iniciar la carga
    setIsLoading(true);
  
    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/register', {
        email,
        nombre,
        apellido,
        password,
      });
  
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Usuario creado con éxito.');
        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessModalVisible(false);
          navigation.navigate('ConfirmIdentity', { email });
        }, 3000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extraer el mensaje de error específico de la API
        const apiErrorMessage = error.response.data?.error?.message || 'Error desconocido del servidor';
        setErrorMessage(apiErrorMessage);
      } else {
        setErrorMessage('Hubo un problema al crear el usuario. Inténtalo de nuevo.');
      }
      setModalVisible(true);
      console.error('Error en la creación del usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header />

        <Text style={styles.title}>Crear cuenta</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombres</Text>
          <TextInput
            style={styles.inputUnderline}
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={styles.inputUnderline}
            value={apellido}
            onChangeText={setApellido}
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.inputUnderline}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputUnderline}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="gray"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordConditions}>
            Mínimo 12 caracteres, una mayúscula, un número y un carácter especial.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Verificar contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputUnderline}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="gray"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <Button mode="contained" style={styles.button} onPress={handleNext}>
          Siguiente
        </Button>

        <View style={styles.footer}>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.link}>¿Tienes una cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Todos los derechos reservados. AgroInsight® 2024. v0.1.0
          </Text>
        </View>

        {/* Modal de error */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)} // Cierra el modal al presionar fuera de él
          >
            <View style={styles.errorModalView}>
              <Icon name="close-circle-outline" size={60} color="white" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal de éxito */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => {
            setSuccessModalVisible(!successModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.successModalView}>
              <Icon name="check-circle-outline" size={60} color="white" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          </View>
        </Modal>

        {/* Indicador de carga */}
        {isLoading && (
          <Modal
            transparent={true}
            visible={isLoading}
            animationType="none"
          >
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          </Modal>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'green',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  inputUnderline: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'gray',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },
  passwordConditions: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    marginTop: 40,
    color: 'green',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  errorModalView: {
    width: '80%',
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    marginTop: 15,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  successModalView: {
    width: '80%',
    backgroundColor: 'green',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successText: {
    marginTop: 15,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
});

export default RegisterScreen;
