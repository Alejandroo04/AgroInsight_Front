import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa el ícono
import axios from 'axios';
import CustomDrawerContent from './CustomDrawerContent';
import Header from './Header';

const DetailsFarms: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [farmDetails, setFarmDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchFarmDetails();
  }, [token, farmId]);

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleCreatePlot = () => {
    navigation.navigate('CreatePlot', { token, farmId }); // Redirige a CreatePlot
  };

  const handleViewPlots = () => {
    navigation.navigate('ViewPlots', { token, farmId });
  };

  // Navegación al componente ViewWorkers
  const handleViewWorkers = () => {
    navigation.navigate('ViewWorkers', { token, farmId });
  };
  const handleAssociateWorkers = () => {
    navigation.navigate('AssociateWorkers', { token, farmId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.topRow}>
        <Text style={styles.title}>Detalle</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreatePlot}>
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

      {/* Botones de acciones con íconos */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleAssociateWorkers}>
          <Icon name="person-add" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}> Asociar trabajadores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewWorkers}>
          <Icon name="people" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}> Ver trabajadores asociados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewPlots}>
          <Icon name="leaf" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}> Ver lotes asociados</Text>
        </TouchableOpacity>
      </View>

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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderWidth: 1,
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
  actionContainer: {
    margin: 20,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10, // Espacio entre el ícono y el texto
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
