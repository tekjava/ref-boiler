import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useReferralLinks } from '../../../hooks/useAffiliate';
import { QRDisplay } from '../../../components/QRDisplay';
import type { ReferralLink } from '../../../types';

export default function QRScreen() {
  // Step 1: fetch referral link from /affiliate/referral-links
  const linksQ = useReferralLinks();
  const qrRef = useRef<View>(null);
  const [capturing, setCapturing] = useState(false);

  const links = (linksQ.data as ReferralLink[]) ?? [];
  const referralUrl = links[0]?.url ?? '';

  // ─── Capture helper ────────────────────────────────────────────────────────

  async function captureQR(): Promise<string> {
    if (!qrRef.current) throw new Error('QR ref not ready');
    return captureRef(qrRef, { format: 'png', quality: 1 });
  }

  // ─── Step 3: share link as URL ─────────────────────────────────────────────

  async function handleShareLink() {
    try {
      await Share.share({ url: referralUrl, message: referralUrl });
    } catch {
      // User cancelled — no-op
    }
  }

  // ─── Step 3: share QR as image ─────────────────────────────────────────────

  async function handleShareQRImage() {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Not supported', 'Image sharing is not available on this device.');
      return;
    }
    setCapturing(true);
    try {
      const uri = await captureQR();
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your QR code',
        UTI: 'public.png',
      });
    } catch {
      Alert.alert('Error', 'Could not share the QR code image.');
    } finally {
      setCapturing(false);
    }
  }

  // ─── Step 4: save to photos ────────────────────────────────────────────────

  async function handleSaveToPhotos() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Allow photo library access in Settings to save your QR code.',
      );
      return;
    }
    setCapturing(true);
    try {
      const uri = await captureQR();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved', 'QR code saved to your photo library.');
    } catch {
      Alert.alert('Error', 'Could not save the QR code.');
    } finally {
      setCapturing(false);
    }
  }

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (linksQ.isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  // ─── Error / empty state ───────────────────────────────────────────────────

  if (linksQ.error || !referralUrl) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {linksQ.error ? 'Failed to load referral link' : 'No referral link found'}
          </Text>
          {linksQ.error ? (
            <Pressable style={styles.retryButton} onPress={() => linksQ.refetch()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main content ──────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Your QR code</Text>
        <Text style={styles.subheading}>Scan to follow your referral link</Text>

        {/* Step 2: QR rendered inside a captured ref */}
        <View
          ref={qrRef}
          collapsable={false}
          style={styles.qrContainer}
        >
          <QRDisplay url={referralUrl} size={240} />
        </View>

        <Text style={styles.urlText} numberOfLines={2} selectable>
          {referralUrl}
        </Text>

        {/* Step 3: share sheet — link as URL */}
        <Pressable style={styles.primaryButton} onPress={handleShareLink}>
          <Text style={styles.primaryButtonText}>Share link</Text>
        </Pressable>

        {/* Step 3: share sheet — QR as image */}
        <Pressable
          style={[styles.secondaryButton, capturing && styles.buttonDisabled]}
          onPress={handleShareQRImage}
          disabled={capturing}
        >
          {capturing ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.secondaryButtonText}>Share QR image</Text>
          )}
        </Pressable>

        {/* Step 4: save to photos */}
        <Pressable
          style={[styles.ghostButton, capturing && styles.buttonDisabled]}
          onPress={handleSaveToPhotos}
          disabled={capturing}
        >
          <Text style={styles.ghostButtonText}>Save to photos</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  scroll: { padding: 24, alignItems: 'center', gap: 16 },

  heading: { fontSize: 22, fontWeight: '700', color: '#000', alignSelf: 'flex-start' },
  subheading: { fontSize: 14, color: '#888', alignSelf: 'flex-start', marginTop: -8 },

  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  urlText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  secondaryButton: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#000', fontSize: 15, fontWeight: '600' },

  ghostButton: {
    width: '100%',
    padding: 14,
    alignItems: 'center',
  },
  ghostButtonText: { color: '#888', fontSize: 14 },

  buttonDisabled: { opacity: 0.4 },

  errorText: { fontSize: 16, color: '#333', textAlign: 'center' },
  retryButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryButtonText: { fontSize: 14, fontWeight: '600', color: '#000' },
});
