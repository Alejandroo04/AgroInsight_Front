import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from './Header';
import axios from 'axios';

const TaskForUsers: React.FC = () => {
  const route = useRoute();
  const { farmId, userId, token, page } = route.params as { token: string, farmId: number, userId: number, page: number}; // Obtener farmId y userId desde route.params

  // Estado para almacenar los datos de la tarea
  const [taskData, setTaskData] = useState(null);

  // Llamada al API para obtener los datos de la tarea
  useEffect(() => {
    const fetchTaskData = async () => {
        try {
            const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farm/${farmId}/user/${userId}/tasks/list`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                page, 
              },
            });
            
        const data = await response.json();
        setTaskData(data); // Guardar los datos en el estado
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    fetchTaskData();
  }, [farmId, userId]);

  if (!taskData) {
    return <Text>Loading...</Text>; // Mostrar mensaje de carga mientras se obtienen los datos
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      <View style={styles.topRow}>
        <Text style={styles.title}>Detalle de la tarea </Text>
      </View>

      {/* Task Details */}
      <View style={styles.taskContainer}>
        <Text style={styles.title}>{taskData.nombre}</Text>

        <View style={styles.row}>
          <Image source={require('../assets/farms.png')} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.label}>Estado: {taskData.estado_id}</Text>
            <Text style={styles.label}>Tipo de Labor: {taskData.tipo_labor_id}</Text>
            <Text style={styles.label}>Fecha de Inicio Estimada: {taskData.fecha_inicio_estimada}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Fecha de Finalización: {taskData.fecha_finalizacion || 'Sin completar'}</Text>
        
        <Text style={styles.descriptionTitle}>Descripción:</Text>
        <Text style={styles.descriptionItem}>{taskData.descripcion || 'No hay descripción disponible.'}</Text>
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
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0522D',
    marginTop: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  topRow: {
    padding: 10,
    alignItems: 'center',
    fontSize: 20,
  },
  descriptionItem: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
});

export default TaskForUsers;
