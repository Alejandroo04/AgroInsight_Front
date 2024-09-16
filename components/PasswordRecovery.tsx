import React, { useState } from 'react'; 
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import Header from './Header';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const navigation = useNavigation();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setAlertMessage('Por favor, introduce un correo electrónico válido.');
      setAlertVisible(true);
      return;
    }

    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/password-recovery', {
        email: email,
      });

      if (response.status === 200) {
        // Navegar a la pantalla ConfirmIdentity y pasar el correo electrónico
        navigation.navigate('ConfirmIdentityRecover', { email });
      } else {
        setAlertMessage('Error al solicitar el restablecimiento de contraseña.');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage('Hubo un error en la solicitud. Por favor, intenta de nuevo.');
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
          <Text style={styles.description}>
            Por favor ingresa la dirección de correo electrónico registrada para continuar con el restablecimiento de la contraseña.
          </Text>

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

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Siguiente</Text>
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
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'justify',
    marginBottom: 50,
    marginTop: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  inputUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 20,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#2d922b',
    paddingVertical: 12,
    paddingHorizontal: 25,
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
});

export default PasswordRecovery;
