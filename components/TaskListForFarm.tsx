import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from './Header';
import axios from 'axios';

const TaskListForFarm: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation(); // Inicializa la navegación
  const { farmId, token, userId } = route.params as { farmId: number, token: string, userId: string};

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farms/${farmId}/worker/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [farmId, token]);

  const handleTaskPress = (taskId: number) => {
    // Navega al componente TaskForUsers con los parámetros necesarios
    navigation.navigate('TaskForUsers', {
      farmId,
      taskId,
      token,
      userId,
    });
  };

  const taskList = tasks.map((task) => (
    <TouchableOpacity 
      key={task.id} 
      style={styles.taskItem} 
      onPress={() => handleTaskPress(task.id)} // Añade el evento onPress para navegar
    >
      <View style={styles.taskContent}>
        <Text style={styles.taskName}>{task.nombre}</Text>
        <Icon name="eye-outline" size={24} color="#4CAF50" style={styles.eyeIcon} />
      </View>
    </TouchableOpacity>
  ));

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Tareas de la Finca</Text>

        {loading ? (
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        ) : tasks.length > 0 ? (
          taskList
        ) : (
          <Text style={styles.noTasksText}>No hay tareas asignadas a esta finca.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  noTasksText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: '#f0fff0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  eyeIcon: {
    marginLeft: 10,
  },
});

export default TaskListForFarm;
