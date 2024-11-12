import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from './Header';
import axios from 'axios';

const TaskForUsers: React.FC = () => {
  const route = useRoute();
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
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    fetchTaskData();
  }, [farmId, userId, token, page]);

  if (!taskData) {
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
            <Image source={require('../assets/farms.png')} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.label}>Estado: {task.estado_id === 1 ? 'Pendiente' : 'Completado'}</Text>
            </View>
          </View>


          <Text style={styles.descriptionTitle}>Descripción:</Text>
          <Text style={styles.descriptionItem}>{task.descripcion || 'No hay descripción disponible.'}</Text>

          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>{ task.estad }  Iniciar labor</Text>
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
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
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
    paddingHorizontal: 40, // Ajuste en el tamaño del botón
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
