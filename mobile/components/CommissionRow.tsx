import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Commission } from '../types';

interface Props {
  commission: Commission;
}

export function CommissionRow({ commission }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.amount}>
          {formatAmount(commission.amount, commission.currency)}
        </Text>
        {commission.lead?.email ? (
          <Text style={styles.referral} numberOfLines={1}>
            {commission.lead.email}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        <StatusBadge status={commission.status} />
        <Text style={styles.date}>
          {new Date(commission.created_at).toLocaleDateString()}
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
    case 'approved': return '#dbeafe';
    case 'paid':     return '#dcfce7';
    case 'pending':  return '#fef9c3';
    case 'declined':
    case 'cancelled': return '#fee2e2';
    default:         return '#f3f4f6';
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
  left: { flex: 1, gap: 4 },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 15, fontWeight: '600', color: '#000' },
  referral: { fontSize: 12, color: '#888', maxWidth: 200 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: '#333',
  },
  date: { fontSize: 12, color: '#888' },
});
