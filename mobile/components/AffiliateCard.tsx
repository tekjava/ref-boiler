import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Promoter } from '../types';

interface Props {
  promoter: Promoter;
}

export function AffiliateCard({ promoter }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{promoter.first_name} {promoter.last_name}</Text>
      <Text style={styles.email}>{promoter.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  name: { fontSize: 18, fontWeight: '600' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
});
