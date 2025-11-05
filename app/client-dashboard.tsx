
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { 
  ScrollView, 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Platform,
  Linking,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";

interface Booking {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  packageType: string;
  proposedPrice: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Rejected';
  createdAt: string;
  estimatedTime?: string;
}

export default function ClientDashboardScreen() {
  const router = useRouter();
  
  // Mock data - in a real app, this would come from a backend/database
  const [bookings] = useState<Booking[]>([
    {
      id: '1001',
      pickupAddress: '123 Main St, Harare',
      dropoffAddress: '456 Park Ave, Harare',
      packageType: 'Documents',
      proposedPrice: '10.00',
      status: 'In Progress',
      createdAt: '2025-01-10T10:30:00Z',
      estimatedTime: '15 mins',
    },
    {
      id: '1002',
      pickupAddress: '789 Oak Rd, Bulawayo',
      dropoffAddress: '321 Elm St, Bulawayo',
      packageType: 'Food Delivery',
      proposedPrice: '8.50',
      status: 'Completed',
      createdAt: '2025-01-09T14:20:00Z',
    },
    {
      id: '1003',
      pickupAddress: '555 Pine St, Harare',
      dropoffAddress: '777 Cedar Ave, Harare',
      packageType: 'Parcel',
      proposedPrice: '12.00',
      status: 'Pending',
      createdAt: '2025-01-08T09:15:00Z',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return colors.success;
      case 'In Progress':
        return colors.secondary;
      case 'Accepted':
        return colors.primary;
      case 'Pending':
        return colors.warning;
      case 'Rejected':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'checkmark.circle.fill';
      case 'In Progress':
        return 'arrow.right.circle.fill';
      case 'Accepted':
        return 'hand.thumbsup.fill';
      case 'Pending':
        return 'clock.fill';
      case 'Rejected':
        return 'xmark.circle.fill';
      default:
        return 'circle.fill';
    }
  };

  const contactRunner = (bookingId: string) => {
    const phoneNumber = "263779925482";
    const message = `Hi! I need help with my booking #${bookingId}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const trackErrand = (bookingId: string) => {
    router.push(`/tracking?bookingId=${bookingId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Errands",
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
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={commonStyles.title}>My Bookings</Text>
            <Text style={commonStyles.textSecondary}>
              Track and manage your errand requests
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Pressable 
              style={[buttonStyles.primary, styles.actionButton]}
              onPress={() => router.push('/booking')}
            >
              <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
              <Text style={commonStyles.buttonText}>New Errand</Text>
            </Pressable>

            <Pressable 
              style={[buttonStyles.whatsapp, styles.actionButton]}
              onPress={() => contactRunner('general')}
            >
              <IconSymbol name="message.fill" size={20} color="#FFFFFF" />
              <Text style={commonStyles.buttonText}>Contact Support</Text>
            </Pressable>
          </View>

          {/* Bookings List */}
          <View style={styles.bookingsSection}>
            <Text style={[commonStyles.subtitle, styles.sectionTitle]}>
              Recent Errands
            </Text>

            {bookings.length === 0 ? (
              <View style={[commonStyles.card, styles.emptyState]}>
                <IconSymbol name="tray.fill" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>No errands yet</Text>
                <Text style={commonStyles.textSecondary}>
                  Start by requesting your first errand
                </Text>
                <Pressable 
                  style={[buttonStyles.primary, styles.emptyStateButton]}
                  onPress={() => router.push('/booking')}
                >
                  <Text style={commonStyles.buttonText}>Request Errand</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.bookingsList}>
                {bookings.map((booking) => (
                  <View key={booking.id} style={[commonStyles.card, styles.bookingCard]}>
                    {/* Booking Header */}
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingIdContainer}>
                        <Text style={styles.bookingId}>#{booking.id}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                          <IconSymbol 
                            name={getStatusIcon(booking.status) as any} 
                            size={14} 
                            color="#FFFFFF" 
                          />
                          <Text style={styles.statusText}>{booking.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.bookingDate}>{formatDate(booking.createdAt)}</Text>
                    </View>

                    {/* Booking Details */}
                    <View style={styles.bookingDetails}>
                      <View style={styles.locationRow}>
                        <IconSymbol name="location.fill" size={20} color={colors.primary} />
                        <View style={styles.locationInfo}>
                          <Text style={styles.locationLabel}>Pickup</Text>
                          <Text style={styles.locationAddress}>{booking.pickupAddress}</Text>
                        </View>
                      </View>

                      <View style={styles.locationConnector} />

                      <View style={styles.locationRow}>
                        <IconSymbol name="mappin.circle.fill" size={20} color={colors.secondary} />
                        <View style={styles.locationInfo}>
                          <Text style={styles.locationLabel}>Drop-off</Text>
                          <Text style={styles.locationAddress}>{booking.dropoffAddress}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Package Info */}
                    <View style={styles.packageInfo}>
                      <View style={styles.infoItem}>
                        <IconSymbol name="shippingbox.fill" size={18} color={colors.textSecondary} />
                        <Text style={styles.infoText}>{booking.packageType}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <IconSymbol name="dollarsign.circle.fill" size={18} color={colors.textSecondary} />
                        <Text style={styles.infoText}>${booking.proposedPrice}</Text>
                      </View>
                      {booking.estimatedTime && (
                        <View style={styles.infoItem}>
                          <IconSymbol name="clock.fill" size={18} color={colors.textSecondary} />
                          <Text style={styles.infoText}>{booking.estimatedTime}</Text>
                        </View>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.bookingActions}>
                      {booking.status === 'In Progress' && (
                        <Pressable 
                          style={[buttonStyles.primary, styles.bookingActionButton]}
                          onPress={() => trackErrand(booking.id)}
                        >
                          <IconSymbol name="location.circle.fill" size={18} color="#FFFFFF" />
                          <Text style={commonStyles.buttonText}>Track</Text>
                        </Pressable>
                      )}
                      <Pressable 
                        style={[buttonStyles.outline, styles.bookingActionButton]}
                        onPress={() => contactRunner(booking.id)}
                      >
                        <IconSymbol name="message.fill" size={18} color={colors.primary} />
                        <Text style={commonStyles.buttonTextPrimary}>Contact</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
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
      maxWidth: 900,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  header: {
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    gap: 8,
    ...(Platform.OS === 'web' && {
      flex: 1,
    }),
  },
  bookingsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  bookingsList: {
    gap: 16,
  },
  bookingCard: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  bookingIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookingDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  locationConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 9,
    marginVertical: 4,
  },
  packageInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  bookingActionButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateButton: {
    marginTop: 16,
    minWidth: 200,
  },
});
