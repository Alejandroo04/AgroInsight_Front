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
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CreateFarms: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('Hectáreas (ha)');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
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

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Crea tu finca</Text>

        {/* Campo Nombre */}
        <Text style={styles.label}>* Nombre</Text>
        <TextInput
          style={[styles.input, !!errors.name && styles.errorInput]}
          placeholder="Ingresa el nombre de la finca"
          value={name}
          onChangeText={setName}
          maxLength={50}  // Limitar a 50 caracteres
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Campo Ubicación */}
        <Text style={styles.label}>* Ubicación</Text>
        <TextInput
          style={[styles.input, !!errors.location && styles.errorInput]}
          placeholder="Ingresa la ubicación"
          value={location}
          onChangeText={setLocation}
          maxLength={100}  // Limitar a 100 caracteres
        />
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

        {/* Campo Área */}
        <Text style={styles.label}>* Área</Text>
        <View style={styles.areaRow}>
          <TextInput
            style={[styles.input, styles.areaInput, !!errors.area && styles.errorInput]}
            placeholder="Ingresa el área"
            value={area}
            keyboardType="numeric"  // Solo números
            onChangeText={setArea}
            maxLength={10}  // Limitar a 10 caracteres
          />
          <TouchableOpacity style={styles.pickerWrapper} onPress={() => setPickerVisible(!pickerVisible)}>
            <Text style={styles.pickerText}>{unit}</Text>
          </TouchableOpacity>
        </View>
        {pickerVisible && (
          <View style={styles.pickerOverlay}>
            <Picker
              selectedValue={unit}
              onValueChange={(itemValue) => {
                setUnit(itemValue);
                setPickerVisible(false);
              }}
            >
              <Picker.Item label="Hectáreas (ha)" value="Hectáreas (ha)" />
              <Picker.Item label="Metros cuadrados (m²)" value="Metros cuadrados (m²)" />
              <Picker.Item label="Kilómetros cuadrados (km²)" value="Kilómetros cuadrados (km²)" />
            </Picker>
          </View>
        )}
        {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}

        {/* Campo Latitud */}
        <Text style={styles.label}>Latitud </Text>
        <TextInput
          style={[styles.input, !!errors.latitude && styles.errorInput]}
          placeholder="Ingresa la latitud (Entre -90 y 90)"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
          maxLength={15}  // Limitar a 15 caracteres
        />
        {errors.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}

        {/* Campo Longitud */}
        <Text style={styles.label}>Longitud</Text>
        <TextInput
          style={[styles.input, !!errors.longitude && styles.errorInput]}
          placeholder="Ingresa la longitud (Entre -180 y 180)"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
          maxLength={15}  // Limitar a 15 caracteres
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
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" /> 
            <Text>{modalMessage}</Text>
          </View>
        </View>
      </Modal>

      {/* Botón de menú hamburguesa en el footer */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={handleOpenMenu}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>

      <CustomDrawerContent isVisible={isDrawerVisible} onClose={handleCloseMenu} />
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
    paddingHorizontal: width * 0.05, // 5% del ancho de la pantalla
    paddingTop: 20,
  },
  title: {
    fontSize: width * 0.07, // Ajusta el tamaño de fuente según el ancho
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: width * 0.045, // Ajusta el tamaño de fuente según el ancho
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1, // Línea inferior en lugar de borde completo
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: width * 0.045, // Ajusta el tamaño de fuente según el ancho
    marginBottom: 15,
  },
  errorInput: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: width * 0.04, // Ajusta el tamaño de fuente según el ancho
  },
  areaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaInput: {
    flex: 1,
    marginRight: 10, // Espacio entre el campo de entrada y el Picker
  },
  pickerWrapper: {
    flex: 1,
    borderBottomWidth: 1, // Añadir línea inferior
    borderColor: '#ccc',
    paddingBottom: 5,
  },
  pickerText: {
    fontSize: width * 0.045, // Ajusta el tamaño de fuente según el ancho
    color: '#000', // Color del texto
  },
  pickerOverlay: {
    position: 'absolute',
    top: 100, // Ajusta la posición para que se despliegue justo debajo
    left: 20,
    right: 20,
    zIndex: 1, // Se sobrepone sobre los otros elementos
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009707',
    paddingVertical: 18,
    paddingHorizontal: width * 0.2, // Ancho adaptado
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  createButtonText: {
    color: '#fff',
    fontSize: width * 0.045, // Ajusta el tamaño de fuente según el ancho
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
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

export default CreateFarms;
