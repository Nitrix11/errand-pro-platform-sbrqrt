
import React, { useState, useEffect, useRef } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { 
  ScrollView, 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Platform,
  Linking,
  Animated,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";
import * as Location from 'expo-location';

interface TrackingLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export default function TrackingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  
  const [runnerLocation, setRunnerLocation] = useState<TrackingLocation | null>(null);
  const [estimatedTime, setEstimatedTime] = useState("15 mins");
  const [status, setStatus] = useState("On the way to pickup");
  const [progress, setProgress] = useState(0.3);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Simulate real-time location updates
    simulateLocationUpdates();
    
    // Pulse animation for runner marker
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);

  const simulateLocationUpdates = () => {
    // Simulate runner moving (in a real app, this would come from backend)
    const interval = setInterval(() => {
      setRunnerLocation({
        latitude: -17.8252 + (Math.random() - 0.5) * 0.01,
        longitude: 31.0335 + (Math.random() - 0.5) * 0.01,
        timestamp: Date.now(),
      });

      // Update progress
      setProgress(prev => {
        const newProgress = prev + 0.05;
        if (newProgress >= 1) {
          clearInterval(interval);
          setStatus("Delivered!");
          setEstimatedTime("Completed");
          return 1;
        }
        return newProgress;
      });

      // Update status based on progress
      setProgress(prev => {
        if (prev < 0.3) {
          setStatus("On the way to pickup");
          setEstimatedTime("15 mins");
        } else if (prev < 0.5) {
          setStatus("Arrived at pickup");
          setEstimatedTime("10 mins");
        } else if (prev < 0.8) {
          setStatus("On the way to delivery");
          setEstimatedTime("5 mins");
        } else if (prev < 1) {
          setStatus("Arriving soon");
          setEstimatedTime("2 mins");
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  };

  const contactRunner = () => {
    const phoneNumber = "263779925482";
    const message = `Hi! I'm tracking my errand (Booking ID: ${bookingId})`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const getStatusColor = () => {
    if (progress >= 1) return colors.success;
    if (progress >= 0.5) return colors.secondary;
    return colors.warning;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Track Errand",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFFFFF',
          presentation: 'card',
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Notice */}
        <View style={[commonStyles.card, styles.mapNotice]}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.secondary} />
          <View style={styles.mapNoticeText}>
            <Text style={styles.mapNoticeTitle}>Live Tracking</Text>
            <Text style={commonStyles.textSecondary}>
              Note: Interactive maps (react-native-maps) are not supported in Natively. 
              Location updates are shown below with coordinates and status.
            </Text>
          </View>
        </View>

        {/* Status Card */}
        <View style={[commonStyles.card, styles.statusCard]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusBadgeText}>{status}</Text>
            </View>
            <Text style={styles.bookingId}>#{bookingId}</Text>
          </View>

          <View style={styles.etaContainer}>
            <IconSymbol name="clock.fill" size={32} color={colors.primary} />
            <View style={styles.etaInfo}>
              <Text style={styles.etaLabel}>Estimated Time</Text>
              <Text style={styles.etaValue}>{estimatedTime}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progress * 100}%`,
                    backgroundColor: getStatusColor(),
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress * 100)}% Complete</Text>
          </View>

          {/* Journey Steps */}
          <View style={styles.journeySteps}>
            <View style={styles.journeyStep}>
              <View style={[
                styles.stepIndicator, 
                progress >= 0 && styles.stepIndicatorActive
              ]}>
                {progress >= 0.3 ? (
                  <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <View style={styles.stepDot} />
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Pickup Location</Text>
                <Text style={styles.stepSubtitle}>Runner heading to pickup</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.journeyStep}>
              <View style={[
                styles.stepIndicator, 
                progress >= 0.5 && styles.stepIndicatorActive
              ]}>
                {progress >= 0.8 ? (
                  <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <View style={styles.stepDot} />
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>In Transit</Text>
                <Text style={styles.stepSubtitle}>Package picked up</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.journeyStep}>
              <View style={[
                styles.stepIndicator, 
                progress >= 1 && styles.stepIndicatorActive
              ]}>
                {progress >= 1 ? (
                  <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <View style={styles.stepDot} />
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Delivery Location</Text>
                <Text style={styles.stepSubtitle}>Final destination</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Runner Location Card */}
        {runnerLocation && (
          <View style={[commonStyles.card, styles.locationCard]}>
            <View style={styles.locationHeader}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View style={styles.runnerMarker}>
                  <IconSymbol name="figure.walk" size={24} color="#FFFFFF" />
                </View>
              </Animated.View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>Runner Location</Text>
                <Text style={styles.locationSubtitle}>Last updated: just now</Text>
              </View>
            </View>

            <View style={styles.coordinatesContainer}>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>Latitude:</Text>
                <Text style={styles.coordinateValue}>
                  {runnerLocation.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>Longitude:</Text>
                <Text style={styles.coordinateValue}>
                  {runnerLocation.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <View style={styles.mapPlaceholder}>
              <IconSymbol name="map.fill" size={48} color={colors.textSecondary} />
              <Text style={styles.mapPlaceholderText}>
                Map visualization would appear here
              </Text>
              <Text style={commonStyles.textSecondary}>
                (Interactive maps not available in Natively)
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable 
            style={[buttonStyles.whatsapp, styles.actionButton]}
            onPress={contactRunner}
          >
            <IconSymbol name="message.fill" size={20} color="#FFFFFF" />
            <Text style={commonStyles.buttonText}>Contact Runner</Text>
          </Pressable>

          <Pressable 
            style={[buttonStyles.outline, styles.actionButton]}
            onPress={() => router.back()}
          >
            <IconSymbol name="arrow.left" size={20} color={colors.primary} />
            <Text style={commonStyles.buttonTextPrimary}>Back to Dashboard</Text>
          </Pressable>
        </View>

        {/* Delivery Instructions */}
        <View style={[commonStyles.card, styles.instructionsCard]}>
          <Text style={styles.instructionsTitle}>Delivery Instructions</Text>
          <View style={styles.instructionItem}>
            <IconSymbol name="bell.fill" size={20} color={colors.secondary} />
            <Text style={styles.instructionText}>
              You'll receive a notification when the runner arrives
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <IconSymbol name="phone.fill" size={20} color={colors.secondary} />
            <Text style={styles.instructionText}>
              The runner may call you for directions
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.secondary} />
            <Text style={styles.instructionText}>
              Please confirm delivery upon receipt
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
  },
  mapNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colors.highlight,
    marginBottom: 16,
  },
  mapNoticeText: {
    flex: 1,
    marginLeft: 12,
  },
  mapNoticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.highlight,
    borderRadius: 12,
    marginBottom: 20,
  },
  etaInfo: {
    marginLeft: 16,
  },
  etaLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  etaValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  journeySteps: {
    marginTop: 8,
  },
  journeyStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicatorActive: {
    backgroundColor: colors.secondary,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.textSecondary,
  },
  stepContent: {
    flex: 1,
    marginLeft: 16,
    paddingBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stepConnector: {
    width: 2,
    height: 24,
    backgroundColor: colors.border,
    marginLeft: 15,
    marginVertical: 4,
  },
  locationCard: {
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  runnerMarker: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 128, 128, 0.3)',
    elevation: 4,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  locationSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  coordinatesContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  coordinateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.highlight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    gap: 8,
  },
  instructionsCard: {
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
});
