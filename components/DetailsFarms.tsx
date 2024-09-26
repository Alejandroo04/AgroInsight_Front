import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const DetailsFarms: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [farmDetails, setFarmDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [plots, setPlots] = useState<any[]>([]);
  const [plotLoading, setPlotLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const route = useRoute();
  const navigation = useNavigation();
  const { token, farmId } = route.params as { token: string; farmId: number };

  // Obtener detalles de la finca
  const fetchFarmDetails = async () => {
    try {
      const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farm/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const selectedFarm = response.data.farms.find((farm: any) => farm.id === farmId);
      if (selectedFarm) {
        setFarmDetails(selectedFarm);
      } else {
        console.error('No se encontró la finca con el ID proporcionado');
      }
    } catch (err) {
      console.error('Error fetching farm details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener lotes de la finca con paginación
  const fetchPlots = async (page: number) => {
    try {
      const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/plot/list/${farmId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
        },
      });

      setPlots(response.data.plots);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error('Error fetching plots:', err);
    } finally {
      setPlotLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmDetails();
  }, [token, farmId]);

  // Refrescar los lotes cuando se cambia la página o el token
  useFocusEffect(
    useCallback(() => {
      setPlotLoading(true);
      fetchPlots(currentPage);
    }, [currentPage, token])
  );

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

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleCreateLot = () => {
    navigation.navigate('CreatePlot', { token, farmId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.topRow}>
        <Text style={styles.title}>Detalle</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateLot}>
          <Text style={styles.addButtonText}>+ Crear lote</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando detalles de la finca...</Text>
      ) : farmDetails ? (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={require('../assets/farms.png')} style={styles.cardImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.farmName}>Finca {farmDetails.nombre}</Text>
              <Text style={styles.status}>
                <Text style={styles.statusDot}>&bull;</Text> Activa
              </Text>
              <Text style={styles.info}>Ubicación: {farmDetails.ubicacion}</Text>
              <Text style={styles.info}>Área: {farmDetails.area_total} {farmDetails.unidad_area}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.noDetailsText}>No se encontraron detalles para esta finca.</Text>
      )}

      {/* Mostrar lotes */}
      {plotLoading ? (
        <Text style={styles.loadingText}>Cargando lotes...</Text>
      ) : plots.length === 0 ? (
        <Text style={styles.noPlotsText}>No hay lotes para esta finca.</Text>
      ) : (
        <View>
          {plots.map((plot) => (
            <TouchableOpacity key={plot.id} style={styles.plotItem}>
              <View style={styles.plotContent}>
                <Text style={styles.plotName}>{plot.nombre}</Text>
                <Icon name="eye-outline" size={24} color="#4CAF50" />
              </View>
            </TouchableOpacity>
          ))}

          {/* Paginación */}
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
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    margin: 20,
    padding: 15,
    elevation: 2,
    borderColor: '#4CAF50',
    borderWidth: 1, // Agrega borde verde delgado
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
  farmName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    color: '#4CAF50',
  },
  statusDot: {
    color: '#4CAF50',
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  noDetailsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
  noPlotsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
  plotItem: {
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
  plotContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plotName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    fontSize: 24,
    paddingHorizontal: 10,
    color: '#4CAF50',
  },
  disabledButton: {
    fontSize: 24,
    paddingHorizontal: 10,
    color: '#ccc',
  },
  pageNumber: {
    fontSize: 18,
    marginHorizontal: 10,
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

export default DetailsFarms;
