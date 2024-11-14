// ReportView.tsx
import React from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

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

    const generatePDF = async () => {
        try {
            const htmlContent = `
                <h1>Informe Financiero de ${reportData.finca_nombre}</h1>
                <p><strong>Periodo:</strong> ${reportData.fecha_inicio} - ${reportData.fecha_fin}</p>
                <p><strong>Costo Total:</strong> $${reportData.costo_total}</p>
                <p><strong>Ingreso Total:</strong> $${reportData.ingreso_total}</p>
                <p><strong>Ganancia Neta:</strong> $${reportData.ganancia_neta}</p>
                <h2>Lotes</h2>
                ${reportData.lotes
                    .map(
                        (lote) => `
                            <p><strong>Nombre del Lote:</strong> ${lote.lote_nombre}</p>
                            <p><strong>Costo de Cultivos:</strong> $${lote.costo_cultivos}</p>
                            <p><strong>Costo de Tareas:</strong> $${lote.costo_tareas}</p>
                            <p><strong>Costo Total:</strong> $${lote.costo_total}</p>
                            <p><strong>Ingreso Total:</strong> $${lote.ingreso_total}</p>
                            <p><strong>Ganancia Neta:</strong> $${lote.ganancia_neta}</p>
                            <hr/>
                        `
                    )
                    .join('')}
            `;

            // Genera el PDF con expo-print
            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Mueve el archivo PDF a la carpeta de documentos
            const pdfFilePath = `${FileSystem.documentDirectory}informe_financiero.pdf`;
            await FileSystem.moveAsync({
                from: uri,
                to: pdfFilePath,
            });

            // Verifica si el dispositivo soporta la función de compartir
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(pdfFilePath);
            } else {
                Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
            }
        } catch (error) {
            console.error("Error generando PDF:", error);
            Alert.alert('Error', 'Hubo un problema al generar el PDF.');
        }
    };

    const exportToCSV = async () => {
        const csvContent = [
            'Nombre del Lote,Costo de Cultivos,Costo de Tareas,Costo Total,Ingreso Total,Ganancia Neta',
            ...reportData.lotes.map(lote =>
                `${lote.lote_nombre},${lote.costo_cultivos},${lote.costo_tareas},${lote.costo_total},${lote.ingreso_total},${lote.ganancia_neta}`
            )
        ].join('\n');

        const filePath = `${FileSystem.documentDirectory}informe_financiero.csv`;
        await FileSystem.writeAsStringAsync(filePath, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

        // Usa Sharing para abrir el diálogo de compartir
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filePath);
        } else {
            Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Informe Financiero de {reportData.finca_nombre}</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Nombre de la Finca:</Text>
                    <Text style={styles.value}>{reportData.finca_nombre}</Text>
                    <Text style={styles.label}>Periodo del Reporte:</Text>
                    <Text style={styles.value}>
                        {reportData.fecha_inicio} - {reportData.fecha_fin}
                    </Text>
                    <Text style={styles.label}>Costo Total:</Text>
                    <Text style={styles.value}>${reportData.costo_total}</Text>
                    <Text style={styles.label}>Ingreso Total:</Text>
                    <Text style={styles.value}>${reportData.ingreso_total}</Text>
                    <Text style={styles.label}>Ganancia Neta:</Text>
                    <Text style={styles.value}>${reportData.ganancia_neta}</Text>
                </View>

                <Text style={styles.sectionTitle}>Lotes</Text>
                <FlatList
                    data={reportData.lotes}
                    keyExtractor={(item) => item.lote_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.label}>Nombre del Lote:</Text>
                            <Text style={styles.value}>{item.lote_nombre}</Text>
                            <Text style={styles.label}>Costo de Cultivos:</Text>
                            <Text style={styles.value}>${item.costo_cultivos}</Text>
                            <Text style={styles.label}>Costo de Tareas:</Text>
                            <Text style={styles.value}>${item.costo_tareas}</Text>
                            <Text style={styles.label}>Costo Total:</Text>
                            <Text style={styles.value}>${item.costo_total}</Text>
                            <Text style={styles.label}>Ingreso Total:</Text>
                            <Text style={styles.value}>${item.ingreso_total}</Text>
                            <Text style={styles.label}>Ganancia Neta:</Text>
                            <Text style={styles.value}>${item.ganancia_neta}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.noDataText}>No hay datos de lotes disponibles</Text>}
                />

                <View style={styles.buttonContainer}>
                    <Button title="Descargar PDF" onPress={generatePDF} />
                    <Button title="Descargar CSV" onPress={exportToCSV} />
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
