import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Modal,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../Header';

const { width } = Dimensions.get('window');

const CostsReport: React.FC = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [farms, setFarms] = useState([]);
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [isFarmDropdownVisible, setFarmDropdownVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const route = useRoute();
    const navigation = useNavigation();

    const { token } = route.params as { token: string };

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const farm = await axios.get('https://agroinsight-backend-production.up.railway.app/farm/list/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFarms(farm.data.farms);
            } catch (error) {
                console.error("Error fetching farms", error);
            }
        };
        fetchFarms();
    }, [token]);

    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
    };

    const generateReport = async () => {
        if (!selectedFarm) {
            setModalMessage("Por favor, seleccione una finca.");
            setModalVisible(true);
            return;
        }

        try {
            const response = await axios.get(
                `https://agroinsight-backend-production.up.railway.app/reports/financial`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        farm_id: selectedFarm.id,
                        start_date: startDate.toISOString().split('T')[0],
                        end_date: endDate.toISOString().split('T')[0],
                    },
                }
            );

            const reportData = response.data; // Guardamos los datos del reporte

            setModalMessage('Reporte generado exitosamente.');
            setTimeout(() => {
                setModalVisible(false);
                // Navegamos a la pantalla de visualización del reporte
                navigation.navigate('ReportView', { reportData });
            }, 2000);
        } catch (error) {
            console.error("Error generating report", error);
            setModalMessage('Error al generar el reporte financiero.');
        }
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.formContainer}>
                <Text style={styles.title}>Generar reporte financiero</Text>

                <Text style={styles.label}>Finca</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setFarmDropdownVisible(!isFarmDropdownVisible)}
                >
                    <Text style={styles.dropdownText}>{selectedFarm ? selectedFarm.nombre : 'Seleccione una finca'}</Text>
                    <Ionicons name="chevron-down" size={24} color="#333" />
                </TouchableOpacity>

                {isFarmDropdownVisible && (
                    <View style={styles.dropdownContent}>
                        {farms.map((farm) => (
                            <TouchableOpacity
                                key={farm.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedFarm(farm);
                                    setFarmDropdownVisible(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{farm.nombre}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Fecha de inicio</Text>
                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowStartDatePicker(true)}
                >
                    <Text style={styles.datePickerText}>
                        {startDate.toLocaleDateString('es-ES')}
                    </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={handleStartDateChange}
                    />
                )}

                <Text style={styles.label}>Fecha de fin</Text>
                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowEndDatePicker(true)}
                >
                    <Text style={styles.datePickerText}>
                        {endDate.toLocaleDateString('es-ES')}
                    </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={handleEndDateChange}
                    />
                )}

                <TouchableOpacity style={styles.createButton} onPress={generateReport}>
                    <Text style={styles.createButtonText}>Generar Reporte</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal para mostrar mensajes */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>{modalMessage}</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    descriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#A0522D',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        flexGrow: 1,
        paddingHorizontal: width * 0.05,
        paddingTop: 20,
    },
    title: {
        fontSize: width * 0.07,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    dropdownButton: {
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownContent: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
        marginBottom: 10,
    },
    dropdownItem: {
        padding: 10,
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    datePickerButton: {
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    datePickerText: {
        fontSize: 16,
        color: '#333',
    },
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        paddingHorizontal: 40,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: width * 0.8,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default CostsReport;
