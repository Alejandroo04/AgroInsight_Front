import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import CustomDrawerContent from './CustomDrawerContent';

const MyTask: React.FC = () => {
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
        setTasks(data.tasks); // Assuming `data` is an array of tasks

      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [farmId, workerId, token]);


  return (
    <SafeAreaView style={styles.container}>
      {/* Reutilizar el componente de Header */}
      <Header />

      {/* Contenido principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Mis labores</Text>
        <Text style={styles.subtitle}>
          Aún no tienes labores asignadas, espera a que tu empleador te asigne actividades.
        </Text>
      </View>

      {/* Botón de menú (Drawer) */}
      <View style={styles.menuButtonContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      </View>

      {/* Drawer personalizado */}
      <CustomDrawerContent isVisible={isDrawerVisible} onClose={() => setDrawerVisible(false)} />
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
    justifyContent: 'flex-start', // Cambiado para alinear el contenido en la parte superior
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    marginTop: 20, // Espacio desde el header
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10, // Espacio entre el título y el subtítulo
  },
  menuButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerLine: {
    width: 30,
    height: 4,
    backgroundColor: '#fff',
    marginVertical: 3,
    borderRadius: 2,
  },
});

export default MyTask;
