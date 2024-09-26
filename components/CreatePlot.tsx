import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';
import axios from 'axios';

const CreatePlot: React.FC = () => {
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
  const [errors, setErrors] = useState<{ name?: string; location?: string; area?: string }>({});
  const route = useRoute();
  const navigation = useNavigation();
  const { token, farmId } = route.params as { token: string; farmId: string };

  const handleCreatePlot = async () => {
    const newErrors: { name?: string; location?: string; area?: string } = {};
    if (!name) newErrors.name = 'Este campo es requerido';
    if (!area) newErrors.area = 'Este campo es requerido';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
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
        console.error('Error creando lote:', error.response || error.message);
        setModalMessage('Error al crear el lote');
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

      <View style={styles.formContainer}>
        <Text style={styles.title}>Crea tu lote</Text>

        <Text style={styles.label}>* Nombre</Text>
        <TextInput
          style={[styles.input, !!errors.name && styles.errorInput]}
          placeholder="Ingresa el nombre del lote"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        
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

        <Text style={styles.label}>Latitud</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa la latitud"
          value={latitude}
          onChangeText={setLatitude}
        />

        <Text style={styles.label}>Longitud</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa la longitud"
          value={longitude}
          onChangeText={setLongitude}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreatePlot}>
          <Text style={styles.createButtonText}>Crear lote</Text>
        </TouchableOpacity>
      </View>

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
    borderBottomWidth: 1,
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
    marginRight: 10,
  },
  pickerWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 1,
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
    padding: 10,
    borderRadius: 25,
  },
  hamburgerLine: {
    width: 30,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 3,
  },
});

export default CreatePlot;
