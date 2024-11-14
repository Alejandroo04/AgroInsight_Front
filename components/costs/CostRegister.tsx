import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
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
import Header from '../Header';

const { width } = Dimensions.get('window');

const CostRegister: React.FC = () => {
    const [name, setName] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [workersCount, setWorkersCount] = useState('');
    const [useHours, setUseHours] = useState('');
    const [inputQuantity, setInputQuantity] = useState('');
    const [errors, setErrors] = useState({});
    const route = useRoute();
    const navigation = useNavigation();
    const { token, id, farmId } = route.params as { token: string, farmId: number, id: number };

    const [categories, setCategories] = useState([]);
    const [inputs, setInputs] = useState([]);
    const [machinery, setMachinery] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedInput, setSelectedInput] = useState(null);
    const [selectedMachinery, setSelectedMachinery] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Dropdown visibility states
    const [isMachineryDropdownVisible, setMachineryDropdownVisible] = useState(false);
    const [isCategoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
    const [isInputDropdownVisible, setInputDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get('https://agroinsight-backend-production.up.railway.app/input-categories', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(categoriesResponse.data.categories);

                const inputsResponse = await axios.get('https://agroinsight-backend-production.up.railway.app/agricultural-inputs', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInputs(inputsResponse.data.inputs);

                const machineryResponse = await axios.get('https://agroinsight-backend-production.up.railway.app/agricultural-machinery', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMachinery(machineryResponse.data.machinery);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [token]);

    const registerCosts = async () => {
        try {
            const laborCost = {
                cantidad_trabajadores: Number(workersCount),
                horas_trabajadas: Number(hoursWorked),
                costo_hora: Number(name),
                observaciones: "Trabajo manual"
            };

            const inputData = selectedInput
                ? [{
                    insumo_id: selectedInput.id,
                    cantidad_utilizada: Number(inputQuantity),
                    fecha_aplicacion: new Date().toISOString().split('T')[0],
                    observaciones: "Uso de insumos"
                }]
                : [];

            const machineryData = selectedMachinery
                ? [{
                    maquinaria_id: selectedMachinery.id,
                    fecha_uso: new Date().toISOString().split('T')[0],
                    horas_uso: Number(useHours),
                    observaciones: "Uso de maquinaria"
                }]
                : [];

            const requestData = {
                labor_cost: laborCost,
                inputs: inputData,
                machinery: machineryData,
            };

            const response = await axios.post(
                `https://agroinsight-backend-production.up.railway.app/farms/${farmId}/tasks/${id}/costs`,
                requestData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setModalMessage('Costos registrados exitosamente');
            setModalVisible(true);
            // Redirigir a la vista anterior después de mostrar el mensaje de éxito por un momento
            setTimeout(() => {
                setModalVisible(false);
                navigation.goBack();
            }, 2000); // Espera 2 segundos antes de volver a la vista anterior
        } catch (error) {
            console.error('Error registrando los costos:', error);
            setModalMessage('Error al registrar los costos');
            setModalVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.formContainer}>
                <Text style={styles.title}>Registro de costos</Text>

                <Text style={styles.descriptionTitle}>Costo de mano de obra</Text>

                <Text style={styles.label}>* Costo por hora</Text>
                <TextInput
                    style={[styles.input, !!errors.name && styles.errorInput]}
                    placeholder="Ingresa el costo por hora"
                    value={name}
                    onChangeText={setName}
                    keyboardType="numeric"
                />
                <Text style={styles.label}>* Horas trabajadas</Text>
                <TextInput
                    style={[styles.input, !!errors.hoursWorked && styles.errorInput]}
                    placeholder="Ingresa el # de horas trabajadas"
                    value={hoursWorked}
                    onChangeText={setHoursWorked}
                    keyboardType="numeric"
                />
                <Text style={styles.label}>* Número de trabajadores</Text>
                <TextInput
                    style={[styles.input, !!errors.workersCount && styles.errorInput]}
                    placeholder="Ingresa el # de trabajadores"
                    value={workersCount}
                    keyboardType="numeric"
                    onChangeText={setWorkersCount}
                />

                <Text style={styles.descriptionTitle}>Maquinaria Agrícola</Text>

                <Text style={styles.label}>Máquina</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setMachineryDropdownVisible(!isMachineryDropdownVisible)}
                >
                    <Text style={styles.dropdownText}>{selectedMachinery ? selectedMachinery.nombre : 'Seleccione la maquinaria'}</Text>
                    <Ionicons name="chevron-down" size={24} color="#333" />
                </TouchableOpacity>

                {isMachineryDropdownVisible && (
                    <View style={styles.dropdownContent}>
                        {machinery.map((machine) => (
                            <TouchableOpacity
                                key={machine.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedMachinery(machine);
                                    setMachineryDropdownVisible(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{machine.nombre}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Horas de uso</Text>
                <TextInput
                    style={[styles.input, !!errors.useHours && styles.errorInput]}
                    placeholder="Ingresa el # de horas de uso"
                    value={useHours}
                    keyboardType="numeric"
                    onChangeText={setUseHours}
                />

                <Text style={styles.descriptionTitle}>Insumos Agrícolas</Text>

                <Text style={styles.label}>Categoría</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setCategoryDropdownVisible(!isCategoryDropdownVisible)}
                >
                    <Text style={styles.dropdownText}>{selectedCategory ? selectedCategory.nombre : 'Seleccione la categoría'}</Text>
                    <Ionicons name="chevron-down" size={24} color="#333" />
                </TouchableOpacity>

                {isCategoryDropdownVisible && (
                    <View style={styles.dropdownContent}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedCategory(category);
                                    setCategoryDropdownVisible(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{category.nombre}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Producto</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setInputDropdownVisible(!isInputDropdownVisible)}
                >
                    <Text style={styles.dropdownText}>{selectedInput ? selectedInput.nombre : 'Seleccione el producto'}</Text>
                    <Ionicons name="chevron-down" size={24} color="#333" />
                </TouchableOpacity>

                {isInputDropdownVisible && (
                    <View style={styles.dropdownContent}>
                        {inputs.map((input) => (
                            <TouchableOpacity
                                key={input.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedInput(input);
                                    setInputDropdownVisible(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{input.nombre}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Cantidad</Text>
                <TextInput
                    style={[styles.input, !!errors.inputQuantity && styles.errorInput]}
                    placeholder="Ingresa la cantidad"
                    value={inputQuantity}
                    keyboardType="numeric"
                    onChangeText={setInputQuantity}
                />

                <TouchableOpacity style={styles.createButton} onPress={registerCosts}>
                    <Text style={styles.createButtonText}>Registrar costos</Text>
                </TouchableOpacity>
            </ScrollView>

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
    input: {
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        fontSize: 16,
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
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    errorInput: {
        borderColor: 'red',
        borderWidth: 1,
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

export default CostRegister;
