import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import Header from './Header';

const AssignTask: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isPlotDropdownVisible, setPlotDropdownVisible] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState('');
  const [selectedTaskTypeId, setSelectedTaskTypeId] = useState<number | null>(null);
  const [selectedPlot, setSelectedPlot] = useState('');
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  const [plots, setPlots] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false); // Modal de éxito
  const [errorModalVisible, setErrorModalVisible] = useState(false); // Modal de error
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error
  const navigation = useNavigation();
  const route = useRoute();

  const { token, farmId, workerId, nombre, apellido, email, estado } = route.params as {
    token: string;
    farmId: number;
    workerId: number;
    nombre: string;
    apellido: string;
    email: string;
    estado: string;
  };

  const taskTypes = ['Detección', 'Riego', 'Siembra', 'Control de maleza'];
  const taskTypeIds: Record<string, number> = {
    Detección: 16,
    Riego: 4,
    Siembra: 2,
    'Control de maleza': 6,
  };
  
  const maxDescriptionLength = 200;

  const fetchPlots = async () => {
    try {
      const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farm/${farmId}/plot/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlots(response.data.plots);
    } catch (err) {
      console.error('Error fetching plots:', err);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, [token, farmId]);

  const handleSelectTaskType = (type: string) => {
    setSelectedTaskType(type);
    setSelectedTaskTypeId(taskTypeIds[type] || null);
    setDropdownVisible(false);
  };

  const handleSelectPlot = (plotName: string, plotId: number) => {
    setSelectedPlot(plotName);
    setSelectedPlotId(plotId);
    setPlotDropdownVisible(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const handleAssignTask = async () => {
    if (!selectedTaskTypeId || !selectedPlotId) {
      console.error('Tipo de labor o lote no seleccionado');
      return;
    }
  
    const formattedStartDate = startDate.toISOString().split('T')[0];
  
    try {
      const createTaskResponse = await axios.post(
        'https://agroinsight-backend-production.up.railway.app/task/create',
        {
          nombre: name,
          tipo_labor_id: selectedTaskTypeId,
          fecha_inicio_estimada: formattedStartDate,
          description,
          estado_id: 1,
          lote_id: selectedPlotId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const { task_id } = createTaskResponse.data;
  
      const assignTaskResponse = await axios.post(
        'https://agroinsight-backend-production.up.railway.app/assignment/create',
        {
          usuario_ids: [workerId],
          tarea_labor_cultural_id: task_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setSuccessModalVisible(true); // Mostrar modal de éxito
  
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Error al asignar tarea');
      } else {
        setErrorMessage('Error de red o servidor');
      }
      setErrorModalVisible(true); // Mostrar modal de error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.topRow}>
        <Text style={styles.title}>Asignar labor</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
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

        <Text style={styles.label}>* Lote</Text>
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setPlotDropdownVisible(!isPlotDropdownVisible)}
          >
            <Text style={styles.dropdownText}>
              {selectedPlot || 'Seleccione un lote'}
            </Text>
            <Icon name="chevron-down" size={24} color="#333" />
          </TouchableOpacity>

          {isPlotDropdownVisible && (
            <View style={styles.dropdownContent}>
              {plots.map((plot) => (
                <TouchableOpacity
                  key={plot.id}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectPlot(plot.nombre, plot.id)}
                >
                  <Text style={styles.dropdownItemText}>{plot.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

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

      {/* Modal de éxito */}
      <Modal visible={successModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¡Tarea asignada con éxito!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate('DetailsWorks', {token,  nombre, apellido, email, estado} );
              }}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de error */}
      <Modal visible={errorModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Error: {errorMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AssignTask;
