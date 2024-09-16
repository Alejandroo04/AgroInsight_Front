import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import Header from './Header';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [matchError, setMatchError] = useState('');

  const navigation = useNavigation();
  const route = useRoute();

  // Asegúrate de que route.params no es undefined
  const email = route.params?.email || '';  // Si no hay email, lo dejamos vacío

  // Validar que la contraseña cumpla con los requisitos
  const validatePassword = (password: string) => {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength) {
      return `Debe tener al menos ${minLength} caracteres.`;
    }
    if (!hasUpperCase) {
      return 'Debe contener al menos una letra mayúscula.';
    }
    if (!hasSpecialChar) {
      return 'Debe contener al menos un carácter especial.';
    }
    if (!hasNumber) {
      return 'Debe contener al menos un número.';
    }
    return '';
  };

  const handleSubmit = async () => {
    setPasswordError('');
    setMatchError('');

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      return;
    }

    if (password !== confirmPassword) {
      setMatchError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/reset-password', {
        email,
        new_password: password,
      });

      if (response.status === 200) {
        setAlertMessage('Contraseña restablecida correctamente.');
        setAlertVisible(true);
        navigation.navigate('Login'); // Navegar a la pantalla de login después de un corto retraso
      } else {
        setAlertMessage('Error al restablecer la contraseña.');
        setAlertVisible(true);
      }
    } catch (error) {
      // Captura y muestra el mensaje del backend si está disponible
      const backendMessage = error.response?.data?.message || 'Hubo un error en la solicitud. Por favor, intenta de nuevo.';
      setAlertMessage(backendMessage);
      setAlertVisible(true);
    }
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Header />
        </View>

        <View style={styles.verificationContainer}>
          <Text style={styles.title}>Restablece tu contraseña</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva contraseña</Text>
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
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : <Text style={styles.hintText}>Mínimo 12 caracteres, una mayúscula, un número y un carácter especial.</Text>}

            <Text style={styles.label}>Verifica tu contraseña</Text>
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
            {matchError ? <Text style={styles.errorText}>{matchError}</Text> : null}
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Todos los derechos reservados. AgroInsight© 2024. v0.1.0
        </Text>

        <Modal transparent={true} visible={alertVisible} animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.alertContainer}>
              <Text style={styles.alertText}>{alertMessage}</Text>
              <TouchableOpacity style={styles.button} onPress={closeAlert}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
  },
  headerContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  verificationContainer: {
    flex: 1,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d922b',
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 80,
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  inputUnderline: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#2d922b',
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  alertText: {
    color: '#333',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
  hintText: {
    color: 'gray',
    marginTop: 5,
    fontSize: 14,
  },
});

export default ResetPassword;
