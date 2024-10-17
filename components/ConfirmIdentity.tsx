import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import Header from './Header';
import axios from 'axios';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  ConfirmIdentity: { email: string };
};

const ConfirmIdentity: React.FC = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Estado para diferenciar entre éxito y error
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const route = useRoute<RouteProp<RootStackParamList, 'ConfirmIdentity'>>();
  const { email } = route.params;

  const navigation = useNavigation();

  const handleInputChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== '' && index < 3) {
        inputRefs[index + 1].current?.focus();
      }

      if (value === '' && index > 0) {
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handleClear = () => {
    setCode(['', '', '', '']);
    inputRefs[0].current?.focus();
  };

  const handleSubmit = async () => {
    const submittedCode = code.join('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/confirm', {
        email: email,
        pin: submittedCode,
      });

      if (response.status === 200) {
        setIsSuccess(true); // Marcar como éxito
        setAlertMessage('Usuario confirmado con éxito.');
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
          navigation.navigate('Login');
        }, 3000); 
      } else {
        setIsSuccess(false); // Marcar como error
        setAlertMessage('Error al confirmar usuario.');
        setAlertVisible(true);
      }
    } catch (error) {
      setIsSuccess(false); // Marcar como error
      setAlertMessage('Hubo un error al confirmar tu identidad.');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('https://agroinsight-backend-production.up.railway.app/user/resend-confirm-pin', {
        email: email,
      });
      setIsSuccess(true); // Marcar como éxito
      setAlertMessage('Código reenviado con éxito.');
    } catch (error) {
      setIsSuccess(false); // Marcar como error
      setAlertMessage('Error al reenviar el código.');
    }
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header />
        <View style={styles.verificationContainer}>
          <Text style={styles.title}>Confirma tu identidad</Text>
          <Text style={styles.subtitle}>Verificación en dos pasos</Text>
          <Text style={styles.description}>
            Para verificar que el correo electrónico que ingresaste te pertenece, por favor ingresa el código que ha sido enviado.
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                ref={inputRefs[index]}
                onChangeText={(value) => handleInputChange(index, value)}
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Reenviar código</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Todos los derechos reservados. AgroInsight© 2024. v0.1.0
        </Text>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={alertVisible}
          onRequestClose={closeAlert}
        >
          <View style={styles.centeredView}>
            <View style={isSuccess ? styles.successModalView : styles.errorModalView}>
              <Icon name={isSuccess ? "check-circle" : "close-circle"} size={40} color="#fff" style={styles.icon} />
              <Text style={styles.alertText}>{alertMessage}</Text>
              <TouchableOpacity style={styles.errorButton} onPress={closeAlert}>
                <Text style={styles.errorButtonText}>Aceptar</Text>
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
  subtitle: {
    fontSize: 17,
    marginTop: 50,
    marginBottom: 5,
    color: 'gray',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'justify',
    marginBottom: 50,
    marginTop: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    width: '22%',
    height: 65,
    backgroundColor: '#f5f5f5',
  },
  resendContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 20,
  },
  resendLink: {
    color: '#2d922b',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  clearButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 25,
    width: '48%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2d922b',
    padding: 15,
    borderRadius: 25,
    width: '48%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  errorModalView: {
    margin: 20,
    backgroundColor: '#d32f2f', // Rojo para el modal de error
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successModalView: {
    margin: 20,
    backgroundColor: '#2d922b', // Verde para el modal de éxito
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  alertText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  errorButtonText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
});

export default ConfirmIdentity;
