import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import Header from './Header';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';  // Asegúrate de que esté importado Icon para los íconos

const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/password-recovery', {
        email: email,
      });

      if (response.status === 200) {
        setSuccessVisible(true);
        setTimeout(() => {
          setSuccessVisible(false);
          navigation.navigate('ConfirmIdentityRecover', { email });
        }, 3000); // Espera 3 segundos antes de navegar
      }
    } catch (error: any) {
      console.log('Respuesta completa del servidor:', error.response);
      if (error.response) {
        if (error.response.data && error.response.data.error && error.response.data.error.message) {
          setAlertMessage(error.response.data.error.message);
        } else {
          setAlertMessage('Error en el servidor.');
        }
      } else if (error.request) {
        setAlertMessage('No se recibió respuesta del servidor.');
      } else {
        setAlertMessage('Error en la solicitud.');
      }
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
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
              editable={!isLoading}
            />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit} disabled={isLoading}>
              <Text style={styles.nextButtonText}>{isLoading ? 'Cargando...' : 'Siguiente'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Todos los derechos reservados. AgroInsight© 2024. v0.1.0
        </Text>

        {/* Modal de error */}
        <Modal transparent={true} visible={alertVisible} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.errorModalView}>
              <Icon name="close-circle-outline" size={60} color="white" />
              <Text style={styles.errorText}>{alertMessage}</Text>
              <TouchableOpacity style={styles.button} onPress={closeAlert}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de éxito */}
        <Modal transparent={true} visible={successVisible} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.successModalView}>
              <Icon name="checkmark-circle-outline" size={60} color="white" />
              <Text style={styles.successText}>Correo enviado con éxito</Text>
            </View>
          </View>
        </Modal>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        )}
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
  successModalView: {
    width: '80%',
    backgroundColor: 'green',
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
  successText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'WHITE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default PasswordRecovery;
