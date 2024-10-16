import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import CustomDrawerContent from './CustomDrawerContent';

const DetailsTask: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Reutilizamos el componente de Header */}
      <Header />

      {/* Contenido del detalle de la labor */}
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Monitoreo de cultivos - L1</Text>

        {/* Estado de la labor */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Pendiente</Text>
          <View style={styles.statusIndicator} />
        </View>

        {/* Imagen */}
        <Image source={require('../assets/farms.png')} style={styles.image} />

        {/* Botón para iniciar la labor */}
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Iniciar labor</Text>
        </TouchableOpacity>

        {/* Descripción de la labor */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción:</Text>
          <Text style={styles.descriptionItem}>1. Preparar equipo: cámara lista y espacio suficiente.</Text>
          <Text style={styles.descriptionItem}>2. Zonas críticas: Identificar áreas con daños visibles.</Text>
          <Text style={styles.descriptionItem}>3. Toma de fotos: Capturar hojas, cogollos, gusanos o larvas.</Text>
          <Text style={styles.descriptionItem}>4. Subida: Organizar y cargar las imágenes.</Text>
        </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#666',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bbb',
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 10,
  },
  descriptionItem: {
    color: '#666',
    marginBottom: 5,
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

export default DetailsTask;
