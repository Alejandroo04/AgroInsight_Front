import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView } from 'react-native';
import Header from '../Header';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Importa íconos de Expo

const ViewResultsIA: React.FC = () => {
  const route = useRoute();
  const { images, responseData } = route.params as { images: Array<{ uri: string }>, responseData: any };

  // Función para traducir las clases predichas
  const translateClass = (predictedClass: string) => {
    switch (predictedClass) {
      case 'leaf_with_larva':
        return 'Hoja con larva';
      case 'healthy_leaf':
        return 'Hoja sana';
      case 'damaged_leaf':
        return 'Hoja dañada';
      default:
        return predictedClass;
    }
  };

  // Función para obtener el ícono según la clase predicha
  const getIcon = (predictedClass: string) => {
    switch (predictedClass) {
      case 'leaf_with_larva':
        return <MaterialIcons name="warning" size={24} color="orange" style={styles.icon} />;
      case 'damaged_leaf':
        return <MaterialIcons name="error" size={24} color="red" style={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Resultados de la IA</Text>
        
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Imágenes enviadas</Text>
          <ScrollView horizontal style={styles.imagesContainer}>
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} style={styles.image} />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Predicciones de la IA</Text>
          <View style={styles.responseContainer}>
            {responseData.results.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultText}>
                  <Text style={styles.resultLabel}>Imagen:</Text> {result.filename}
                </Text>
                <View style={styles.predictionContainer}>
                  <Text style={styles.resultText}>
                    <Text style={styles.resultLabel}>Clase Predicha:</Text> {translateClass(result.predicted_class)}
                  </Text>
                  {getIcon(result.predicted_class)}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50', marginTop: 20 },
  imagesContainer: { flexDirection: 'row', marginVertical: 10 },
  image: { width: 100, height: 100, marginRight: 10, borderRadius: 8 },
  responseContainer: { marginTop: 10 },
  resultItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  resultText: { fontSize: 16, color: '#333', marginBottom: 5 },
  resultLabel: { fontWeight: 'bold', color: '#4CAF50' },
  predictionContainer: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginLeft: 5 },
});

export default ViewResultsIA;
