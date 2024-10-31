import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from './Header';

const TaskDetail: React.FC = () => {
  const route = useRoute();
  const { task } = route.params;

  // Verifica que task esté definido
  if (!task) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Detalles de la tarea no disponibles</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Task Details */}
      <View style={styles.taskContainer}>
        <Text style={styles.title}>{task.nombre}  {task.codigo}</Text>

        <View style={styles.row}>
          <Image source={require('../assets/farms.png')} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.label}>Estado: <Text style={styles.status}>{task.estado}</Text></Text>
            <Text style={styles.label}>Tipo: {task.tipo}</Text>
            <Text style={styles.label}>Creado: {task.fecha_creacion}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Fecha de ejecución estimada: {task.fecha_ejecucion}</Text>
        <Text style={styles.subtitle}>Fecha de finalización: {task.fecha_finalizacion || 'Sin completar'}</Text>
        
        <Text style={styles.descriptionTitle}>Descripción:</Text>
        {/* Asegúrate de que task.descripcion sea un arreglo antes de usar map */}
        {Array.isArray(task.descripcion) ? (
          task.descripcion.map((item, index) => (
            <Text key={index} style={styles.descriptionItem}>{index + 1}. {item}</Text>
          ))
        ) : (
          <Text>No hay descripción disponible.</Text>
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
  status: {
    color: '#4CAF50',
    fontWeight: 'bold',
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
  descriptionItem: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
});

export default TaskDetail;
