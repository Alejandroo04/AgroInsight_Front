import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa los íconos

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  // Limpiar campos si `resetFields` está en los parámetros de navegación
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
        // Redirigir al componente Verification si el login es exitoso
        navigation.navigate('Verification', { email: email });
      } else {
        // Mostrar mensaje de error en caso de respuesta no exitosa
        setErrorMessage('Email o contraseña incorrectos.');
        setModalVisible(true);
      }
    } catch (error) {
      // Manejo de errores en caso de fallo de la solicitud
      setErrorMessage('Hubo un error al intentar iniciar sesión.');
      setModalVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

        <TouchableOpacity onPress={() => setForgotPasswordModalVisible(true)}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu clave o bloqueaste tu usuario?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.register}>¿No tienes una cuenta? Crea una cuenta</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Todos los derechos reservados. AgroInsight® 2024. v0.1.0
          </Text>
        </View>

        {/* Modal de recuperación de contraseña */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={forgotPasswordModalVisible}
          onRequestClose={() => {
            setForgotPasswordModalVisible(!forgotPasswordModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Restablece tu contraseña</Text>
              </View>
              <View style={styles.modalTextContainer}>
                <Text style={styles.modalText}>
                  Si has olvidado tu contraseña o bloqueado el usuario puedes enviar un correo realizando la solicitud o comunicarte a nuestros canales de atención.
                </Text>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setForgotPasswordModalVisible(!forgotPasswordModalVisible)}
              >
                <Text style={styles.textStyle}>Restablecer contraseña</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Modal de error */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Error</Text>
              </View>
              <View style={styles.modalTextContainer}>
                <Text style={styles.modalText}>{errorMessage}</Text>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
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
    width: '100%',
    height: 40,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  eyeIconContainer: {
    paddingHorizontal: 10,
  },
  forgotPassword: {
    color: '#009707',
    textAlign: 'right',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  register: {
    color: '#009707',
    textAlign: 'right',
    marginTop: 20,
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
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitleContainer: {
    width: '100%',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 25,
    color: '#4CAF50',
    width: '100%',
    textAlign: 'center',
  },
  modalTextContainer: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'justify',
    color: 'gray',
  },
  button: {
    borderRadius: 80,
    padding: 20,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#4CAF50',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default LoginScreen;
