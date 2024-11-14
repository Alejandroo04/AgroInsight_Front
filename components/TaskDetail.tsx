import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';

const TaskDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { 
    id,
    nombre, 
    tipo_labor_id, 
    fecha_inicio_estimada, 
    fecha_finalizacion, 
    descripcion, 
    estado_id,
    estado_nombre,
    tipo_labor_nombre,
    token,
  } = route.params;

  const onRegisterCost = (taskId: number) => {
    navigation.navigate('CostRegister', { token, taskId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      <View style={styles.topRow}>
        <Text style={styles.title}>Detalle de la tarea</Text>
      </View>

      {/* Task Details */}
      <View style={styles.taskContainer}>
        <Text style={styles.title}>{nombre}</Text>

        <View style={styles.row}>
          <Image source={require('../assets/farms.png')} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.label}>Estado: {estado_nombre}</Text>
            <Text style={styles.label}>Tipo: {tipo_labor_nombre}</Text>
            <Text style={styles.label}>Fecha inicio estimada: {fecha_inicio_estimada}</Text>
          </View>
        </View>

        <Text style={styles.label}>Fecha de Finalización: {fecha_finalizacion || 'Sin completar'}</Text>
        
        <Text style={styles.descriptionTitle}>Descripción:</Text>
        <Text style={styles.descriptionItem}>{descripcion || 'No hay descripción disponible.'}</Text>
        <TouchableOpacity style={styles.button} onPress={onRegisterCost(id)}>
          <Text style={styles.buttonText}>Registrar costos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: { fontSize: 16, color: 'white', fontWeight: 'bold', textAlign: 'center' },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-center',
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
