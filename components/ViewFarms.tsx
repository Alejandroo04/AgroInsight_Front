import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native'; // Importa useFocusEffect
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const ViewFarms: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params as { token: string };

  const fetchFarms = async (page: number) => {
    try {
      const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farm/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response from API:', response.data);
      setFarms(Array.isArray(response.data.farms) ? response.data.farms : []);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error('Error fetching farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms(currentPage);
  }, [token, currentPage]);

  // Use useFocusEffect to refetch the farms when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading to true again
      fetchFarms(currentPage); // Fetch the farms again
    }, [currentPage, token])
  );

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleCreateFarm = () => {
    navigation.navigate('CreateFarms', { token });
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

  const handleFarmPress = (farmId: number) => {
    navigation.navigate('DetailsFarms', { token, farmId }); // Navegar a DetailsFarms
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.topRow}>
        <Text style={styles.title}>Mis fincas</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateFarm}>
          <Text style={styles.addButtonText}>+ Crear finca</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando fincas...</Text>
      ) : farms.length === 0 ? (
        <Text style={styles.noFarmsText}>
          Aún no tienes registrada ninguna finca, puedes hacerlo presionando el botón que se encuentra en la parte superior.
        </Text>
      ) : (
        <View>
          {farms.map((farm) => (
            <TouchableOpacity key={farm.id} style={styles.farmItem} onPress={() => handleFarmPress(farm.id)}>
              <View style={styles.farmContent}>
                <Text style={styles.farmName}>{farm.nombre}</Text>
                <Icon name="eye-outline" size={24} color="#4CAF50" style={styles.eyeIcon} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Paginador */}
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
    borderRadius: 20,
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
  noFarmsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  farmItem: {
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
  farmContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  eyeIcon: {
    marginLeft: 10,
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

export default ViewFarms;
