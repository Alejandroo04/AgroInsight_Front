import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import axios from 'axios';

const TaskForUsers: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { task: initialTask, farmId, token } = route.params as { task: any, farmId: number, token: string };
  const [task, setTask] = useState(initialTask);

  const setTasksStatus = async (task_id: number, state_id: number) => {
    try {
      await axios.put(
        `https://agroinsight-backend-production.up.railway.app/tasks/${task_id}/states/${state_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTask((prevTask) => ({ ...prevTask, estado_id: state_id }));
      Alert.alert("Éxito", `La tarea ha sido ${state_id === 3 ? 'finalizada' : 'puesta en progreso'}.`);
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert("Error", "No se pudo actualizar el estado de la tarea.");
    }
  };

  const navigateToIA = () => {
    navigation.navigate('Evidences', {
      farmId,
      taskId: task.id,
      token,
      tipo_labor_id: task.tipo_labor_id,
    });
  };

  const handleTaskStatusChange = () => {
    if (task.estado_id === 1) {
      setTasksStatus(task.id, 2); // Cambia de "Pendiente" a "En progreso"
    } else if (task.estado_id === 2) {
      if (task.tipo_labor_id === 16 || task.tipo_labor_id === 37) {
        navigateToIA(); // Navegar a Evidences para tipos de tareas específicos
      } else {
        setTasksStatus(task.id, 3); // Marcar como completado para otros tipos de tarea
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topRow}>
        <Text style={styles.title}>Detalle de la Tarea</Text>
      </View>
      
      <View style={styles.taskContainer}>
        <Text style={styles.title}>{task.nombre}</Text>

        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.label}>
              Estado: {task.estado_id === 1 ? 'Pendiente' : task.estado_id === 2 ? 'En progreso' : 'Completado'}
            </Text>
            <Text style={styles.label}>
              Tipo de labor: {task.tipo_labor_nombre || 'Desconocido'}
            </Text>
          </View>
        </View>

        <Text style={styles.descriptionTitle}>Descripción:</Text>
        <Text style={styles.descriptionItem}>{task.descripcion || 'No hay descripción disponible.'}</Text>

        {task.estado_id !== 3 && (
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleTaskStatusChange}
          >
            <Text style={styles.startButtonText}>
              {task.estado_id === 1 ? 'Iniciar labor' : 
               (task.estado_id === 2 && (task.tipo_labor_id === 16 || task.tipo_labor_id === 37)) ? 'Registrar Evidencias' : 
               'Finalizar labor'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  taskContainer: {
    margin: 20,
    padding: 20,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  startButton: {
    alignItems: 'center',  
    justifyContent: 'center',
    backgroundColor: '#009707',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#A0522D',
  },
  descriptionItem: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
  topRow: {
    padding: 10,
    alignItems: 'center',
  },
});

export default TaskForUsers;
