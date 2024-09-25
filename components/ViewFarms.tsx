import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import CustomDrawerContent from './CustomDrawerContent'; // Reutiliza el modal del menú hamburguesa
import Header from './Header'; // Reutiliza el componente Header

const ViewFarms: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Mis fincas</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Crear finca</Text>
        </TouchableOpacity>

        <Text style={styles.noFarmsText}>
          Aún no tienes registrada ninguna finca, puedes hacerlo presionando el botón que se encuentra en la parte superior.
        </Text>
      </View>

      {/* Botón de hamburguesa */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={handleOpenMenu}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>

      {/* Modal de menú hamburguesa */}
      <CustomDrawerContent isVisible={isDrawerVisible} onClose={handleCloseMenu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noFarmsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
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

export default ViewFarms;
