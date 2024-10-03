import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Importa useRoute
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from './Header';

const AssociateWorkers: React.FC = () => {
  const route = useRoute();
  const { token, farmId } = route.params as { token: string; farmId: number }; // Obtén token y farmId

  const [email, setEmail] = useState('');
  const [emailsList, setEmailsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Añadir un correo a la lista de correos
  const handleAddEmail = () => {
    if (email && !emailsList.includes(email)) {
      setEmailsList([...emailsList, email]);
      setEmail(''); // Limpiar el campo
    } else {
      Alert.alert('Error', 'El correo ya está añadido o es inválido.');
    }
  };

  // Eliminar un correo de la lista
  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailsList(emailsList.filter(e => e !== emailToRemove));
  };

  // Asociar los trabajadores
  const handleAssociateWorkers = async () => {
    if (emailsList.length === 0) {
      Alert.alert('Error', 'Debes añadir al menos un correo.');
      return;
    }

    console.log("Token utilizado:", token); // Verificar el token
    console.log("Farm ID utilizado:", farmId); // Verificar el farmId

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
        Alert.alert('Éxito', response.data.message || 'Los trabajadores han sido asociados correctamente.');
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
        Alert.alert('Error', `Hubo un problema al asociar los trabajadores: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
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

      <TouchableOpacity style={styles.hamburgerButton}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>
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
    borderRadius: 5,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginLeft: 8,
    borderRadius: 5,
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
});

export default AssociateWorkers;
