import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from './Header';

const TaskDetail: React.FC = () => {
  const route = useRoute();
  const { 
    nombre, 
    tipo_labor_id, 
    fecha_inicio_estimada, 
    fecha_finalizacion, 
    descripcion, 
    estado_id 
  } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      <View style={styles.topRow}>
        <Text style={styles.title}>Detalle de la tarea </Text>
      </View>

      {/* Task Details */}
      <View style={styles.taskContainer}>
        <Text style={styles.title}>{nombre}</Text>

        <View style={styles.row}>
          <Image source={require('../assets/farms.png')} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.label}>Estado: {estado_id}</Text>
            <Text style={styles.label}>Tipo de Labor: {tipo_labor_id}</Text>
            <Text style={styles.label}>Fecha de Inicio Estimada: {fecha_inicio_estimada}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Fecha de Finalización: {fecha_finalizacion || 'Sin completar'}</Text>
        
        <Text style={styles.descriptionTitle}>Descripción:</Text>
        <Text style={styles.descriptionItem}>{descripcion || 'No hay descripción disponible.'}</Text>
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

export default TaskDetail;
