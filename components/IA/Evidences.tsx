import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../Header';
import CustomDrawerContent from '../CustomDrawerContent';
import { useNavigation, useRoute } from '@react-navigation/native';

const Evidences: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [images, setImages] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { token, taskId } = route.params as { token: string, taskId: number };

  useEffect(() => {
    console.log("Estado de imágenes:", images);
  }, [images]);

  const handleOpenMenu = () => {
    setDrawerVisible(true);
  };

  const handleCloseMenu = () => {
    setDrawerVisible(false);
  };

  const handleCaptureImages = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara para tomar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaType: 'photo',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages((prevImages) => [...prevImages, { uri: result.assets[0].uri }]);
    }
  };

  const handleUploadImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para subir fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: 'photo',
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const selectedImages = result.assets.map((asset) => ({ uri: asset.uri }));
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSendImages = async () => {
    if (images.length === 0) {
      Alert.alert('Error', 'No hay imágenes para enviar.');
      return;
    }
  
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('files', {
        uri: image.uri,
        name: `image_${index}.jpg`,
        type: 'image/jpeg'
      });
    });
    formData.append('task_id', taskId);
  
    try {
      const response = await fetch('https://agroinsight-backend-production.up.railway.app/fall-armyworm/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData);

      navigation.navigate('ViewResultsIA', { images, responseData });
    } catch (error) {
      console.error("Error al enviar las imágenes:", error);
      Alert.alert('Error', 'No se pudieron enviar las imágenes.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Evidencias</Text>
        <Text style={styles.description}>
          Para detectar el gusano cogollero, necesitamos imágenes de tu cultivo. Por favor, captura una foto o carga una imagen existente desde tu dispositivo.
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCaptureImages}>
            <Image source={require('../../assets/camara.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Capturar imágenes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUploadImages}>
            <Image source={require('../../assets/image.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Subir imágenes</Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={styles.uploadedImagesContainer}>
            <Text style={styles.sectionTitle}>Imágenes cargadas</Text>
            <ScrollView horizontal style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
                    <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendImages}>
              <Text style={styles.sendButtonText}>Enviar imágenes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <CustomDrawerContent isVisible={isDrawerVisible} onClose={handleCloseMenu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  content: { padding: 20, alignItems: 'center', justifyContent: 'flex-start' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10, marginTop: 20 },
  description: { fontSize: 16, color: '#666', textAlign: 'justify', marginVertical: 10, paddingHorizontal: 10 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  button: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 20, width: '40%', alignItems: 'center', borderWidth: 1, borderColor: '#4CAF50', borderStyle: 'dashed' },
  icon: { width: 60, height: 60, marginBottom: 10 },
  buttonText: { fontSize: 16, color: 'black', fontWeight: 'bold', textAlign: 'center' },
  uploadedImagesContainer: { borderWidth: 1, borderColor: '#4CAF50', borderRadius: 10, padding: 10, marginTop: 20, alignItems: 'center', width: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10 },
  imagesContainer: { flexDirection: 'row', marginTop: 10 },
  imageWrapper: { position: 'relative', marginHorizontal: 5 },
  previewImage: { width: 100, height: 100, borderRadius: 10 },
  removeButton: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF6347', borderRadius: 10, padding: 5 },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
  sendButton: { backgroundColor: '#4CAF50', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginTop: 15 },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default Evidences;
