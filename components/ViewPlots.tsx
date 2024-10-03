import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from 'axios';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';
import { useRoute } from '@react-navigation/native';

const ViewPlots: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [plots, setPlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const route = useRoute();
  const { token, farmId } = route.params as { token: string; farmId: number };

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

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Lotes Asociados</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando lotes...</Text>
      ) : plots.length > 0 ? (
        <View>
          {plots.map((plot) => (
            <View key={plot.id} style={styles.plotCard}>
              <Text style={styles.plotName}>{plot.nombre}</Text>
              <Text style={styles.plotInfo}>Ubicación: {plot.ubicacion}</Text>
              <Text style={styles.plotInfo}>Área: {plot.area_total} {plot.unidad_area}</Text>
            </View>
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
  titleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  plotCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    elevation: 2,
  },
  plotName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  plotInfo: {
    fontSize: 16,
    color: '#333',
  },
  noPlotsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
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
