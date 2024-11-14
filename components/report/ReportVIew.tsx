// ReportView.tsx
import React from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

type Lote = {
    lote_id: number;
    lote_nombre: string;
    costo_cultivos: string;
    costo_tareas: string;
    costo_total: string;
    ganancia_neta: string;
    ingreso_total: string;
    cultivos: any[];
    tareas: any[];
};

type ReportData = {
    finca_nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    costo_total: string;
    ingreso_total: string;
    ganancia_neta: string;
    lotes: Lote[];
};

type ReportViewRouteProp = RouteProp<{ params: { reportData: ReportData } }, 'params'>;

const ReportView: React.FC = () => {
    const route = useRoute<ReportViewRouteProp>();
    const { reportData } = route.params;

    // Función para generar el PDF
    const generatePDF = async () => {
        const htmlContent = `
            <h1>Financial Report for ${reportData.finca_nombre}</h1>
            <p><strong>Period:</strong> ${reportData.fecha_inicio} - ${reportData.fecha_fin}</p>
            <p><strong>Total Cost:</strong> $${reportData.costo_total}</p>
            <p><strong>Total Income:</strong> $${reportData.ingreso_total}</p>
            <p><strong>Net Profit:</strong> $${reportData.ganancia_neta}</p>
            <h2>Lotes</h2>
            ${reportData.lotes
                .map(
                    (lote) => `
                        <p><strong>Lote Name:</strong> ${lote.lote_nombre}</p>
                        <p><strong>Cultivos Cost:</strong> $${lote.costo_cultivos}</p>
                        <p><strong>Tareas Cost:</strong> $${lote.costo_tareas}</p>
                        <p><strong>Total Cost:</strong> $${lote.costo_total}</p>
                        <p><strong>Total Income:</strong> $${lote.ingreso_total}</p>
                        <p><strong>Net Profit:</strong> $${lote.ganancia_neta}</p>
                        <hr/>
                    `
                )
                .join('')}
        `;
        const options = { html: htmlContent, fileName: 'financial_report', directory: 'Documents' };
        const file = await RNHTMLtoPDF.convert(options);
        Alert.alert('PDF Generated', `PDF saved at: ${file.filePath}`);
    };

    // Función para exportar a CSV
    const exportToCSV = async () => {
        const csvContent = [
            'Lote Name,Cultivos Cost,Tareas Cost,Total Cost,Total Income,Net Profit',
            ...reportData.lotes.map(lote =>
                `${lote.lote_nombre},${lote.costo_cultivos},${lote.costo_tareas},${lote.costo_total},${lote.ingreso_total},${lote.ganancia_neta}`
            )
        ].join('\n');
        const filePath = `${RNFS.DocumentDirectoryPath}/financial_report.csv`;
        await RNFS.writeFile(filePath, csvContent, 'utf8');
        Alert.alert('CSV Generated', `CSV saved at: ${filePath}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Financial Report for {reportData.finca_nombre}</Text>

                {/* Basic Farm Info */}
                <View style={styles.section}>
                    <Text style={styles.label}>Farm Name:</Text>
                    <Text style={styles.value}>{reportData.finca_nombre}</Text>
                    <Text style={styles.label}>Report Period:</Text>
                    <Text style={styles.value}>
                        {reportData.fecha_inicio} - {reportData.fecha_fin}
                    </Text>
                    <Text style={styles.label}>Total Cost:</Text>
                    <Text style={styles.value}>${reportData.costo_total}</Text>
                    <Text style={styles.label}>Total Income:</Text>
                    <Text style={styles.value}>${reportData.ingreso_total}</Text>
                    <Text style={styles.label}>Net Profit:</Text>
                    <Text style={styles.value}>${reportData.ganancia_neta}</Text>
                </View>

                {/* Lote Information */}
                <Text style={styles.sectionTitle}>Lotes</Text>
                <FlatList
                    data={reportData.lotes}
                    keyExtractor={(item) => item.lote_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.label}>Lote Name:</Text>
                            <Text style={styles.value}>{item.lote_nombre}</Text>
                            <Text style={styles.label}>Cultivos Cost:</Text>
                            <Text style={styles.value}>${item.costo_cultivos}</Text>
                            <Text style={styles.label}>Tareas Cost:</Text>
                            <Text style={styles.value}>${item.costo_tareas}</Text>
                            <Text style={styles.label}>Total Cost:</Text>
                            <Text style={styles.value}>${item.costo_total}</Text>
                            <Text style={styles.label}>Total Income:</Text>
                            <Text style={styles.value}>${item.ingreso_total}</Text>
                            <Text style={styles.label}>Net Profit:</Text>
                            <Text style={styles.value}>${item.ganancia_neta}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.noDataText}>No lote data available</Text>}
                />

                {/* Botones de descarga */}
                <View style={styles.buttonContainer}>
                    <Button title="Download PDF" onPress={generatePDF} />
                    <Button title="Download CSV" onPress={exportToCSV} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 20 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
    item: { marginBottom: 15, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 5 },
    label: { fontWeight: 'bold' },
    value: { marginBottom: 5 },
    noDataText: { textAlign: 'center', color: '#666', marginTop: 20 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
});

export default ReportView;
