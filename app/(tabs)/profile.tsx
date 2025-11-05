
import React from "react";
import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Linking } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";

export default function ProfileScreen() {
  const router = useRouter();

  const openWhatsApp = () => {
    const phoneNumber = "263779925482";
    const message = "Hi! I need help with my account.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const menuItems = [
    {
      icon: 'person.circle.fill',
      title: 'Account Settings',
      subtitle: 'Manage your profile and preferences',
      onPress: () => console.log('Account Settings'),
    },
    {
      icon: 'bell.fill',
      title: 'Notifications',
      subtitle: 'Configure notification preferences',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: 'creditcard.fill',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => console.log('Payment Methods'),
    },
    {
      icon: 'clock.fill',
      title: 'Order History',
      subtitle: 'View all your past errands',
      onPress: () => router.push('/client-dashboard'),
    },
    {
      icon: 'questionmark.circle.fill',
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      onPress: openWhatsApp,
    },
    {
      icon: 'doc.text.fill',
      title: 'Terms & Privacy',
      subtitle: 'Read our terms and privacy policy',
      onPress: () => console.log('Terms & Privacy'),
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
        <View style={styles.contentWrapper}>
          {/* Profile Header */}
          <View style={[commonStyles.card, styles.profileHeader]}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <IconSymbol name="person.fill" size={48} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.userName}>Guest User</Text>
            <Text style={commonStyles.textSecondary}>guest@mrerrandsguy.com</Text>
            
            <Pressable 
              style={[buttonStyles.outline, styles.editButton]}
              onPress={() => console.log('Edit Profile')}
            >
              <IconSymbol name="pencil" size={18} color={colors.primary} />
              <Text style={commonStyles.buttonTextPrimary}>Edit Profile</Text>
            </Pressable>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={[commonStyles.card, styles.statCard]}>
              <IconSymbol name="shippingbox.fill" size={32} color={colors.primary} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Total Errands</Text>
            </View>
            <View style={[commonStyles.card, styles.statCard]}>
              <IconSymbol name="star.fill" size={32} color={colors.secondary} />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={[commonStyles.card, styles.statCard]}>
              <IconSymbol name="dollarsign.circle.fill" size={32} color={colors.primary} />
              <Text style={styles.statValue}>$156</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Settings</Text>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                style={[commonStyles.card, styles.menuItem]}
                onPress={item.onPress}
              >
                <View style={styles.menuIconContainer}>
                  <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
              </Pressable>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Pressable 
              style={[buttonStyles.whatsapp, styles.actionButton]}
              onPress={openWhatsApp}
            >
              <IconSymbol name="message.fill" size={20} color="#FFFFFF" />
              <Text style={commonStyles.buttonText}>Contact Support</Text>
            </Pressable>

            <Pressable 
              style={[buttonStyles.outline, styles.actionButton]}
              onPress={() => console.log('Logout')}
            >
              <IconSymbol name="arrow.right.square.fill" size={20} color={colors.error} />
              <Text style={[commonStyles.buttonTextPrimary, { color: colors.error }]}>
                Logout
              </Text>
            </Pressable>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>Mr Errands Guy v1.0.0</Text>
            <Text style={commonStyles.textSecondary}>
              {Platform.OS === 'web' ? 'Web Version' : `${Platform.OS.charAt(0).toUpperCase() + Platform.OS.slice(1)} Version`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      maxWidth: 1200,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 20 : Platform.OS === 'web' ? 40 : 100,
  },
  contentWrapper: {
    padding: 20,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 4px 12px rgba(128, 0, 128, 0.2)' }
      : { elevation: 4 }),
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  editButton: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    minWidth: 150,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    ...(Platform.OS === 'web' && {
      justifyContent: 'center',
      flexWrap: 'wrap',
    }),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    minWidth: Platform.OS === 'web' ? 150 : undefined,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionsSection: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    gap: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
});
