import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Linking, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Card, ProgressBar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';

type TaskCost = {
    tarea_id: number;
    tarea_nombre: string;
    tipo_labor_nombre: string;
    nivel: 'LOTE' | 'CULTIVO' | 'AGRUPADO';
    fecha: string;
    costo_mano_obra: number;
    costo_insumos: number;
    costo_maquinaria: number;
    costo_total: number;
    observaciones?: string;
};

type CropFinancials = {
    cultivo_id: number;
    variedad_maiz: string;
    fecha_siembra: string;
    fecha_cosecha: string;
    produccion_total: number;
    cantidad_vendida: number;
    precio_venta_unitario: number;
    ingreso_total: number;
    costo_produccion: number;
    tareas_cultivo: TaskCost[];
    costo_total: number;
    ganancia_neta: number;
};

type PlotFinancials = {
    lote_id: number;
    lote_nombre: string;
    cultivos: CropFinancials[];
    tareas_lote: TaskCost[];
    costo_mantenimiento_base: number;
    costo_tareas: number;
    costo_cultivos: number;
    costo_total: number;
    ingreso_total: number;
    ganancia_neta: number;
};

type ReportData = {
    finca_id: number;
    finca_nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    moneda: string;
    lotes: PlotFinancials[];
    costo_total: number;
    ingreso_total: number;
    ganancia_neta: number;
};

type ReportViewRouteProp = RouteProp<{ params: { reportData: ReportData } }, 'params'>;

const { width } = Dimensions.get('window');

const ReportView: React.FC = () => {
    const route = useRoute<ReportViewRouteProp>();
    const { reportData } = route.params;
    const [loading, setLoading] = useState(false);
    const chartRef = useRef();

    const formatCurrency = (amount: string | number) => {
        return `${reportData.moneda_simbolo} ${Number(amount).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const renderSummaryCard = () => (
        <Card style={styles.summaryCard}>
            <Card.Content>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Ionicons name="cash-outline" size={24} color="#4CAF50" />
                        <Text style={styles.summaryLabel}>Ingresos</Text>
                        <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                            {formatCurrency(reportData.ingreso_total)}
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Ionicons name="trending-down-outline" size={24} color="#FF5252" />
                        <Text style={styles.summaryLabel}>Costos</Text>
                        <Text style={[styles.summaryValue, { color: '#FF5252' }]}>
                            {formatCurrency(reportData.costo_total)}
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Ionicons name="bar-chart-outline" size={24} color="#2196F3" />
                        <Text style={styles.summaryLabel}>Ganancia</Text>
                        <Text style={[styles.summaryValue, { color: '#2196F3' }]}>
                            {formatCurrency(reportData.ganancia_neta)}
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    const renderPlotSection = () => (
        <>
            <Text style={styles.sectionTitle}>Detalles por Lote</Text>
            {reportData.lotes.map((lote) => (
                <Card key={lote.lote_id} style={styles.plotCard}>
                    <Card.Content>
                        <Text style={styles.plotTitle}>{lote.lote_nombre}</Text>
                        
                        {/* Corregir el cálculo del progreso */}
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressLabel}>Rentabilidad</Text>
                            <ProgressBar 
                                progress={
                                    parseFloat(lote.ingreso_total) > 0 
                                        ? parseFloat(lote.ganancia_neta) / parseFloat(lote.ingreso_total)
                                        : 0
                                }
                                color={parseFloat(lote.ganancia_neta) >= 0 ? '#4CAF50' : '#FF5252'}
                                style={styles.progressBar}
                            />
                        </View>

                        <View style={styles.plotStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Costos</Text>
                                <Text style={styles.statValue}>{formatCurrency(lote.costo_total)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Ingresos</Text>
                                <Text style={styles.statValue}>{formatCurrency(lote.ingreso_total)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Ganancia</Text>
                                <Text style={[
                                    styles.statValue,
                                    { color: lote.ganancia_neta >= 0 ? '#4CAF50' : '#FF5252' }
                                ]}>
                                    {formatCurrency(lote.ganancia_neta)}
                                </Text>
                            </View>
                        </View>

                        {/* Detalles de mantenimiento */}
                        <View style={styles.maintenanceSection}>
                            <Text style={styles.subLabel}>Costos de Mantenimiento</Text>
                            <Text style={styles.maintenanceValue}>
                                {formatCurrency(lote.costo_mantenimiento)}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </>
    );

    const renderTopResourcesSection = () => (
        <>
            <Text style={styles.sectionTitle}>Recursos más utilizados</Text>
            
            <Text style={styles.subsectionTitle}>Top Maquinaria</Text>
            {reportData.top_maquinaria.map((maq, index) => (
                <Card key={maq.maquinaria_id} style={styles.resourceCard}>
                    <Card.Content>
                        <View style={styles.resourceRow}>
                            <Text style={styles.resourceRank}>#{index + 1}</Text>
                            <View style={styles.resourceInfo}>
                                <Text style={styles.resourceName}>{maq.nombre}</Text>
                                <View style={styles.resourceDetails}>
                                    <Text style={styles.resourceDetail}>
                                        <Ionicons name="time-outline" size={14} color="#666" /> {Math.round(maq.total_horas_uso)} horas
                                    </Text>
                                    <Text style={styles.resourceDetail}>
                                        <Ionicons name="cash-outline" size={14} color="#666" /> {formatCurrency(maq.costo_total)}
                                    </Text>
                                    <Text style={styles.resourceDetail}>
                                        <Ionicons name="calculator-outline" size={14} color="#666" /> {formatCurrency(maq.costo_por_hora)}/hr
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            ))}

        </>
    );

    const renderCostDistributionPie = () => {
        const pieData = [
            {
                name: "Maquinaria",
                total: reportData.top_maquinaria.reduce((acc, maq) => acc + parseFloat(maq.costo_total), 0),
                color: "#FF9800"
            },
            {
                name: "Insumos",
                total: reportData.top_insumos.reduce((acc, ins) => acc + parseFloat(ins.costo_total), 0),
                color: "#4CAF50"
            }
        ];

        return (
            <Card style={styles.chartCard}>
                <Card.Title title="Distribución de Costos" />
                <Card.Content>
                    <PieChart
                        paddingLeft={15}
                        data={pieData.map(item => ({
                            name: item.name,
                            population: item.total,
                            color: item.color,
                            paddingLeft: "15",
                            legendFontColor: "#7F7F7F"
                        }))}
                        width={width - 60}
                        height={200}
                        chartConfig={{
                            backgroundColor: "#FFFFFF",
                            backgroundGradientFrom: "#FFFFFF",
                            backgroundGradientTo: "#FFFFFF",
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                    />
                </Card.Content>
            </Card>
        );
    };

    const renderResourceUsageBar = () => {
        // Gama de amarillos/naranjas
        const yellowColors = ['#FFA000', '#FFB300', '#FFC107', '#FFD54F', '#FFE082'];
        
        const sortedMaquinaria = [...reportData.top_maquinaria].sort((a, b) => 
            parseFloat(b.total_horas_uso) - parseFloat(a.total_horas_uso)
        );

        return (
            <Card style={styles.chartCard}>
                <Card.Title title="Uso de Maquinaria (Horas)" />
                <Card.Content>
                    {sortedMaquinaria.map((maq, index) => (
                        <View key={maq.maquinaria_id} style={styles.insumoBar}>
                            <Text style={styles.insumoName}>{maq.nombre}</Text>
                            <View style={styles.barContainer}>
                                <View 
                                    style={[
                                        styles.bar, 
                                        { 
                                            width: `${(parseFloat(maq.total_horas_uso) / Math.max(...sortedMaquinaria.map(m => parseFloat(m.total_horas_uso)))) * 100}%`,
                                            backgroundColor: yellowColors[index % yellowColors.length]
                                        }
                                    ]} 
                                />
                                <Text style={styles.insumoValue}>
                                    {`${maq.total_horas_uso} hrs`}
                                </Text>
                            </View>
                        </View>
                    ))}
                </Card.Content>
            </Card>
        );
    };

    const renderInsumosComparison = () => {
        // Gama de verdes
        const greenColors = ['#43A047', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9'];
        
        const sortedInsumos = [...reportData.top_insumos].sort((a, b) => 
            parseFloat(b.costo_total) - parseFloat(a.costo_total)
        );

        return (
            <Card style={styles.chartCard}>
                <Card.Title title="Top Insumos por Costo" />
                <Card.Content>
                    {sortedInsumos.map((insumo, index) => (
                        <View key={insumo.insumo_id} style={styles.insumoBar}>
                            <Text style={styles.insumoName}>{insumo.nombre}</Text>
                            <View style={styles.barContainer}>
                                <View 
                                    style={[
                                        styles.bar, 
                                        { 
                                            width: `${(parseFloat(insumo.costo_total) / Math.max(...sortedInsumos.map(i => parseFloat(i.costo_total)))) * 100}%`,
                                            backgroundColor: greenColors[index % greenColors.length]
                                        }
                                    ]} 
                                />
                                <Text style={styles.insumoValue}>
                                    {formatCurrency(insumo.costo_total)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </Card.Content>
            </Card>
        );
    };

    const renderExportSection = () => (
        <Card style={styles.exportCard}>
            <Card.Title 
                title="¿Necesitas un análisis más detallado?" 
                subtitle="Descarga el reporte completo en tu formato preferido"
            />
            <Card.Content>
                <Text style={styles.exportDescription}>
                    Incluye tablas detalladas con:
                </Text>
                <View style={styles.exportFeatures}>
                    <Text style={styles.exportFeatureItem}>• Análisis completo de costos por actividad</Text>
                    <Text style={styles.exportFeatureItem}>• Desglose detallado de insumos y maquinaria</Text>
                    <Text style={styles.exportFeatureItem}>• Indicadores de rendimiento por lote</Text>
                    <Text style={styles.exportFeatureItem}>• Comparativas históricas</Text>
                </View>
                <View style={styles.exportButtonsContainer}>
                    <TouchableOpacity 
                        style={[styles.exportButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => handleExport('excel')}
                    >
                        <Ionicons name="document-text-outline" size={24} color="white" />
                        <Text style={styles.exportButtonText}>CSV</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.exportButton, { backgroundColor: '#F44336' }]}
                        onPress={() => handleExport('pdf')}
                    >
                        <Ionicons name="document-outline" size={24} color="white" />
                        <Text style={styles.exportButtonText}>PDF</Text>
                    </TouchableOpacity>
                </View>
            </Card.Content>
        </Card>
    );

    const handleExport = async (type: 'excel' | 'pdf') => {
        try {
            // Mostrar loading
            setLoading(true);
            
            // Llamar a tu API para generar el reporte
            const response = await generateReport({
                reportId: reportData.id,
                format: type,
                dateRange: {
                    start: reportData.fecha_inicio,
                    end: reportData.fecha_fin
                }
            });
            
            // Descargar el archivo
            await Linking.openURL(response.downloadUrl);
            
            // Mostrar mensaje de éxito
            Alert.alert(
                'Éxito',
                `El reporte ha sido generado en formato ${type.toUpperCase()}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                'No se pudo generar el reporte. Por favor, intenta nuevamente.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = async (data) => {
        try {
            // Solicitar permisos en Android
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Error', 'Necesitamos permisos para guardar el PDF');
                    return;
                }
            }

            // Versión simplificada para probar
            const options = {
                html: `
                    <html>
                        <body>
                            <h1>Reporte de Prueba</h1>
                            <p>Fecha: ${new Date().toLocaleDateString()}</p>
                        </body>
                    </html>
                `,
                fileName: `reporte_${Date.now()}`,
                directory: 'Documents',
            };

            const file = await RNHTMLtoPDF.convert(options);
            console.log('PDF generado:', file); // Para debugging
            
            if (file.filePath) {
                Alert.alert('Éxito', `PDF guardado en: ${file.filePath}`);
            } else {
                throw new Error('No se generó la ruta del archivo');
            }

        } catch (error) {
            console.error('Error detallado:', error);
            Alert.alert('Error', 'No se pudo generar el PDF: ' + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>{reportData.finca_nombre}</Text>
                <Text style={styles.dateRange}>
                    {new Date(reportData.fecha_inicio).toLocaleDateString()} - 
                    {new Date(reportData.fecha_fin).toLocaleDateString()}
                </Text>
                <Text style={styles.generatedAt}>
                    Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
                
                {renderSummaryCard()}
                {renderCostDistributionPie()}
                {renderResourceUsageBar()}
                {renderInsumosComparison()}
                
                {renderPlotSection()}
                {renderTopResourcesSection()}
                {renderExportSection()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    dateRange: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    summaryCard: {
        marginBottom: 20,
        elevation: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginTop: 24,
    },
    subsectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        marginTop: 16,
    },
    resourceCard: {
        marginBottom: 8,
    },
    resourceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resourceRank: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        marginRight: 12,
        width: 30,
    },
    resourceInfo: {
        flex: 1,
    },
    resourceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    resourceDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
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
    },
    chartCard: {
        marginVertical: 10,
        elevation: 4,
    },
    insumoBar: {
        marginVertical: 8,
    },
    insumoName: {
        fontSize: 14,
        marginBottom: 4,
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
    },
    bar: {
        height: '100%',
        borderRadius: 4,
    },
    insumoValue: {
        marginLeft: 8,
        fontSize: 12,
        color: '#666',
    },
    exportCard: {
        marginTop: 24,
        marginBottom: 32,
        elevation: 4,
    },
    exportDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    exportFeatures: {
        marginBottom: 20,
    },
    exportFeatureItem: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        paddingLeft: 8,
    },
    exportButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
        justifyContent: 'center',
    },
    exportButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    resourceDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    generatedAt: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
        fontStyle: 'italic'
    },
});

export default ReportView;
