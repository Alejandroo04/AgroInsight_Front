// RegisterScreen.tsx

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
  const [successModalVisible, setSuccessModalVisible] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const navigation = useNavigation();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const errors = [];
    if (password.length < 12) errors.push('Debe tener al menos 12 caracteres.');
    if (!/[A-Z]/.test(password)) errors.push('Debe tener al menos una letra mayúscula.');
    if (!/\d/.test(password)) errors.push('Debe tener al menos un número.');
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) errors.push('Debe tener al menos un carácter especial.');
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  };

  const removeEmojis = (text: string) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2011-\u26FF]|[\u2900-\u297F])/g,
      ''
    );
  };

  const removeNumbers = (text: string) => {
    return text.replace(/[0-9]/g, '');
  };

  const handleNext = async () => {
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

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      setErrorMessage(passwordValidation.errors.join('\n'));
      setModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setModalVisible(true);
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage('Debes aceptar los términos y condiciones para continuar.');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/register', {
        email,
        nombre,
        apellido,
        password,
        acepta_terminos: acceptedTerms
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
        const apiErrorMessage = error.response.data?.error?.message || 'Error desconocido del servidor';
        setErrorMessage(apiErrorMessage);
      } else {
        setErrorMessage('Hubo un problema al crear el usuario. Inténtalo de nuevo.');
      }
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToTerms = () => {
    navigation.navigate('TermsAndConditions');
  };

  const navigateToVerify = () => {
    navigation.navigate('VerifyAcount');
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
            onChangeText={(text) => setNombre(removeEmojis(removeNumbers(text)))} 
            placeholderTextColor="gray"
            maxLength={30}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={styles.inputUnderline}
            value={apellido}
            onChangeText={(text) => setApellido(removeEmojis(removeNumbers(text)))} 
            placeholderTextColor="gray"
            maxLength={30}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.inputUnderline}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(removeEmojis(text))} 
            placeholderTextColor="gray"
            maxLength={50}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputUnderline}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(removeEmojis(text))} 
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
              onChangeText={(text) => setConfirmPassword(removeEmojis(text))} 
              placeholderTextColor="gray"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)}>
            <Icon name={acceptedTerms ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color="gray" />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            Acepto los <Text style={styles.linkText} onPress={navigateToTerms}>Términos y condiciones</Text>
          </Text>
        </View>

        <Button mode="contained" style={styles.button} onPress={handleNext}>
          Siguiente
        </Button>

        <View style={styles.footer}>
          <TouchableOpacity onPress={navigateToVerify}>
            <Text style={styles.linkTwo}>¿Tu cuenta está pendiente por verificación? {'\n'}
              Confirma tu cuenta aquí</Text>
          </TouchableOpacity>
        </View>

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
            onPressOut={() => setModalVisible(false)}
          >
            <View style={styles.errorModalView}>
              <Icon name="close-circle-outline" size={60} color="white" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          </TouchableOpacity>
        </Modal>

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
              <Icon name="check-circle-outline" size={60} color="green" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          </View>
        </Modal>

        {isLoading && (
          <Modal
            animationType="none"
            transparent={true}
            visible={isLoading}
          >
            <View style={styles.centeredView}>
              <ActivityIndicator size="large" color="#0E6EB8" />
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
    marginTop: 5,
    color: 'green',
  },
  linkTwo: {
    marginTop: 10,
    color: 'green',
    textAlign: 'center',
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 10,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
