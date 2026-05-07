import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  url: string;
}

export function QRDisplay({ url }: Props) {
  return (
    <View style={styles.container}>
      {/* react-native-qrcode-svg wired in RB-M004 */}
      <Text style={styles.placeholder}>{url}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  placeholder: { fontSize: 12, color: '#999', textAlign: 'center' },
});
