import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from './Header';

const AssociateWorkers: React.FC = () => {
  const route = useRoute();
  const { token, farmId } = route.params as { token: string; farmId: number };

  const [email, setEmail] = useState('');
  const [emailsList, setEmailsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado para los modales
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error

  // Añadir un correo a la lista de correos
  const handleAddEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor, introduce un correo electrónico válido.');
      setModalErrorVisible(true); // Mostrar modal de error
      return;
    }
  
    if (email && !emailsList.includes(email)) {
      setEmailsList([...emailsList, email]);
      setEmail(''); // Limpiar el campo
    } else {
      setErrorMessage('El correo ya está añadido o es inválido.');
      setModalErrorVisible(true); // Mostrar modal de error
    }
  };

  // Eliminar un correo de la lista
  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailsList(emailsList.filter(e => e !== emailToRemove));
  };

  // Asociar los trabajadores
  const handleAssociateWorkers = async () => {
    if (emailsList.length === 0) {
      setErrorMessage('Debes añadir al menos un correo.');
      setModalErrorVisible(true); // Mostrar modal de error
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://agroinsight-backend-production.up.railway.app/farm/assign-users-by-email',
        {
          farm_id: farmId,
          user_emails: emailsList,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setModalSuccessVisible(true); // Mostrar modal de éxito
        setEmailsList([]); // Limpiar la lista después de asociar
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.detail || [];
        let errorMsg = 'Errores de validación:\n';
        validationErrors.forEach((err: any) => {
          errorMsg += `\n- ${err.msg} en ${err.loc.join(' > ')}`;
        });
        Alert.alert('Error', errorMsg);
      } else {
        setModalErrorVisible(true); // Mostrar modal de error
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar los modales
  const closeModal = () => {
    setModalSuccessVisible(false);
    setModalErrorVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <Text style={styles.pageTitle}>Asociar trabajadores</Text>
        <Text style={styles.label}>* Correo electrónico</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email de tu trabajador"
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddEmail}>
            <Icon name="add-circle" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Mostrar los correos añadidos */}
        {emailsList.length > 0 && (
          <View style={styles.tagContainer}>
            {emailsList.map((email, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{email}</Text>
                <TouchableOpacity onPress={() => handleRemoveEmail(email)}>
                  <Icon name="close-circle" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.associateButton} onPress={handleAssociateWorkers} disabled={loading}>
          <Text style={styles.associateButtonText}>
            {loading ? 'Asociando...' : 'Asociar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      

      {/* Modal de éxito */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSuccessVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.successModalView}>
            <Text style={styles.successText}>¡Asociación exitosa!</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de error */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalErrorVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.errorModalView}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginLeft: 8,
    borderRadius: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    marginRight: 8,
  },
  associateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009707',
    paddingVertical: 18,
    paddingHorizontal: 100,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  associateButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  hamburgerButton: {
    position: 'absolute',
    bottom: 20,
    left: '45%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerLine: {
    width: 30,
    height: 5,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  errorModalView: {
    width: '80%',
    backgroundColor: '#D32F2F',
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
  successModalView: {
    width: '80%',
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  modalButton: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
});

export default AssociateWorkers;
