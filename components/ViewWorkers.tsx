import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const ViewWorkers: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const route = useRoute();
  const { token, farmId } = route.params as { token: string; farmId: number };

  // Obtener trabajadores asociados a la finca con paginación
  const fetchWorkers = async (page: number) => {
    try {
      const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farm/${farmId}/users?role_id=4`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
        },
      });

      if (response.data && response.data.users) {
        setWorkers(response.data.users); // Solo mapear si existen usuarios
        setTotalPages(response.data.total_pages || 1); // Asegúrate de que la API retorne el total de páginas
        setErrorMessage(''); // Resetear mensaje de error si la solicitud es exitosa
      } else {
        setWorkers([]); // Si no hay usuarios, asegurarse de que sea un array vacío
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Manejo específico para errores de la API
        const details = err.response.data.detail;
        setErrorMessage(details ? details.map((d: any) => d.msg).join(', ') : 'Error desconocido');
      } else {
        // Manejo de errores generales
        setErrorMessage('Error al obtener trabajadores.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers(currentPage);
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
        <Text style={styles.title}>Trabajadores asociados</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando trabajadores...</Text>
      ) : errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : workers.length > 0 ? (
        <View>
          {workers.map((worker) => (
            <View key={worker.id} style={styles.workerCard}>
              <Text style={styles.workerName}>{worker.nombre} {worker.apellido}</Text>
              <Text style={styles.workerInfo}>Rol: {worker.rol}</Text>
              <Text style={styles.workerInfo}>Email: {worker.email}</Text>
              <Text style={styles.workerInfo}>Estado: {worker.estado}</Text>
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
        <Text style={styles.noWorkersText}>
          Aún no tienes ningún trabajador asociado a esta finca.
        </Text>
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
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
  workerCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    elevation: 2,
  },
  workerName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  workerInfo: {
    fontSize: 16,
    color: '#333',
  },
  noWorkersText: {
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

export default ViewWorkers;
