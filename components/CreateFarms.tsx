import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importación actualizada
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';
import axios from 'axios';

const CreateFarms: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('Hectáreas (ha)');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal
  const [errors, setErrors] = useState<{ name?: string; location?: string; area?: string }>({});
  const route = useRoute();
  const navigation = useNavigation(); // Hook para navegación
  const { token } = route.params as { token: string };

  const handleCreateFarm = async () => {
    const newErrors: { name?: string; location?: string; area?: string } = {};
    if (!name) newErrors.name = 'Este campo es requerido';
    if (!location) newErrors.location = 'Este campo es requerido';
    if (!area) newErrors.area = 'Este campo es requerido';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Convertir la unidad a su valor numérico
      const unitValue = unit === 'Hectáreas (ha)' ? 9 : unit === 'Metros cuadrados (m²)' ? 7 : 8;

      try {
        const response = await axios.post(
          'https://agroinsight-backend-production.up.railway.app/farm/create',
          {
            nombre: name,
            ubicacion: location,
            area_total: area,
            unidad_area_id: unitValue,  // Aquí se pasa el valor numérico
            latitud: latitude,
            longitud: longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Mostrar modal de éxito
        setModalMessage('Finca creada exitosamente');
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('ViewFarms', { token }); // Aquí está la corrección
        }, 2000);

      } catch (error) {
        console.error('Error creando finca:', error);
        setModalMessage('Error al crear la finca');
        setModalVisible(true);

        // Cerrar modal después de 2 segundos
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

      <View style={styles.formContainer}>
        <Text style={styles.title}>Crea tu finca</Text>

        {/* Campo Nombre */}
        <Text style={styles.label}>* Nombre</Text>
        <TextInput
          style={[styles.input, !!errors.name && styles.errorInput]}
          placeholder="Ingresa el nombre de la finca"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Campo Ubicación */}
        <Text style={styles.label}>* Ubicación</Text>
        <TextInput
          style={[styles.input, !!errors.location && styles.errorInput]}
          placeholder="Ingresa la ubicación"
          value={location}
          onChangeText={setLocation}
        />
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

        {/* Campo Área dividido en dos */}
        <Text style={styles.label}>* Área</Text>
        <View style={styles.areaRow}>
          <TextInput
            style={[styles.input, styles.areaInput, !!errors.area && styles.errorInput]}
            placeholder="Ingresa el área"
            value={area}
            keyboardType="numeric"
            onChangeText={setArea}
          />
          
          <TouchableOpacity style={styles.pickerWrapper} onPress={() => setPickerVisible(!pickerVisible)}>
            <Text style={styles.pickerText}>{unit}</Text>
          </TouchableOpacity>
        </View>

        {/* Picker para seleccionar la unidad */}
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
        <Text style={styles.label}>Latitud (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa la latitud (opcional)"
          value={latitude}
          onChangeText={setLatitude}
        />

        {/* Campo Longitud */}
        <Text style={styles.label}>Longitud (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa la longitud (opcional)"
          value={longitude}
          onChangeText={setLongitude}
        />

        {/* Botón para crear finca */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateFarm}>
          <Text style={styles.createButtonText}>Crear finca</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para mostrar mensajes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1, // Línea inferior en lugar de borde completo
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  errorInput: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
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
    fontSize: 16,
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
    paddingHorizontal: 120,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
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
