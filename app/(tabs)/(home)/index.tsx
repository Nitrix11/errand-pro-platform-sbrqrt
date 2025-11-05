
import React from "react";
import { Stack, useRouter } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, Linking } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";

export default function HomeScreen() {
  const router = useRouter();

  const openWhatsApp = () => {
    const phoneNumber = "263779925482";
    const message = "Hi! I'd like to request an errand service.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const features = [
    {
      icon: "location.fill",
      title: "Easy Pickup & Delivery",
      description: "Select your locations and we'll handle the rest",
      color: colors.primary,
    },
    {
      icon: "dollarsign.circle.fill",
      title: "Flexible Pricing",
      description: "Propose your price or accept our suggestion",
      color: colors.secondary,
    },
    {
      icon: "clock.fill",
      title: "Real-Time Updates",
      description: "Track your errand from start to finish",
      color: colors.primary,
    },
    {
      icon: "checkmark.circle.fill",
      title: "Reliable Service",
      description: "Professional errand runners you can trust",
      color: colors.secondary,
    },
  ];

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Mr Errands Guy",
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
        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <Text style={styles.heroTitle}>Mr Errands Guy</Text>
          <Text style={styles.heroSubtitle}>Your Trusted Errand Runner</Text>
          <Text style={styles.heroDescription}>
            Fast, reliable, and affordable errand services at your fingertips
          </Text>
        </LinearGradient>

        <View style={styles.contentWrapper}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Pressable 
              style={[buttonStyles.primary, styles.actionButton]}
              onPress={() => router.push('/booking')}
            >
              <IconSymbol name="plus.circle.fill" size={24} color="#FFFFFF" />
              <Text style={[commonStyles.buttonText, styles.actionButtonText]}>
                Request Errand
              </Text>
            </Pressable>

            <Pressable 
              style={[buttonStyles.whatsapp, styles.actionButton]}
              onPress={openWhatsApp}
            >
              <IconSymbol name="message.fill" size={24} color="#FFFFFF" />
              <Text style={[commonStyles.buttonText, styles.actionButtonText]}>
                WhatsApp Us
              </Text>
            </Pressable>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresSection}>
            <Text style={[commonStyles.subtitle, styles.sectionTitle]}>
              Why Choose Us?
            </Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={[commonStyles.card, styles.featureCard]}>
                  <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                    <IconSymbol name={feature.icon as any} size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* How It Works */}
          <View style={styles.howItWorksSection}>
            <Text style={[commonStyles.subtitle, styles.sectionTitle]}>
              How It Works
            </Text>
            <View style={commonStyles.card}>
              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Submit Your Request</Text>
                  <Text style={commonStyles.textSecondary}>
                    Fill in pickup and delivery details
                  </Text>
                </View>
              </View>

              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Propose Your Price</Text>
                  <Text style={commonStyles.textSecondary}>
                    Set your budget or accept our suggestion
                  </Text>
                </View>
              </View>

              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>We Accept & Deliver</Text>
                  <Text style={commonStyles.textSecondary}>
                    Track your errand in real-time
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Navigation Cards */}
          <View style={styles.navigationSection}>
            <Pressable 
              style={[commonStyles.card, styles.navCard]}
              onPress={() => router.push('/client-dashboard')}
            >
              <IconSymbol name="list.bullet.clipboard" size={32} color={colors.primary} />
              <Text style={styles.navCardTitle}>My Errands</Text>
              <Text style={commonStyles.textSecondary}>View your booking history</Text>
            </Pressable>

            <Pressable 
              style={[commonStyles.card, styles.navCard]}
              onPress={() => router.push('/admin-dashboard')}
            >
              <IconSymbol name="chart.bar.fill" size={32} color={colors.secondary} />
              <Text style={styles.navCardTitle}>Admin Dashboard</Text>
              <Text style={commonStyles.textSecondary}>Manage all requests</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={commonStyles.textSecondary}>
              Need help? Contact us on WhatsApp
            </Text>
            <Pressable onPress={openWhatsApp}>
              <Text style={styles.footerLink}>+263 779 925 482</Text>
            </Pressable>
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
      maxWidth: 1400,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 20 : Platform.OS === 'web' ? 40 : 100,
  },
  heroSection: {
    paddingVertical: Platform.OS === 'web' ? 80 : 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    maxWidth: 600,
  },
  contentWrapper: {
    ...(Platform.OS === 'web' && {
      maxWidth: 1200,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  quickActions: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
    ...(Platform.OS === 'web' && {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }),
  },
  actionButton: {
    flexDirection: 'row',
    gap: 8,
    ...(Platform.OS === 'web' && {
      minWidth: 250,
    }),
  },
  actionButtonText: {
    marginLeft: 8,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    ...(Platform.OS === 'web' && {
      textAlign: 'center',
      fontSize: 28,
    }),
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: Platform.OS === 'web' ? 'center' : 'space-between',
  },
  featureCard: {
    width: Platform.OS === 'web' ? 280 : '48%',
    alignItems: 'center',
    padding: 20,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  howItWorksSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  navigationSection: {
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 12,
    ...(Platform.OS === 'web' && {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }),
  },
  navCard: {
    alignItems: 'center',
    padding: 24,
    ...(Platform.OS === 'web' && {
      width: 300,
    }),
  },
  navCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 32,
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
});
