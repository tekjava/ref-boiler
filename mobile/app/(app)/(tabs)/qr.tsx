import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function QRScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>QR Code</Text>
        <Text style={styles.subtitle}>Referral QR wired in RB-M004</Text>
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
