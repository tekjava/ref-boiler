import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useCommissions } from '../../../hooks/useCommissions';
import { usePayouts } from '../../../hooks/usePayouts';
import { CommissionRow } from '../../../components/CommissionRow';
import { PayoutRow } from '../../../components/PayoutRow';
import type { Commission, Payout } from '../../../types';

type Segment = 'commissions' | 'payouts';

export default function EarningsScreen() {
  const [segment, setSegment] = useState<Segment>('commissions');
  const [refreshing, setRefreshing] = useState(false);

  // Steps 1 & 2: both queries fire on mount simultaneously so tab-switching is instant
  const commissionsQ = useCommissions();
  const payoutsQ = usePayouts();

  const activeQ = segment === 'commissions' ? commissionsQ : payoutsQ;

  // Spinner while either list is on its initial load
  const loading = commissionsQ.isLoading || payoutsQ.isLoading;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await activeQ.refetch();
    } finally {
      setRefreshing(false);
    }
  }, [activeQ]);

  const commissions = (commissionsQ.data as Commission[]) ?? [];
  const payouts     = (payoutsQ.data   as Payout[])      ?? [];

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  );

  return (
    <SafeAreaView style={styles.safe}>

      {/* Step 3: segment control */}
      <View style={styles.segmentBar}>
        <SegmentPill
          label="Commissions"
          active={segment === 'commissions'}
          onPress={() => setSegment('commissions')}
        />
        <SegmentPill
          label="Payouts"
          active={segment === 'payouts'}
          onPress={() => setSegment('payouts')}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : activeQ.error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load {segment}</Text>
          <Pressable style={styles.retryButton} onPress={() => activeQ.refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : segment === 'commissions' ? (
        /* Step 4: commission rows — amount, status, date, referral email */
        <FlatList<Commission>
          data={commissions}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <CommissionRow commission={item} />}
          refreshControl={refreshControl}
          ListEmptyComponent={<EmptyState message="No commissions yet" />}
          contentContainerStyle={styles.list}
        />
      ) : (
        /* Step 4: payout rows — amount, status, date */
        <FlatList<Payout>
          data={payouts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PayoutRow payout={item} />}
          refreshControl={refreshControl}
          ListEmptyComponent={<EmptyState message="No payouts yet" />}
          contentContainerStyle={styles.list}
        />
      )}

    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SegmentPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },

  segmentBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  pillActive: { backgroundColor: '#000' },
  pillText: { fontSize: 13, fontWeight: '500', color: '#666' },
  pillTextActive: { color: '#fff' },

  list: { paddingHorizontal: 20, flexGrow: 1 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: '#aaa' },

  errorText: { fontSize: 16, color: '#333' },
  retryButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryButtonText: { fontSize: 14, fontWeight: '600', color: '#000' },
});
