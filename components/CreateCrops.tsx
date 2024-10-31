import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './Header';

const { width } = Dimensions.get('window');

const CreateCrops: React.FC = () => {
  const [maizeVariety, setMaizeVariety] = useState('');
  const [maizeVarieties, setMaizeVarieties] = useState([]);
  const [isMaizeVarietyDropdownVisible, setIsMaizeVarietyDropdownVisible] = useState(false);

  const [densityValue, setDensityValue] = useState('');
  const [densityType, setDensityType] = useState(26); // ID por defecto para "Plantas por hectárea"
  const [isDensityDropdownVisible, setIsDensityDropdownVisible] = useState(false);
  const densityOptions = [
    { label: 'Plantas por hectárea', id: 26 },
    { label: 'Semillas por hectárea', id: 27 },
    { label: 'Semillas por metro cuadrado', id: 28 },
  ];

  const [cropStatus, setCropStatus] = useState(1); // ID por defecto para "Programado"
  const [isCropStatusDropdownVisible, setIsCropStatusDropdownVisible] = useState(false);
  const cropStatusOptions = [
    { label: 'Programado', id: 1 },
    { label: 'Sembrado', id: 2 },
    { label: 'Germinando', id: 3 },
    { label: 'Creciendo', id: 4 },
    { label: 'Floración', id: 5 },
    { label: 'Maduración', id: 6 },
    { label: 'Cosechado', id: 7 },
    { label: 'Enfermo', id: 8 },
    { label: 'Muerto', id: 9 },
    { label: 'Dormante', id: 10 },
  ];

  const [sowingDate, setSowingDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { plotId, token } = route.params as { plotId: number; token: string };

  useEffect(() => {
    const fetchMaizeVarieties = async () => {
      try {
        const response = await axios.get('https://agroinsight-backend-production.up.railway.app/corn-varieties', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaizeVarieties(response.data.varieties || []);
      } catch (error) {
        console.error('Error fetching maize varieties:', error);
      }
    };
    fetchMaizeVarieties();
  }, [token]);

  const handleSelectMaizeVariety = (varietyId) => {
    setMaizeVariety(varietyId);
    setIsMaizeVarietyDropdownVisible(false);
  };

  const handleSelectDensityType = (optionId) => {
    setDensityType(optionId);
    setIsDensityDropdownVisible(false);
  };

  const handleSelectCropStatus = (statusId) => {
    setCropStatus(statusId);
    setIsCropStatusDropdownVisible(false);
  };

  
const handleCreateCrop = async () => {
  try {
    // Formatear la fecha de siembra a "YYYY-MM-DD"
    const formattedSowingDate = `${sowingDate.getFullYear()}-${String(sowingDate.getMonth() + 1).padStart(2, '0')}-${String(sowingDate.getDate()).padStart(2, '0')}`;

    const response = await axios.post(
      'https://agroinsight-backend-production.up.railway.app/crops',
      {
        lote_id: plotId,
        variedad_maiz_id: maizeVariety,
        fecha_siembra: formattedSowingDate,
        densidad_siembra: densityValue,
        densidad_siembra_unidad_id: densityType,
        estado_id: cropStatus,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 201) {
      setModalMessage('Cultivo creado exitosamente');
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 2000);
    }
  } catch (error) {
    console.error('Error creando cultivo:', error);

    if (error.response && error.response.data && error.response.data.message) {
      // Muestra exactamente el mensaje que devuelve el backend
      setModalMessage(`Error: ${error.response.data.message}`);
    } else {
      setModalMessage('Error de red o problema de conexión');
    }

    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  }
};

  

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Crear Cultivo</Text>

        <Text style={styles.label}>* Variedad del Maíz</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsMaizeVarietyDropdownVisible(!isMaizeVarietyDropdownVisible)}
        >
          <Text style={styles.dropdownText}>
            {maizeVarieties.find((variety) => variety.id === maizeVariety)?.nombre || 'Seleccione una variedad'}
          </Text>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
        {isMaizeVarietyDropdownVisible && (
          <View style={styles.dropdownContent}>
            {maizeVarieties.map((variety) => (
              <TouchableOpacity key={variety.id} style={styles.dropdownItem} onPress={() => handleSelectMaizeVariety(variety.id)}>
                <Text style={styles.dropdownItemText}>{variety.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>* Densidad de Siembra</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el valor numérico"
          keyboardType="numeric"
          value={densityValue}
          onChangeText={setDensityValue}
        />

        <Text style={styles.label}>* Unidad de Densidad de Siembra</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDensityDropdownVisible(!isDensityDropdownVisible)}
        >
          <Text style={styles.dropdownText}>{densityOptions.find((option) => option.id === densityType)?.label}</Text>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
        {isDensityDropdownVisible && (
          <View style={styles.dropdownContent}>
            {densityOptions.map((option) => (
              <TouchableOpacity key={option.id} style={styles.dropdownItem} onPress={() => handleSelectDensityType(option.id)}>
                <Text style={styles.dropdownItemText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>* Estado del Cultivo</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsCropStatusDropdownVisible(!isCropStatusDropdownVisible)}
        >
          <Text style={styles.dropdownText}>{cropStatusOptions.find((status) => status.id === cropStatus)?.label}</Text>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
        {isCropStatusDropdownVisible && (
          <View style={styles.dropdownContent}>
            {cropStatusOptions.map((status) => (
              <TouchableOpacity key={status.id} style={styles.dropdownItem} onPress={() => handleSelectCropStatus(status.id)}>
                <Text style={styles.dropdownItemText}>{status.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.createButton} onPress={handleCreateCrop}>
          <Text style={styles.createButtonText}>Crear Cultivo</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{modalMessage}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: { flexGrow: 1, paddingHorizontal: width * 0.05, paddingTop: 20 },
  title: { fontSize: width * 0.07, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  dropdownButton: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownText: { fontSize: 16, color: '#333' },
  dropdownContent: { backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, marginBottom: 10 },
  dropdownItem: { 
    padding: 10,
  },
  dropdownItemText: { 
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CreateCrops;