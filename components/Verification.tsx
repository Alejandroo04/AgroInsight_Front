import React, { useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  Verification: { email: string };
  Home: undefined;
};

const Verification: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Verification'>>();
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false); // Estado para diferenciar éxito/error

  const email = route.params.email;

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== '' && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      if (value === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleClear = () => {
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = async () => {
    const submittedCode = code.join('');
    setLoading(true);
  
    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/login/verify', {
        email: email,
        pin: submittedCode,
      });
  
      if (response.status === 200) {
        const { access_token } = response.data;
        await AsyncStorage.setItem('jwtToken', access_token);
        
        setAlertMessage('Verificación exitosa.');
        setAlertSuccess(true); // Éxito
        setAlertVisible(true);
  
        // Cerrar el modal y redirigir a HomeAdmin después de un breve retraso
        setTimeout(() => {
          setAlertVisible(false); // Cerrar el modal
          navigation.navigate('HomeAdmin');
        }, 2000); // Ajusta el tiempo según sea necesario
      } else {
        setAlertMessage('Código incorrecto.');
        setAlertSuccess(false); // Error
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage('Hubo un error al verificar el código.');
      setAlertSuccess(false); // Error
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };
  

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post('https://agroinsight-backend-production.up.railway.app/user/resend-2fa-pin', {
        email: email,
      });
      setAlertMessage('Código reenviado con éxito.');
      setAlertSuccess(true); // Éxito
      setAlertVisible(true);
    } catch (error) {
      setAlertMessage('Hubo un error al reenviar el código.');
      setAlertSuccess(false); // Error
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={!loading}>
        <View style={styles.headerContainer}>
          <Header />
        </View>

        <View style={styles.verificationContainer}>
          <Text style={styles.title}>Verificación en dos pasos</Text>
          <Text style={styles.description}>
            Por favor ingresa el código de 4 dígitos que hemos enviado a tu dirección de correo electrónico registrada.
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.codeInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleInputChange(index, value)}
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={styles.resendLink}>Reenviar código</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear} disabled={loading}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Todos los derechos reservados. AgroInsight© 2024. v0.1.0
        </Text>

        {/* Modal de error y éxito */}
        <Modal
          transparent={true}
          visible={alertVisible}
          animationType="fade"
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, alertSuccess ? styles.successModal : styles.errorModal]}>
              <Icon name={alertSuccess ? 'check-circle' : 'alert-circle'} size={40} color="#fff" />
              <Text style={styles.alertText}>{alertMessage}</Text>

              {/* Mostrar el botón de cerrar para ambos casos (éxito y error) */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAlertVisible(false)} // Cerrar el modal al presionar
              >
                <Text style={[styles.closeButtonText, { color: alertSuccess ? '#4CAF50' : '#ff0000' }]}>
                  Cerrar
                </Text>
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
    textAlign: 'center',
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
    shadowColor: '#000',
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
    shadowColor: '#000',
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
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    width: 300,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#4CAF50',
  },
  errorModal: {
    backgroundColor: '#ff0000',
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Verification;
