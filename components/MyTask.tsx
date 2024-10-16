import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import CustomDrawerContent from './CustomDrawerContent';

const MyTask: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const navigation = useNavigation();

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
