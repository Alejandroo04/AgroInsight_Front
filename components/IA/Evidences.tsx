import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Header from '../Header';
import CustomDrawerContent from '../CustomDrawerContent';

const Evidences: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleCaptureImages = () => {
    // Logic for capturing images goes here
  };

  const handleUploadImages = () => {
    // Logic for uploading images goes here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Evidencias</Text>
        <Text style={styles.description}>
          Para detectar el gusano cogollero, necesitamos imágenes de tu cultivo. Por favor, captura una foto o carga una imagen existente desde tu dispositivo.
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCaptureImages}>
            <Image source={require('../../assets/camara.png')} style={styles.icon} />
            <Text style={styles.buttonText}>capturar imágenes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUploadImages}>
            <Image source={require('../../assets/image.png')} style={styles.icon} />
            <Text style={styles.buttonText}>subir imágenes</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuButtonContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenMenu}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      </View>

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
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'justify',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    width: '40%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed', // Adds a dashed border
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
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

export default Evidences;
