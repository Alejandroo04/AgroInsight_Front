import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import Header from './Header';
import axios from 'axios';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  ConfirmIdentityRecover: { email: string };
};

const ConfirmIdentityRecover: React.FC = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const route = useRoute<RouteProp<RootStackParamList, 'ConfirmIdentityRecover'>>();
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
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/confirm-recovery-pin', {
        email: email,
        pin: submittedCode,
      });

      if (response.status === 200) {
        setAlertMessage('Usuario confirmado con éxito.');
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
          navigation.navigate('ResetPassword', { email });
        }, 3000);
      } else {
        setAlertMessage('Error al confirmar usuario.');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage('Hubo un error al confirmar tu identidad.');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('https://agroinsight-backend-production.up.railway.app/user/resend-recovery-pin', {
        email: email,
      });
      setAlertMessage('Código reenviado con éxito.');
    } catch (error) {
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

        {/* Indicador de carga que cubre toda la pantalla */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        )}

        {/* Modal de error y éxito */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={alertVisible}
          onRequestClose={closeAlert}
        >
          <View style={styles.centeredView}>
            <View style={styles.successModalView}>
              <Icon name="check-circle" size={40} color="#fff" style={styles.successIcon} />
              <Text style={styles.alertText}>{alertMessage}</Text>
              <TouchableOpacity style={styles.successButton} onPress={closeAlert}>
                <Text style={styles.successButtonText}>Aceptar</Text>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalView: {
    width: 300,
    padding: 35,
    alignItems: 'center',
    backgroundColor: '#2d922b',
    borderRadius: 10,
  },
  successIcon: {
    marginBottom: 10,
  },
  alertText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#2d922b',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmIdentityRecover;
