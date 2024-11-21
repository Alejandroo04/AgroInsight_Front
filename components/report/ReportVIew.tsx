import React from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

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

const ReportView: React.FC = () => {
    const route = useRoute<ReportViewRouteProp>();
    const { reportData } = route.params;

    const renderPlot = (plot: PlotFinancials) => (
        <View style={styles.plotContainer}>
            <Text style={styles.plotTitle}>Lote: {plot.lote_nombre}</Text>
            <Text style={styles.label}>Costo Total: ${plot.costo_total}</Text>
            <Text style={styles.label}>Ingreso Total: ${plot.ingreso_total}</Text>
            <Text style={styles.label}>Ganancia Neta: ${plot.ganancia_neta}</Text>

            <Text style={styles.sectionTitle}>Cultivos</Text>
            {plot.cultivos.map((crop) => (
                <View key={crop.cultivo_id} style={styles.cropContainer}>
                    <Text style={styles.label}>Variedad: {crop.variedad_maiz}</Text>
                    <Text style={styles.label}>Producción Total: {crop.produccion_total}</Text>
                    <Text style={styles.label}>Costo Total: ${crop.costo_total}</Text>
                    <Text style={styles.label}>Ganancia Neta: ${crop.ganancia_neta}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Informe Financiero de {reportData.finca_nombre}</Text>
                <Text style={styles.label}>Costo Total: ${reportData.costo_total}</Text>
                <Text style={styles.label}>Ingreso Total: ${reportData.ingreso_total}</Text>
                <Text style={styles.label}>Ganancia Neta: ${reportData.ganancia_neta}</Text>

                <Text style={styles.sectionTitle}>Lotes</Text>
                {reportData.lotes.map((plot) => renderPlot(plot))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContainer: { flexGrow: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 5 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    plotContainer: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
    cropContainer: { marginLeft: 10, marginTop: 10, padding: 10, backgroundColor: '#eef' },
    plotTitle: { fontSize: 18, fontWeight: 'bold' },
});

export default ReportView;
