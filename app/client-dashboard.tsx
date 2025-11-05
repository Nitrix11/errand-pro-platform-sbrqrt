
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

// Mock data - in a real app, this would come from a backend
const mockBookings = [
  {
    id: "1",
    pickupAddress: "123 Main St, Harare",
    dropoffAddress: "456 Park Ave, Harare",
    packageType: "Documents",
    proposedPrice: "8.50",
    status: "In Progress",
    createdAt: "2025-01-10T10:30:00Z",
    estimatedDelivery: "2025-01-10T12:00:00Z",
  },
  {
    id: "2",
    pickupAddress: "789 Oak Rd, Bulawayo",
    dropoffAddress: "321 Elm St, Bulawayo",
    packageType: "Food Delivery",
    proposedPrice: "12.00",
    status: "Completed",
    createdAt: "2025-01-09T14:20:00Z",
    completedAt: "2025-01-09T15:45:00Z",
  },
  {
    id: "3",
    pickupAddress: "555 Pine St, Harare",
    dropoffAddress: "777 Maple Dr, Harare",
    packageType: "Parcel",
    proposedPrice: "15.00",
    status: "Pending",
    createdAt: "2025-01-10T09:00:00Z",
  },
];

export default function ClientDashboardScreen() {
  const router = useRouter();
  const [bookings] = useState(mockBookings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return colors.warning;
      case "In Progress":
        return colors.secondary;
      case "Completed":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return "clock.fill";
      case "In Progress":
        return "arrow.right.circle.fill";
      case "Completed":
        return "checkmark.circle.fill";
      default:
        return "circle.fill";
    }
  };

  const contactRunner = (bookingId: string) => {
    const phoneNumber = "263779925482";
    const message = `Hi! I'm checking on my errand (Booking ID: ${bookingId})`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
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
        {/* Header Stats */}
        <View style={styles.statsContainer}>
          <View style={[commonStyles.card, styles.statCard]}>
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Total Errands</Text>
          </View>
          <View style={[commonStyles.card, styles.statCard]}>
            <Text style={styles.statValue}>
              {bookings.filter(b => b.status === "In Progress").length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[commonStyles.card, styles.statCard]}>
            <Text style={styles.statValue}>
              {bookings.filter(b => b.status === "Completed").length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Pressable 
            style={[buttonStyles.primary, styles.quickActionButton]}
            onPress={() => router.push('/booking')}
          >
            <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
            <Text style={commonStyles.buttonText}>New Errand</Text>
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
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={[commonStyles.card, styles.bookingCard]}>
                {/* Status Badge */}
                <View style={styles.bookingHeader}>
                  <View 
                    style={[
                      commonStyles.badge, 
                      { backgroundColor: getStatusColor(booking.status) }
                    ]}
                  >
                    <Text style={commonStyles.badgeText}>{booking.status}</Text>
                  </View>
                  <Text style={styles.bookingId}>#{booking.id}</Text>
                </View>

                {/* Locations */}
                <View style={styles.locationContainer}>
                  <View style={styles.locationRow}>
                    <IconSymbol name="location.fill" size={20} color={colors.primary} />
                    <View style={styles.locationText}>
                      <Text style={styles.locationLabel}>Pickup</Text>
                      <Text style={styles.locationAddress}>{booking.pickupAddress}</Text>
                    </View>
                  </View>

                  <View style={styles.locationDivider}>
                    <View style={styles.dividerLine} />
                    <IconSymbol name="arrow.down" size={16} color={colors.textSecondary} />
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.locationRow}>
                    <IconSymbol name="mappin.circle.fill" size={20} color={colors.secondary} />
                    <View style={styles.locationText}>
                      <Text style={styles.locationLabel}>Drop-off</Text>
                      <Text style={styles.locationAddress}>{booking.dropoffAddress}</Text>
                    </View>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Package:</Text>
                    <Text style={styles.detailValue}>{booking.packageType}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Price:</Text>
                    <Text style={[styles.detailValue, styles.priceText]}>
                      ${booking.proposedPrice}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Requested:</Text>
                    <Text style={styles.detailValue}>{formatDate(booking.createdAt)}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <Pressable 
                    style={[buttonStyles.whatsapp, styles.cardActionButton]}
                    onPress={() => contactRunner(booking.id)}
                  >
                    <IconSymbol name="message.fill" size={18} color="#FFFFFF" />
                    <Text style={[commonStyles.buttonText, styles.cardActionText]}>
                      Contact
                    </Text>
                  </Pressable>

                  {booking.status === "In Progress" && (
                    <Pressable 
                      style={[buttonStyles.outline, styles.cardActionButton]}
                      onPress={() => console.log("Track errand:", booking.id)}
                    >
                      <IconSymbol name="location.fill" size={18} color={colors.primary} />
                      <Text style={[commonStyles.buttonTextPrimary, styles.cardActionText]}>
                        Track
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))
          )}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickActionButton: {
    flexDirection: 'row',
    gap: 8,
  },
  bookingsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  bookingCard: {
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  locationDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginLeft: 10,
  },
  dividerLine: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
  },
  detailsContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  priceText: {
    color: colors.primary,
    fontSize: 16,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cardActionButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
  },
  cardActionText: {
    fontSize: 14,
  },
});
