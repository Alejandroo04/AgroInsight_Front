// ReportView.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

type ReportData = {
    entries: { description: string; amount: number }[];
};

type ReportViewRouteProp = RouteProp<{ params: { reportData: ReportData } }, 'params'>;

const ReportView: React.FC = () => {
    const route = useRoute<ReportViewRouteProp>();
    const { reportData } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Financial Report</Text>
            
            <FlatList
                data={reportData.entries}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.label}>Description:</Text>
                        <Text style={styles.value}>{item.description}</Text>
                        <Text style={styles.label}>Amount:</Text>
                        <Text style={styles.value}>${item.amount}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.noDataText}>No data available to display</Text>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 20 },
    item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    label: { fontWeight: 'bold' },
    value: { marginBottom: 5 },
    noDataText: { textAlign: 'center', color: '#666', marginTop: 20 },
});

export default ReportView;
