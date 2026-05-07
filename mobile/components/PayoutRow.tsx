import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Payout } from '../types';

interface Props {
  payout: Payout;
}

export function PayoutRow({ payout }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.amount}>{payout.currency} {payout.amount}</Text>
      <Text style={styles.status}>{payout.status}</Text>
      <Text style={styles.date}>{new Date(payout.created_at).toLocaleDateString()}</Text>
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
