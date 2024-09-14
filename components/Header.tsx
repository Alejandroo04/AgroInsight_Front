import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

// Obtenemos las dimensiones de la pantalla
const { width } = Dimensions.get('window');

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Image source={require('../assets/header.png')} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%', // Aseguramos que el contenedor ocupe el 100% del ancho de la pantalla
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: width, // Ocupa todo el ancho de la pantalla
    height: width * 0.3, // La altura es el 30% del ancho (ajústalo si es necesario)
  },
});

export default Header;
