import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Header from '../Header';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const ViewResultsIA: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { images, responseData, taskId, token, farmId, userId } = route.params as { images: Array<{ uri: string }>, responseData: any, taskId: number, token: string, farmId: number, userId: number };

    console.log(token);

    // Función para traducir las clases predichas
    const translateClass = (predictedClass: string) => {
        switch (predictedClass) {
            case 'leaf_with_larva':
                return 'Hoja con larva';
            case 'healthy_leaf':
                return 'Hoja sana';
            case 'damaged_leaf':
                return 'Hoja dañada';
            case 'Alluvial Soil':
                return 'Suelo aluvial';
            case 'Black Soil':
                return 'Suelo negro';
            case 'Cinder Soil':
                return 'Suelo de ceniza';
            case 'Clay Soil':
                return 'Suelo arcilloso';
            case 'Laterite Soil':
                return 'Suelo laterítico';
            case 'Peat Soil':
                return 'Suelo de turba';
            case 'Yellow Soil':
                return 'Suelo amarillo';
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

    // Verificar que responseData.results existe y es un arreglo
    const results = Array.isArray(responseData?.results) ? responseData.results : [];

    // Función para finalizar la labor
    const setTasksStatus = async (task_id: number, state_id: number) => {
        try {
            await axios.put(
                `https://agroinsight-backend-production.up.railway.app/tasks/${task_id}/states/${state_id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Alert.alert("Éxito", "La labor ha sido finalizada.");
            navigation.navigate('MyTask', {
                farmId,
                userId,
                token,
                page: 1, // Puedes ajustar el número de página según sea necesario
            });
        } catch (error) {
            console.error("Error al finalizar la labor:", error);
            Alert.alert("Error", "No se pudo finalizar la labor.");
        }
    };

    const handleFinishTask = () => {
        setTasksStatus(taskId, 3); // Cambia el estado de la tarea a 3 (Finalizado)
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
                        {results.length > 0 ? (
                            results.map((result, index) => (
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
                            ))
                        ) : (
                            <Text style={styles.noResultsText}>No se encontraron predicciones de la IA.</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
            {/* Botón para finalizar la labor */}
            <TouchableOpacity style={styles.finishButton} onPress={handleFinishTask}>
                <Text style={styles.finishButtonText}>Finalizar Labor</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    content: { padding: 20, flex: 1 },
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
    noResultsText: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' },
    finishButton: {
        backgroundColor: '#009707',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    finishButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ViewResultsIA;
