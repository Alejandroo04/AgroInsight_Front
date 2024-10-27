import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './Header';

const { width } = Dimensions.get('window');

const CreatePlot: React.FC = () => {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('Hectáreas (ha)');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    area?: string;
    latitude?: string;
    longitude?: string;
  }>({});
  const route = useRoute();
  const navigation = useNavigation();
  const { token, farmId } = route.params as { token: string; farmId: string };

  const unitTypes = ['Hectáreas (ha)', 'Metros cuadrados (m²)', 'Kilómetros cuadrados (km²)'];

  const validateLatLong = () => {
    const newErrors: { latitude?: string; longitude?: string } = {};

    if (latitude && (parseFloat(latitude) < -90 || parseFloat(latitude) > 90)) {
      newErrors.latitude = 'La latitud debe estar entre -90 y 90';
    }

    if (longitude && (parseFloat(longitude) < -180 || parseFloat(longitude) > 180)) {
      newErrors.longitude = 'La longitud debe estar entre -180 y 180';
    }

    return newErrors;
  };

  const handleCreatePlot = async () => {
    const newErrors: { name?: string; area?: string } = {};

    if (!name) newErrors.name = 'Este campo es requerido';
    if (!area) newErrors.area = 'Este campo es requerido';

    const latLongErrors = validateLatLong();
    setErrors({ ...newErrors, ...latLongErrors });

    if (Object.keys(newErrors).length === 0 && Object.keys(latLongErrors).length === 0) {
      const unitValue = unit === 'Hectáreas (ha)' ? 9 : unit === 'Metros cuadrados (m²)' ? 7 : 8;

      try {
        const response = await axios.post(
          'https://agroinsight-backend-production.up.railway.app/plot/create',
          {
            nombre: name,
            area: area,
            unidad_area_id: unitValue,
            latitud: latitude,
            longitud: longitude,
            finca_id: farmId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setModalMessage('Lote creado exitosamente');
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('DetailsFarms', { token, farmId });
        }, 2000);
      } catch (error) {
        console.error('Error creando lote:', error);
        setModalMessage('Error al crear el lote');
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
        }, 2000);
      }
    }
  };
  
  const handleLatitudeChange = (text: string) => {
    const regex = /^-?\d*\.?\d*$/; // Permite números negativos y decimales
  
    if (regex.test(text)) {
      setLatitude(text);
    }
  };
  
  const handleLongitudeChange = (text: string) => {
    const regex = /^-?\d*\.?\d*$/; // Permite números negativos y decimales
  
    if (regex.test(text)) {
      setLongitude(text);
    }
  };

  const handleAreaChange = (text: string) => {
    const regex = /^\d*\.?\d*$/;

    if (regex.test(text)) {
      setArea(text);
    }
  };

  const handleSelectUnitType = (type: string) => {
    setUnit(type);
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Crea tu lote</Text>

        {/* Campo Nombre */}
        <Text style={styles.label}>* Nombre</Text>
        <TextInput
          style={[styles.input, !!errors.name && styles.errorInput]}
          placeholder="Ingresa el nombre del lote"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Campo Área */}
        <Text style={styles.label}>* Área</Text>
        <TextInput
          style={[styles.input, !!errors.area && styles.errorInput]}
          placeholder="Ingresa el área"
          value={area}
          keyboardType="numeric"
          onChangeText={handleAreaChange}
          maxLength={10}
        />
        {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}

        {/* Selector de Unidad */}
        <Text style={styles.label}>* Unidad de área</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.dropdownText}>{unit || 'Seleccione la unidad'}</Text>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdownContent}>
            {unitTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleSelectUnitType(type)}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Campo Latitud */}
        <Text style={styles.label}>* Latitud</Text>
        <TextInput
          style={[styles.input, !!errors.latitude && styles.errorInput]}
          placeholder="Ingresa la latitud (Entre -90 y 90)"
          value={latitude}
          keyboardType="numeric"
          maxLength={15}
          onChangeText={handleLatitudeChange}
        />
        {errors.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}

        {/* Campo Longitud */}
        <Text style={styles.label}>* Longitud</Text>
        <TextInput
          style={[styles.input, !!errors.longitude && styles.errorInput]}
          placeholder="Ingresa la longitud (Entre -180 y 180)"
          value={longitude}
          keyboardType="numeric"
          maxLength={15}
          onChangeText={handleLongitudeChange}
        />
        {errors.longitude && <Text style={styles.errorText}>{errors.longitude}</Text>}

        {/* Botón para crear lote */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreatePlot}>
          <Text style={styles.createButtonText}>Crear lote</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para mostrar mensajes */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Ionicons name="checkmark-circle" size={50} color="#4CAF50" /> */}
            <Text>{modalMessage}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: 20,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  dropdownButton: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContent: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
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
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    paddingHorizontal: 40,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CreatePlot;
