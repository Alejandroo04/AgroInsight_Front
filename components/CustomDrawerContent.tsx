import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CustomDrawerContentProps {
  isVisible: boolean;
  onClose: () => void;
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      navigation.navigate('Login', { resetFields: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const goToHome = () => {
    navigation.navigate('HomeAdmin');
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.drawerModalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.drawerContent}>
            

              {/* Opción "Home" */}
              <TouchableOpacity style={styles.drawerItem} onPress={goToHome}>
                <Icon name="home" size={24} color="blue" style={styles.drawerIcon} />
                <Text style={styles.drawerLabel}>Home</Text>
              </TouchableOpacity>

              {/* Línea divisoria */}
              <View style={styles.divider} />

              {/* Opción "Cerrar sesión" */}
              <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
                <Icon name="logout" size={24} color="red" style={styles.drawerIcon} />
                <Text style={styles.drawerLabel}>Cerrar sesión</Text>
              </TouchableOpacity>

              {/* Línea divisoria */}
              <View style={styles.divider} />

              {/* Versión */}
              <Text style={styles.versionText}>versión 4.0.0</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  drawerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  drawerIcon: {
    marginRight: 10,
  },
  drawerLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  versionText: {
    paddingLeft: 20,
    paddingTop: 10,
    fontSize: 12,
    color: 'gray',
  },
});

export default CustomDrawerContent;
