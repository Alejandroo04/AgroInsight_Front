import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import CustomDrawerContent from './CustomDrawerContent';
import axios from 'axios';

const MyFarms: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { token, userId, page } = route.params as { token: string, userId: number, page: number };

  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true); // Set loading to true at the beginning of the fetch
      try {
        const response = await axios.get(`https://agroinsight-backend-production.up.railway.app/farm/worker/farms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page, 
          },
        });

        setFarms(Array.isArray(response.data.farms) ? response.data.farms : []);
        } catch (error) {
        console.error("Error fetching farms:", error);
      } finally {
        setLoading(false); // Also set loading to false if there is an error
      }
      fetchFarms()
    };

    fetchFarms();
  }, [userId, token]);

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      <View>
            {farms.map((farm) => (
              <TouchableOpacity key={farm.id} style={styles.farmItem}>
                <View style={styles.farmContent}>
                  <Text style={styles.farmName}>{farm.nombre}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Mis fincas</Text>

        {loading ? (
          <Text style={styles.loadingText}>Cargando fincas...</Text>
        ) : farms.length > 0 ? (
          <Text style={styles.noFarmsText}>Aún no tienes fincas asociadas.</Text>
        ) : (
          <View>
            {farms.map((farm) => (
              <TouchableOpacity key={farm.id} style={styles.farmItem}>
                <View style={styles.farmContent}>
                  <Text style={styles.farmName}>{farm.nombre}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Menu Button (Drawer) */}
      <View style={styles.menuButtonContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenMenu}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      </View>

      {/* Custom Drawer */}
      <CustomDrawerContent isVisible={isDrawerVisible} onClose={handleCloseMenu} />
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
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  noFarmsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  farmName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
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

export default MyFarms;
