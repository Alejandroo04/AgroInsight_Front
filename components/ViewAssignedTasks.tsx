import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const ViewAssignedTasks: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { token, workerId, farmName, farmId } = route.params as { farmName: string, token: string, userId: string, workerId: number, farmId: number };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`https://agroinsight-backend-production.up.railway.app/farm/${farmId}/user/${workerId}/tasks/list`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('tareas:', data);
        setTasks(data.tasks); // Assuming `data.tasks` is an array of tasks

      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [farmId, workerId, token]);

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  // Navega al componente TaskDetail con los detalles específicos de la tarea
  const handleCropPress = (task) => {
    navigation.navigate('TaskDetail', {
      nombre: task.nombre,
      tipo_labor_id: task.tipo_labor_id,
      fecha_inicio_estimada: task.fecha_inicio_estimada,
      fecha_finalizacion: task.fecha_finalizacion,
      descripcion: task.descripcion,
      estado_id: task.estado_id,
    });
  };

  

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />

      {/* Title */}
      <View style={styles.topRow}>
        <Text style={styles.title}>Finca {farmName}</Text>
      </View>

      {/* Task List */}
      {Array.isArray(tasks) && tasks.length > 0 ? (
        tasks.map((task) => (
          <TouchableOpacity key={task.id} style={styles.taskItem} onPress={() => handleCropPress(task)}>
            <View style={styles.cropContent}>
              <Text style={styles.taskText}>{task.nombre}</Text>
              <Icon name="eye-outline" size={24} color="#4CAF50" style={styles.eyeIcon} />
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay tareas disponibles.</Text>
      )}

      {/* Menu Button */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={handleOpenMenu}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>

      {/* Drawer Menu */}
      <CustomDrawerContent isVisible={isDrawerVisible} onClose={handleCloseMenu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cropContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  topRow: {
    padding: 20,
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
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

export default ViewAssignedTasks;
