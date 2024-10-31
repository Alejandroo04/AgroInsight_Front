import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const ViewCrops: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const route = useRoute();
  const navigation = useNavigation();
  const { token, plotId } = route.params as { token: string, plotId: number };

 console.log(plotId);
  

  const fetchCrops = async (page: number) => {
    try {
      const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/plots/${plotId}/crops`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
        },
      });

      console.log('Response from API:', response.data.crops);
      setCrops(Array.isArray(response.data.crops) ? response.data.crops : []);
      setTotalPages(response.data.total_pages);
      setLoading(false);
    } catch (error) {
      // Muestra el error completo si la solicitud falla
      console.error('Error listando cultivos:', error);
  
      if (error.response) {
        console.log('Código de estado:', error.response.status);
        console.log('Encabezados:', error.response.headers);
        console.log('Datos de respuesta:', error.response.data);
  
        // Extrae el mensaje del error y muéstralo en el modal
        const errorMessage = error.response.data.message || 'Error desconocido al listar el cultivo';
        setModalMessage(`Error: ${errorMessage}`);
      } else {
        // Si no hay una respuesta del backend (por ejemplo, problemas de red)
        setModalMessage('Error de red o problema de conexión');
      }

  
      setModalVisible(true);
  
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
    
  };

  useEffect(() => {
    fetchCrops(currentPage);
  }, [token, currentPage]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCrops(currentPage);
    }, [currentPage, token])
  );

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleCreateCrop = () => {
    navigation.navigate('CreateCrops', { token, plotId });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleCropPress = (cropId: number) => {
    navigation.navigate('DetailsCrops', { token, cropId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.topRow}>
        <Text style={styles.title}>Mis cultivos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateCrop}>
          <Text style={styles.addButtonText}>+ Crear cultivo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando cultivos...</Text>
      ) : crops.length == 0 ? (
        <Text style={styles.noCropsText}>
          Aún no tienes registrado ningún cultivo, puedes hacerlo presionando el botón que se encuentra en la parte superior.
        </Text>
      ) : (
        <View>
          {crops.map((crop) => (
            <TouchableOpacity key={crop.id} style={styles.cropItem} onPress={() => handleCropPress(crop.id)}>
              <View style={styles.cropContent}>
                <Text style={styles.cropName}>{crop.variedad_maiz_nombre}</Text>
                {/* <Icon name="eye-outline" size={24} color="#4CAF50" style={styles.eyeIcon} /> */}
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.pagination}>
            <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1}>
              <Text style={currentPage === 1 ? styles.disabledButton : styles.button}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.pageNumber}>{currentPage}</Text>
            <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages}>
              <Text style={currentPage === totalPages ? styles.disabledButton : styles.button}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  // Estilos iguales a ViewFarms, adaptados para ViewCrops
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  noCropsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  cropItem: {
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
  cropContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  eyeIcon: {
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    fontSize: 20,
    color: '#4CAF50',
    marginHorizontal: 10,
  },
  disabledButton: {
    fontSize: 20,
    color: '#ccc',
    marginHorizontal: 10,
  },
  pageNumber: {
    fontSize: 20,
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

export default ViewCrops;
