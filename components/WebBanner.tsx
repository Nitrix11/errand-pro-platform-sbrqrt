
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

export function WebBanner() {
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.banner}>
      <IconSymbol name="globe" size={20} color={colors.primary} />
      <Text style={styles.bannerText}>
        You&apos;re viewing the web version of Mr Errands Guy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.highlight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
