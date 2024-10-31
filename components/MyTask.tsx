import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import CustomDrawerContent from './CustomDrawerContent';

const MyTask: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { token, userId, fincaId } = route.params as { token: string, userId: number, fincaId: number };

  console.log(fincaId, userId)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`https://agroinsight-backend-production.up.railway.app/farm/${fincaId}/user/${userId}/tasks/list`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('tareas:', data);
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [fincaId, userId, token]);

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Mis labores</Text>

        {loading ? (
          <Text style={styles.loadingText}>Cargando labores...</Text>
        ) : tasks.length === 0 ? (
          <Text style={styles.noTasksText}>Aún no tienes labores asignadas.</Text>
        ) : (
          <View>
            {tasks.map((task) => (
              <TouchableOpacity key={task.id} style={styles.taskItem}>
                <View style={styles.taskContent}>
                  <Text style={styles.taskName}>{task.nombre}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Menu Button (Drawer) */}
      <View style={styles.menuButtonContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenMenu}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      </View>

      {/* Custom Drawer */}
      <CustomDrawerContent isVisible={isDrawerVisible} onClose={handleCloseMenu} />
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
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
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
