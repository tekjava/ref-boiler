import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Commission } from '../types';

interface Props {
  commission: Commission;
}

export function CommissionRow({ commission }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.amount}>{commission.currency} {commission.amount}</Text>
      <Text style={styles.status}>{commission.status}</Text>
      <Text style={styles.date}>{new Date(commission.created_at).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  amount: { fontSize: 15, fontWeight: '500' },
  status: { fontSize: 13, color: '#888', textTransform: 'capitalize' },
  date: { fontSize: 13, color: '#888' },
});
