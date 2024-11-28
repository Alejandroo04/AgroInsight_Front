import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PortalContext } from 'react-native-paper/lib/typescript/components/Portal/PortalHost';

const ViewPlots: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [plots, setPlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();

  const route = useRoute();
  const { token, farmId, plotId } = route.params as { token: string; farmId: number, plotId: number };

  // Obtener lotes de la finca con paginación
  const fetchPlots = async (page: number) => {
    try {
      const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farm/${farmId}/plot/list`, {
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots(currentPage);
  }, [token, farmId, currentPage]);

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
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

  const handlePlotPress = (plotId: number, lat: number, lon: number) => {
    navigation.navigate('ViewCrops', { 
      token, 
      plotId,
      lat,
      lon
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.topRow}>
        <Text style={styles.title}>Lotes Asociados</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando lotes...</Text>
      ) : plots.length > 0 ? (
        <View>
          {plots.map((plot) => (
            <TouchableOpacity key={plot.id} style={styles.plotItem} onPress={() => handlePlotPress(plot.id, plot.latitud, plot.longitud)}>
              <View style={styles.plotContent}>
                <Text style={styles.plotName}>{plot.nombre}</Text>
                <Icon name="eye-outline" size={24} color="#4CAF50" style={styles.eyeIcon} />
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
      ) : (
        <Text style={styles.noPlotsText}>No hay lotes asociados a esta finca.</Text>
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
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#794A15',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
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
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  plotName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
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
  noPlotsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
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

export default ViewPlots;
