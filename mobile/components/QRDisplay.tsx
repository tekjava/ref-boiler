import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Props {
  url: string;
  size?: number;
}

export function QRDisplay({ url, size = 240 }: Props) {
  return (
    <View style={styles.container}>
      <QRCode
        value={url}
        size={size}
        color="#000000"
        backgroundColor="#ffffff"
        ecl="M"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    // White padding ensures the QR has quiet zone even when captured
    margin: 4,
  },
});
