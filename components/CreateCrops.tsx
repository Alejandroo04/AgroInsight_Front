// Código actualizado de CreateCrops
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './Header';

const { width } = Dimensions.get('window');

const CreateCrops: React.FC = () => {
  const [maizeVariety, setMaizeVariety] = useState('');
  const [maizeVarieties, setMaizeVarieties] = useState([]);
  const [isMaizeVarietyDropdownVisible, setIsMaizeVarietyDropdownVisible] = useState(false);
  
  const [densityType, setDensityType] = useState('Plantas por hectárea');
  const [isDensityDropdownVisible, setIsDensityDropdownVisible] = useState(false);
  const densityOptions = ['Plantas por hectárea', 'Semillas por hectárea', 'Semillas por metro cuadrado'];
  
  const [cropStatus, setCropStatus] = useState('Programado');
  const [isCropStatusDropdownVisible, setIsCropStatusDropdownVisible] = useState(false);
  const cropStatusOptions = [
    'Programado', 'Sembrado', 'Germinando', 'Creciendo', 'Floración', 'Maduración',
    'Cosechado', 'Enfermo', 'Muerto', 'Dormante'
  ];

  const [sowingDate, setSowingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { loteId, token } = route.params as { loteId: string; token: string };

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

  const handleSelectMaizeVariety = (variety) => {
    setMaizeVariety(variety);
    setIsMaizeVarietyDropdownVisible(false);
  };

  const handleSelectDensityType = (option) => {
    setDensityType(option);
    setIsDensityDropdownVisible(false);
  };

  const handleSelectCropStatus = (status) => {
    setCropStatus(status);
    setIsCropStatusDropdownVisible(false);
  };

  const handleCreateCrop = async () => {
    try {
      await axios.post(
        'https://agroinsight-backend-production.up.railway.app/crops/create',
        {
          lote_id: loteId,
          variety: maizeVariety,
          sowing_date: sowingDate.toISOString(),
          density_type: densityType,
          status: cropStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModalMessage('Cultivo creado exitosamente');
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error('Error creando cultivo:', error);
      setModalMessage('Error al crear el cultivo');
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
          <Text style={styles.dropdownText}>{maizeVariety || 'Seleccione una variedad'}</Text>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
        {isMaizeVarietyDropdownVisible && (
          <View style={styles.dropdownContent}>
            {maizeVarieties.map((variety, index) => (
              <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelectMaizeVariety(variety.nombre)}>
                <Text style={styles.dropdownItemText}>{variety.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>* Densidad de Siembra</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDensityDropdownVisible(!isDensityDropdownVisible)}
        >
          <Text style={styles.dropdownText}>{densityType}</Text>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
        {isDensityDropdownVisible && (
          <View style={styles.dropdownContent}>
            {densityOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelectDensityType(option)}>
                <Text style={styles.dropdownItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>* Estado del Cultivo</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsCropStatusDropdownVisible(!isCropStatusDropdownVisible)}
        >
          <Text style={styles.dropdownText}>{cropStatus}</Text>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
        {isCropStatusDropdownVisible && (
          <View style={styles.dropdownContent}>
            {cropStatusOptions.map((status, index) => (
              <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelectCropStatus(status)}>
                <Text style={styles.dropdownItemText}>{status}</Text>
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
  dropdownItem: { padding: 10 },
  dropdownItemText: { fontSize: 16, color: '#333' },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 50,
    paddingHorizontal: 40,
  },
  createButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' },
});

export default CreateCrops;
