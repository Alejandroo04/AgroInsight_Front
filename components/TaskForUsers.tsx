import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import axios from 'axios';

const TaskForUsers: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { farmId, userId, token, page } = route.params as { token: string, farmId: number, userId: number, page: number }; 

  const [taskData, setTaskData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farms/${farmId}/worker/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page, 
          },
        });
        setTaskData(response.data.tasks);
        console.log(response.data.tasks);
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    fetchTaskData();
  }, [farmId, userId, token, page]);

  const setTasksStatus = async (task_id, state_id) => {
    try {
      const response = await axios.put(
        `https://agroinsight-backend-production.up.railway.app/tasks/${task_id}/states/${state_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh tasks data after state change
      setTaskData(prevTasks => prevTasks.map(task => task.id === task_id ? { ...task, estado_id: state_id } : task));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const navigateToIA = (task) => {
    navigation.navigate('Evidences', {
      farmId,
      userId,
      token,
      taskId: task.id,
    });
  };

  const handleTaskStatusChange = (task) => {
    if (task.estado_id === 1) {
      // Change from "Pendiente" to "En progreso"
      setTasksStatus(task.id, 2);
    } else if (task.estado_id === 2 && (task.tipo_labor_id === 16 || task.tipo_labor_id === 37)) {
      // Navigate to the Evidences screen for specific task types
      navigateToIA(task);
    } else if (task.estado_id === 2) {
      // Mark as completed for other task types
      setTasksStatus(task.id, 3);
    }
  };

  if (!taskData.length) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topRow}>
        <Text style={styles.title}>Detalle de la tarea</Text>
      </View>
      
      {taskData.map((task) => (
        <View key={task.id} style={styles.taskContainer}>
          <Text style={styles.title}>{task.nombre}</Text>

          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.label}>Estado: {task.estado_id === 1 ? 'Pendiente' : task.estado_id === 2 ? 'En progreso':'Completado'}</Text>
            </View>
          </View>

          <Text style={styles.descriptionTitle}>Descripción:</Text>
          <Text style={styles.descriptionItem}>{task.descripcion || 'No hay descripción disponible.'}</Text>

          <TouchableOpacity 
            style={styles.startButton} 
            onPress={() => handleTaskStatusChange(task)}
          >
            <Text style={styles.startButtonText}>
              {task.estado_id === 1 ? 'Iniciar labor' : 
               (task.estado_id === 2 && (task.tipo_labor_id === 16 || task.tipo_labor_id === 37)) ? 'Registrar Evidencias' : 
               'Finalizar labor'}
            </Text>
          </TouchableOpacity>

          {/* Botón para navegar a IA */}
          <TouchableOpacity 
            style={styles.iaButton} 
            onPress={() => navigateToIA(task)}
          >
            <Text style={styles.iaButtonText}>IA</Text>
          </TouchableOpacity>
        </View>
      ))}
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
  iaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  iaButtonText: {
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
