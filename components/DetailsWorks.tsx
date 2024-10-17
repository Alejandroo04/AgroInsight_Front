import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const DetailsWorks: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = React.useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  // Obtener token, workerId, farmId y los detalles del trabajador desde los parámetros de navegación
  const { token, workerId, farmId, nombre, apellido, email, estado, farmName } = route.params as {
    token: string;
    workerId: number;
    farmId: number;
    nombre: string;
    apellido: string;
    email: string;
    estado: string;
    farmName: string;
  };

  // Convertir "active" a "Activo" en español
  const estadoTraducido = estado === 'active' ? 'Activo' : estado;

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleAssignTasks = () => {
    navigation.navigate('AssignTask', { token, workerId });
  };

  const handleViewAssignedTasks = () => {
    navigation.navigate('ViewAssignedTasks', { token, workerId, farmName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.topRow}>
        <Text style={styles.title}>Detalle del Trabajador</Text>
      </View>

      {/* Muestra los detalles del trabajador directamente de los params */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image source={require('../assets/Vector.png')} style={styles.cardImage} />
          <View style={styles.infoContainer}>
            <Text style={styles.workerName}>{nombre} {apellido}</Text>
            <Text style={styles.status}>
              <Text style={styles.statusDot}>&bull;</Text> {estadoTraducido}
            </Text>
            <Text style={styles.info}>Email: {email}</Text>
          </View>
        </View>
      </View>

      {/* Botones de acciones */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleAssignTasks}>
          <Icon name="briefcase" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}> Asignar labores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewAssignedTasks}>
          <Icon name="clipboard" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}> Ver labores asignadas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.hamburgerButton} onPress={handleOpenMenu}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>

      <CustomDrawerContent isVisible={isDrawerVisible} onClose={handleCloseMenu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    margin: 20,
    padding: 15,
    elevation: 2,
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  infoContainer: {
    marginLeft: 15,
    flex: 1,
  },
  workerName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 10,
  },
  statusDot: {
    color: '#4CAF50',
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  actionContainer: {
    margin: 20,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
  },
  hamburgerButton: {
    position: 'absolute',
    bottom: 20,
    left: '45%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerLine: {
    width: 30,
    height: 5,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 2,
  },
});

export default DetailsWorks;
