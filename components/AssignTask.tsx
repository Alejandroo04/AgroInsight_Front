import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Asegúrate de tener este paquete
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const AssignTask: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState('');
  const [name, setName] = useState(''); // Nuevo estado para el nombre
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const taskTypes = ['Detección', 'Riego', 'Siembra', 'Control de maleza'];
  const maxDescriptionLength = 200; // Límite de caracteres

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleAssignTask = () => {
    console.log('Labor asignada');
  };

  const handleSelectTaskType = (type: string) => {
    setSelectedTaskType(type);
    setDropdownVisible(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header reutilizado */}
      <Header />

      {/* Título de la pantalla */}
      <View style={styles.topRow}>
        <Text style={styles.title}>Asignar labor</Text>
      </View>

      {/* Formulario de asignación */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Campo de nombre */}
        <Text style={styles.label}>* Nombre</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ingrese el nombre"
        />

        <Text style={styles.label}>* Tipo de labor</Text>
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(!isDropdownVisible)}
          >
            <Text style={styles.dropdownText}>
              {selectedTaskType || 'Seleccione el tipo de labor'}
            </Text>
            <Icon name="chevron-down" size={24} color="#333" />
          </TouchableOpacity>

          {isDropdownVisible && (
            <View style={styles.dropdownContent}>
              {taskTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectTaskType(type)}
                >
                  <Text style={styles.dropdownItemText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Campo de descripción con límite de caracteres */}
        <Text style={styles.label}>* Descripción de la labor a realizar</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={(text) =>
            text.length <= maxDescriptionLength ? setDescription(text) : null
          }
          multiline
          placeholder="Ingrese la descripción"
        />
        <Text style={styles.charCount}>{description.length}/{maxDescriptionLength} caracteres</Text>

        <Text style={styles.label}>* Fecha inicio estimada</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {startDate.toLocaleDateString('es-ES') || 'Seleccione una fecha'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity style={styles.assignButton} onPress={handleAssignTask}>
          <Text style={styles.assignButtonText}>Asignar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Botón de menú hamburguesa */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={handleOpenMenu}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>

      {/* Menú drawer */}
      <CustomDrawerContent isVisible={isDrawerVisible} onClose={handleCloseMenu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topRow: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
    fontSize: 16,
  },
  dropdown: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContent: {
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#888',
    marginBottom: 20,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
  },
  assignButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009707',
    paddingVertical: 18,
    paddingHorizontal: 120,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 10,
  },
  assignButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
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

export default AssignTask;
