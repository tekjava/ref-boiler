import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Payout } from '../types';

interface Props {
  payout: Payout;
}

export function PayoutRow({ payout }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.amount}>
        {formatAmount(payout.amount, payout.currency)}
      </Text>
      <View style={styles.right}>
        <StatusBadge status={payout.status} />
        <Text style={styles.date}>
          {new Date(payout.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: badgeColor(status) }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

function badgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':      return '#dcfce7';
    case 'pending':   return '#fef9c3';
    case 'processing': return '#dbeafe';
    case 'failed':
    case 'cancelled': return '#fee2e2';
    default:          return '#f3f4f6';
  }
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 15, fontWeight: '600', color: '#000' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: '#333',
  },
  date: { fontSize: 12, color: '#888' },
});
