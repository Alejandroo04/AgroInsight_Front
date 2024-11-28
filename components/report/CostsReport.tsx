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
    TextInput,
    ViewStyle,
    Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../Header';
import { ProgressBar } from 'react-native-paper';

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

    const [plotId, setPlotId] = useState<number | null>(null);
    const [cropId, setCropId] = useState<number | null>(null);
    const [minCost, setMinCost] = useState<string>('');
    const [maxCost, setMaxCost] = useState<string>('');
    const [taskTypes, setTaskTypes] = useState<string>('');
    const [groupBy, setGroupBy] = useState<string>('none');
    const [onlyProfitable, setOnlyProfitable] = useState<boolean>(false);
    const [currency, setCurrency] = useState<string>('USD');

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
            setTimeout(() => setModalVisible(false), 2000);
            return;
        }

        try {
            const params = {
                farm_id: selectedFarm.id,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                plot_id: plotId,
                crop_id: cropId,
                min_cost: minCost ? Number(minCost) : undefined,
                max_cost: maxCost ? Number(maxCost) : undefined,
                task_types: taskTypes,
                group_by: groupBy,
                only_profitable: onlyProfitable,
                currency: currency
            };

            console.log('Datos enviados al generar reporte:', params);

            const response = await axios.get(
                'https://agroinsight-backend-production.up.railway.app/reports/financial',
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params
                }
            );

            console.log('Respuesta del servidor:', response.data);
            
            const reportData = response.data;
            setModalMessage('Reporte generado exitosamente.');
            setTimeout(() => {
                setModalVisible(false);
                navigation.navigate('ReportView', { reportData });
            }, 2000);
        } catch (error) {
            console.error("Error generating report", error);
            setModalMessage('Error al generar el reporte financiero.');
            setModalVisible(true);
        }
    };

    const groupByOptions = [
        { id: 'none', name: 'Sin agrupación' },
        { id: 'task_type', name: 'Tipo de tarea' },
        { id: 'month', name: 'Mes' },
        { id: 'cost_type', name: 'Tipo de costo' }
    ];

    const taskTypeOptions = [
        { id: '', name: 'Seleccione un tipo de tarea' },
        { id: '16', name: 'Monitoreo fitosanitario' },
        { id: '4', name: 'Riego' },
        { id: '2', name: 'Siembra' },
        { id: '6', name: 'Control de maleza' },
        { id: '37', name: 'Análisis de suelo' }
    ];

    const currencyOptions = [
        { id: 'USD', name: 'USD - Dólar Estadounidense' },
        { id: 'COP', name: 'COP - Peso Colombiano' },
        { id: 'EUR', name: 'EUR - Euro' }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView 
                contentContainerStyle={styles.formContainer}
            >
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

                <Text style={styles.sectionTitle}>Filtros adicionales</Text>

                <Text style={styles.label}>Costo mínimo</Text>
                <TextInput
                    style={styles.input}
                    value={minCost}
                    onChangeText={setMinCost}
                    keyboardType="numeric"
                    placeholder="Ingrese costo mínimo"
                />

                <Text style={styles.label}>Costo máximo</Text>
                <TextInput
                    style={styles.input}
                    value={maxCost}
                    onChangeText={setMaxCost}
                    keyboardType="numeric"
                    placeholder="Ingrese costo máximo"
                />
                <Text style={styles.label}>Tipos de tarea</Text>
                <Picker
                    selectedValue={taskTypes}
                    onValueChange={setTaskTypes}
                    style={styles.picker}
                >
                    {taskTypeOptions.map(option => (
                        <Picker.Item
                            key={option.id}
                            label={option.name}
                            value={option.id}
                        />
                    ))}
                </Picker>

                <Text style={styles.label}>Agrupar por</Text>
                <Picker
                    selectedValue={groupBy}
                    onValueChange={(itemValue) => setGroupBy(itemValue)}
                    style={styles.picker}
                >
                    {groupByOptions.map(option => (
                        <Picker.Item 
                            key={option.id} 
                            label={option.name} 
                            value={option.id} 
                        />
                    ))}
                </Picker>
                <View style={styles.checkboxContainer}>
                    <Switch
                        value={onlyProfitable}
                        onValueChange={setOnlyProfitable}
                    />
                    <Text style={styles.checkboxLabel}>Solo mostrar rentables</Text>
                </View>

                <Text style={styles.label}>Moneda</Text>
                <Picker
                    selectedValue={currency}
                    onValueChange={(itemValue) => setCurrency(itemValue)}
                    style={styles.picker}
                >
                    {currencyOptions.map(option => (
                        <Picker.Item 
                            key={option.id} 
                            label={option.name} 
                            value={option.id} 
                        />
                    ))}
                </Picker>

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
    } as ViewStyle,
    formContainer: {
        flexGrow: 1,
        paddingHorizontal: width * 0.05,
        paddingTop: 20,
    } as ViewStyle,
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
    input: {
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    multiSelect: {
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        borderRadius: 10,
    },
    picker: {
        backgroundColor: '#f2f2f2',
        marginBottom: 10,
        borderRadius: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    plotCard: {
        marginBottom: 16,
        elevation: 4,
    },
    plotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    progressContainer: {
        marginVertical: 8,
    },
    progressLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    plotStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    maintenanceSection: {
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    subLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    maintenanceValue: {
        fontSize: 16,
        fontWeight: '600',
    }
}) ;

export default CostsReport;
