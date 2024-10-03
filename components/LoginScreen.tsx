import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa los íconos

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false); // Para manejar el modal de éxito
  const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito

  const navigation = useNavigation();
  const route = useRoute();

  // Limpiar campos si resetFields está en los parámetros de navegación
  useEffect(() => {
    if (route.params?.resetFields) {
      setEmail('');
      setPassword('');
    }
  }, [route.params]);

  // Validación de correo electrónico
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, llena todos los campos.');
      setModalVisible(true);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      setModalVisible(true);
      return;
    }

    try {
      // Hacer la solicitud POST con Axios
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/login', {
        email: email,
        password: password,
      });

      // Verificar la respuesta de la API
      if (response.status === 200) {
        setSuccessMessage('Inicio de sesión exitoso.');
        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessModalVisible(false);
          navigation.navigate('Verification', { email: email });
        }, 3000); // Ocultar el modal y navegar después de 3 segundos
      } else {
        setErrorMessage('Email o contraseña incorrectos.');
        setModalVisible(true);
      }
    } catch (error: any) {
      // Verificar si el error tiene una respuesta del servidor
      if (error.response) {
        setErrorMessage(`Error: ${error.response.data.message || 'Error en el servidor'}`);
      } else if (error.request) {
        setErrorMessage('No se recibió respuesta del servidor.');
      } else {
        setErrorMessage('Error en la solicitud.');
      }
      setModalVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <Image 
            source={require('../assets/agro.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Iniciar sesión</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { fontWeight: 'bold' }]}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { fontWeight: 'bold' }]}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('PasswordRecovery')}>
            <Text style={styles.forgotPassword}>¿Olvidaste tu clave o bloqueaste tu usuario?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.register}>¿No tienes una cuenta? Crea una cuenta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Todos los derechos reservados. AgroInsight® 2024. v0.1.0
          </Text>
        </View>

        {/* Modal de error */}
        <Modal
          animationType="slide"
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
              <Icon name="checkmark-circle-outline" size={60} color="white" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 440,
    height: 410,
    marginBottom: 10,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  title: {
    fontSize: 25,
    color: '#4CAF50',
    marginTop: 10,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  eyeIconContainer: {
    padding: 10,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009707',
    paddingVertical: 18,
    paddingHorizontal: 120,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  register: {
    color: '#009707',
    textAlign: 'right',
    marginTop: 20,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f1f1f1',
  },
  footerText: {
    color: 'gray',
    fontSize: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorModalView: {
    width: '80%',
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  successModalView: {
    width: '80%',
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;
