import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Importar useRoute
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const ViewAssignedTasks: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute(); // Usar useRoute para acceder a los parámetros
  const { farmName } = route.params as { farmName: string }; // Extraer farmName

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleAssignTasks = () => {
    // Aquí iría la navegación o acción para asignar labores
    console.log("Asignar labores");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header reutilizado */}
      <Header />

      {/* Título de la pantalla */}
      <View style={styles.topRow}>
        <Text style={styles.title}>Finca {farmName}</Text>
      </View>

      {/* Sección de "Labores asignadas" con el botón */}
      <View style={styles.assignSection}>
        <Text style={styles.sectionTitle}>Labores asignadas</Text>
        <TouchableOpacity style={styles.assignButton} onPress={handleAssignTasks}>
          <Icon name="briefcase" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Descripción */}
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          El trabajador aun <Text style={styles.workerName}></Text> no tiene labores asignadas, puedes hacerlo presionando el botón verde que se encuentra en la parte superior derecha.
        </Text>
      </View>

      {/* Botón de menú hamburguesa */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={handleOpenMenu}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>

      {/* Menú drawer */}
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  assignSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#8B4513',
  },
  assignButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  workerName: {
    fontWeight: 'bold',
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

export default ViewAssignedTasks;
