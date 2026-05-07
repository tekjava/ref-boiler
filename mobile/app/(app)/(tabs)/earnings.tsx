import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function EarningsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Earnings</Text>
        <Text style={styles.subtitle}>Commissions and payouts wired in RB-M005</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { marginTop: 8, color: '#888', fontSize: 14 },
});
