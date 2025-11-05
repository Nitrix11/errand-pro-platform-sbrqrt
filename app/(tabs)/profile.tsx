
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Linking } from "react-native";
import { colors, commonStyles } from "@/styles/commonStyles";
import { Stack, useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  const openWhatsApp = () => {
    const phoneNumber = "263779925482";
    const message = "Hi! I need help with Mr Errands Guy.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const menuItems = [
    {
      icon: "person.circle.fill",
      title: "About Us",
      description: "Learn more about Mr Errands Guy",
      onPress: () => console.log("About Us"),
    },
    {
      icon: "questionmark.circle.fill",
      title: "FAQ",
      description: "Frequently asked questions",
      onPress: () => console.log("FAQ"),
    },
    {
      icon: "doc.text.fill",
      title: "Terms & Conditions",
      description: "Read our terms of service",
      onPress: () => console.log("Terms"),
    },
    {
      icon: "message.fill",
      title: "Contact Support",
      description: "Get help via WhatsApp",
      onPress: openWhatsApp,
    },
  ];

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Profile",
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: '#FFFFFF',
          }}
        />
      )}
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={styles.profileName}>Mr Errands Guy</Text>
          <Text style={styles.profileTagline}>Your Trusted Errand Runner</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[commonStyles.card, styles.statCard]}>
            <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
            <Text style={styles.statValue}>100+</Text>
            <Text style={styles.statLabel}>Completed Errands</Text>
          </View>
          <View style={[commonStyles.card, styles.statCard]}>
            <IconSymbol name="star.fill" size={32} color={colors.warning} />
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index}
              style={[commonStyles.card, styles.menuItem]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <IconSymbol name={item.icon as any} size={28} color={colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* Contact Section */}
        <View style={[commonStyles.card, styles.contactCard]}>
          <IconSymbol name="phone.circle.fill" size={40} color={colors.secondary} />
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactDescription}>
            Contact us on WhatsApp for immediate assistance
          </Text>
          <Pressable 
            style={styles.whatsappButton}
            onPress={openWhatsApp}
          >
            <IconSymbol name="message.fill" size={20} color="#FFFFFF" />
            <Text style={styles.whatsappButtonText}>Chat on WhatsApp</Text>
          </Pressable>
          <Text style={styles.phoneNumber}>+263 779 925 482</Text>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Mr Errands Guy v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  profileTagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  contactCard: {
    marginHorizontal: 20,
    marginTop: 24,
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.highlight,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  whatsappButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
