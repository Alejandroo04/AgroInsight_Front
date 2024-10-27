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
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './Header';

const { width } = Dimensions.get('window');

const CreateFarms: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('Hectáreas (ha)');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
    area?: string;
    latitude?: string;
    longitude?: string;
  }>({});
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params as { token: string };

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

  const handleCreateFarm = async () => {
    const newErrors: {
      name?: string;
      location?: string;
      area?: string;
      latitude?: string;
      longitude?: string;
    } = {};

    if (!name) newErrors.name = 'Este campo es requerido';
    if (!location) newErrors.location = 'Este campo es requerido';
    if (!area) newErrors.area = 'Este campo es requerido';

    const latLongErrors = validateLatLong();
    setErrors({ ...newErrors, ...latLongErrors });

    if (Object.keys(newErrors).length === 0 && Object.keys(latLongErrors).length === 0) {
      const unitValue = unit === 'Hectáreas (ha)' ? 9 : unit === 'Metros cuadrados (m²)' ? 7 : 8;

      try {
        const response = await axios.post(
          'https://agroinsight-backend-production.up.railway.app/farm/create',
          {
            nombre: name,
            ubicacion: location,
            area_total: area,
            unidad_area_id: unitValue,
            latitud: latitude,
            longitud: longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setModalMessage('Finca creada exitosamente');
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('ViewFarms', { token });
        }, 2000);

      } catch (error) {
        console.error('Error creando finca:', error);
        setModalMessage('Error al crear la finca');
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
        }, 2000);
      }
    }
  };

  const handleAreaChange = (text: string) => {
    const regex = /^\d*\.?\d*$/;

    if (regex.test(text)) {
      setArea(text);
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
  

  const handleSelectUnitType = (type: string) => {
    setUnit(type);
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header/>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Crea tu finca</Text>

        {/* Campo Nombre */}
        <Text style={styles.label}>* Nombre</Text>
        <TextInput
          style={[styles.input, !!errors.name && styles.errorInput]}
          placeholder="Ingresa el nombre de la finca"
          value={name}
          onChangeText={setName}
          maxLength={50}  
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Campo Ubicación */}
        <Text style={styles.label}>* Ubicación</Text>
        <TextInput
          style={[styles.input, !!errors.location && styles.errorInput]}
          placeholder="Ingresa la ubicación"
          value={location}
          onChangeText={setLocation}
          maxLength={100} 
        />
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

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

        {/* Campo Unidad */}
        <Text style={styles.label}>* Unidad de area</Text>
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
        <Text style={styles.label}>Latitud </Text>
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
        <Text style={styles.label}>Longitud</Text>
        <TextInput
          style={[styles.input, !!errors.longitude && styles.errorInput]}
          placeholder="Ingresa la longitud (Entre -180 y 180)"
          value={longitude}
          keyboardType="numeric"
          maxLength={15}
          onChangeText={handleLongitudeChange}
        />
        {errors.longitude && <Text style={styles.errorText}>{errors.longitude}</Text>}

        {/* Botón para crear finca */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateFarm}>
          <Text style={styles.createButtonText}>Crear finca</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para mostrar mensajes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />  */}
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
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CreateFarms;
