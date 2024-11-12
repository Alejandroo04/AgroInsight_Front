import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLocked, setIsScreenLocked] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.resetFields) {
      setEmail('');
      setPassword('');
    }
  }, [route.params]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

    setIsLoading(true);

    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        setSuccessMessage('Inicio de sesión exitoso.');
        setSuccessModalVisible(true);
        setIsScreenLocked(true);
        setTimeout(() => {
          setSuccessModalVisible(false);
          setIsScreenLocked(false);
          navigation.navigate('Verification', { email: email });
        }, 3000);
      }
    } catch (error: any) {
      console.log('Respuesta completa del servidor:', error.response);
      if (error.response) {
        if (error.response.data && error.response.data.error && error.response.data.error.message) {
          setErrorMessage(error.response.data.error.message);
        } else {
          setErrorMessage('Error en el servidor.');
        }
      } else if (error.request) {
        setErrorMessage('No se recibió respuesta del servidor.');
      } else {
        setErrorMessage('Error en la solicitud.');
      }
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => { if (isScreenLocked) return; }}>
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
                placeholder="Ejemplo@correo.com"
                placeholderTextColor="gray"
                maxLength={50}
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
                  placeholder="Tu contraseña"
                  placeholderTextColor="gray"
                  maxLength={50}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                  <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="gray" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('PasswordRecovery')}>
              <Text style={styles.forgotPassword}>¿Olvidaste tu clave o bloqueaste tu usuario?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.register}>¿No tienes una cuenta? Crea una cuenta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Todos los derechos reservados. AgroInsight® 2024. v3.2.0
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
              onPressOut={() => setModalVisible(false)}
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

          {/* Modal de carga que cubre toda la pantalla */}
          {isLoading && (
            <Modal transparent={true} animationType="none">
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            </Modal>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%', // Cambia a porcentajes para responsividad
    height: undefined,
    aspectRatio: 1, // Mantiene la relación de aspecto
    marginBottom: 10,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    padding: 20,
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
  },
  loginButton: {
    alignItems: 'center',  
    justifyContent: 'center',
    backgroundColor: '#009707',
    paddingVertical: 18,
    paddingHorizontal: 40, // Ajuste en el tamaño del botón
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
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
});

export default LoginScreen;

   
