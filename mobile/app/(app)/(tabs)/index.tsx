import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useAffiliate, useReports, useReferralLinks } from '../../../hooks/useAffiliate';
import { AffiliateCard } from '../../../components/AffiliateCard';
import type { Promoter, ReferralLink, Report } from '../../../types';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // Step 1: fetch /affiliate/me and /affiliate/reports on mount
  // /affiliate/referral-links also fetched here to power the copy button (step 3)
  const affiliateQ = useAffiliate();
  const reportsQ = useReports();
  const linksQ = useReferralLinks();

  const loading = affiliateQ.isLoading || reportsQ.isLoading || linksQ.isLoading;
  const error = affiliateQ.error ?? reportsQ.error ?? linksQ.error;

  // Step 4: pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        affiliateQ.refetch(),
        reportsQ.refetch(),
        linksQ.refetch(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [affiliateQ, reportsQ, linksQ]);

  // Step 5: loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  // Step 5: error state
  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load dashboard</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              affiliateQ.refetch();
              reportsQ.refetch();
              linksQ.refetch();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const promoter = affiliateQ.data as Promoter;
  const report = reportsQ.data as Report;
  const links = (linksQ.data as ReferralLink[]) ?? [];
  const referralUrl = links[0]?.url ?? '';

  // Balance is keyed by currency code, e.g. { usd: 150.00 }
  const [[currencyCode = 'USD', balance = 0] = []] = Object.entries(
    promoter.current_balance ?? {},
  );

  // Step 3: copy referral link
  async function handleCopyLink() {
    await Clipboard.setStringAsync(referralUrl);
    Alert.alert('Copied', 'Referral link copied to clipboard.');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Step 2: name */}
        <AffiliateCard promoter={promoter} />

        {/* Step 2: current balance, pending commissions, total referrals */}
        <View style={styles.statsRow}>
          <StatCard
            label="Balance"
            value={formatAmount(Number(balance), currencyCode.toUpperCase())}
          />
          <StatCard
            label="Referrals"
            value={String(report?.referrals ?? 0)}
          />
          <StatCard
            label="Commissions"
            value={formatAmount(report?.commissions ?? 0, currencyCode.toUpperCase())}
          />
        </View>

        {/* Step 3: referral link + copy button */}
        {referralUrl ? (
          <View style={styles.linkCard}>
            <Text style={styles.linkLabel}>Your referral link</Text>
            <Text style={styles.linkUrl} numberOfLines={2} selectable>
              {referralUrl}
            </Text>
            <Pressable style={styles.copyButton} onPress={handleCopyLink}>
              <Text style={styles.copyButtonText}>Copy link</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  scroll: { padding: 24, gap: 20 },

  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 16, fontWeight: '700', color: '#000' },
  statLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  linkCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  linkLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  linkUrl: { fontSize: 13, color: '#444', lineHeight: 18 },
  copyButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  copyButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },

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
