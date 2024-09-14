import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
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

  const navigation = useNavigation();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8;
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

    if (!isValidPassword(password)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      setModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setModalVisible(true);
      return;
    }

    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/create', {
        nombre,
        apellido,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        navigation.navigate('ConfirmIdentity', { email });
      }
      
    } catch (error) {
      setErrorMessage('Hubo un problema al crear el usuario. Inténtalo de nuevo.');
      setModalVisible(true);
      if (error instanceof Error) {
        console.error('Error en la creación del usuario:', error.message);
      } else {
        console.error('Error en la creación del usuario:', error);
      }
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
    borderBottomWidth: 1,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 80,
  },
  link: {
    color: 'green',
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

export default RegisterScreen;
