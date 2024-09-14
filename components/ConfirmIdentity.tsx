import React, { useState } from 'react'; 
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import Header from './Header';
import axios from 'axios';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native'; 

type RootStackParamList = {
  ConfirmIdentity: { email: string };
};

const ConfirmIdentity: React.FC = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const route = useRoute<RouteProp<RootStackParamList, 'ConfirmIdentity'>>();
  const { email } = route.params;

  const navigation = useNavigation(); // Hook de navegación

  const handleInputChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  };

  const handleClear = () => {
    setCode(['', '', '', '']);
  };

  const handleSubmit = async () => {
    const submittedCode = code.join('');

    try {
      const response = await axios.post('https://agroinsight-backend-production.up.railway.app/user/confirm', {
        email: email,
        pin: submittedCode,
      });

      if (response.status === 200) {
        setAlertMessage('Usuario confirmado con éxito.');
        setAlertVisible(true);
        // Redirigir al login después de un corto retraso para permitir que el usuario vea el mensaje
        setTimeout(() => {
          navigation.navigate('Login'); // Asegúrate de que 'Login' sea el nombre correcto de tu pantalla de login
        }, 1000);
      } else {
        setAlertMessage('Error al confirmar usuario.');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage('Hubo un error al confirmar tu identidad.');
      setAlertVisible(true);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('https://agroinsight-backend-production.up.railway.app/user/resend-pin', {
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
        <View style={styles.headerContainer}>
          <Header />
        </View>

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

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Todos los derechos reservados. AgroInsight© 2024. v0.1.0
        </Text>

        {/* Alerta personalizada dentro del mismo componente */}
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
    backgroundColor: '#fff', // Fondo blanco para el modal
    alignItems: 'center',
    borderColor: '#4CAF50', // Borde verde
    borderWidth: 1,
  },
  alertText: {
    color: '#333', // Texto en color gris oscuro
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // Color verde para el botón
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Texto en blanco
    fontSize: 16,
  },
});

export default ConfirmIdentity;
