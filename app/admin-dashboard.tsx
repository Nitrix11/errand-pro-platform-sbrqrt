
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Platform,
  Alert,
  TextInput,
  Linking,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";

// Mock data - in a real app, this would come from a backend
const mockRequests = [
  {
    id: "1",
    clientName: "John Doe",
    clientPhone: "+263771234567",
    pickupAddress: "123 Main St, Harare",
    dropoffAddress: "456 Park Ave, Harare",
    packageType: "Documents",
    proposedPrice: "8.50",
    distance: "12",
    status: "Pending",
    createdAt: "2025-01-10T10:30:00Z",
  },
  {
    id: "2",
    clientName: "Jane Smith",
    clientPhone: "+263772345678",
    pickupAddress: "789 Oak Rd, Bulawayo",
    dropoffAddress: "321 Elm St, Bulawayo",
    packageType: "Food Delivery",
    proposedPrice: "12.00",
    distance: "8",
    status: "In Progress",
    createdAt: "2025-01-10T09:15:00Z",
  },
  {
    id: "3",
    clientName: "Mike Johnson",
    clientPhone: "+263773456789",
    pickupAddress: "555 Pine St, Harare",
    dropoffAddress: "777 Maple Dr, Harare",
    packageType: "Parcel",
    proposedPrice: "15.00",
    distance: "18",
    status: "Pending",
    createdAt: "2025-01-10T08:45:00Z",
  },
];

export default function AdminDashboardScreen() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState("");

  const totalEarnings = requests
    .filter(r => r.status === "Completed")
    .reduce((sum, r) => sum + parseFloat(r.proposedPrice), 0);

  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const activeCount = requests.filter(r => r.status === "In Progress").length;

  const handleAccept = (requestId: string) => {
    Alert.alert(
      "Accept Request",
      "Do you want to accept this errand request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => {
            setRequests(prev =>
              prev.map(r =>
                r.id === requestId ? { ...r, status: "In Progress" } : r
              )
            );
            Alert.alert("Success", "Request accepted! Client will be notified.");
          },
        },
      ]
    );
  };

  const handleReject = (requestId: string) => {
    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setRequests(prev => prev.filter(r => r.id !== requestId));
            Alert.alert("Request Rejected", "The client will be notified.");
          },
        },
      ]
    );
  };

  const handleCounterOffer = (requestId: string) => {
    if (!counterPrice) {
      Alert.alert("Error", "Please enter a counter price");
      return;
    }

    Alert.alert(
      "Send Counter Offer",
      `Send counter offer of $${counterPrice}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () => {
            setRequests(prev =>
              prev.map(r =>
                r.id === requestId ? { ...r, proposedPrice: counterPrice } : r
              )
            );
            setSelectedRequest(null);
            setCounterPrice("");
            Alert.alert("Counter Offer Sent", "Client will be notified via WhatsApp.");
          },
        },
      ]
    );
  };

  const handleComplete = (requestId: string) => {
    Alert.alert(
      "Mark as Completed",
      "Mark this errand as completed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => {
            setRequests(prev =>
              prev.map(r =>
                r.id === requestId ? { ...r, status: "Completed" } : r
              )
            );
            Alert.alert("Success", "Errand marked as completed!");
          },
        },
      ]
    );
  };

  const contactClient = (phone: string, requestId: string) => {
    const message = `Hi! This is Mr Errands Guy regarding your booking #${requestId}.`;
    const url = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

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
          title: "Admin Dashboard",
          headerStyle: {
            backgroundColor: colors.secondary,
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
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={[commonStyles.card, styles.statCard, styles.earningsCard]}>
            <IconSymbol name="dollarsign.circle.fill" size={32} color={colors.success} />
            <Text style={styles.earningsValue}>${totalEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>

          <View style={styles.miniStatsRow}>
            <View style={[commonStyles.card, styles.miniStatCard]}>
              <Text style={[styles.miniStatValue, { color: colors.warning }]}>
                {pendingCount}
              </Text>
              <Text style={styles.miniStatLabel}>Pending</Text>
            </View>

            <View style={[commonStyles.card, styles.miniStatCard]}>
              <Text style={[styles.miniStatValue, { color: colors.secondary }]}>
                {activeCount}
              </Text>
              <Text style={styles.miniStatLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* Requests List */}
        <View style={styles.requestsSection}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>
            Errand Requests
          </Text>

          {requests.length === 0 ? (
            <View style={[commonStyles.card, styles.emptyState]}>
              <IconSymbol name="tray.fill" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No requests</Text>
              <Text style={commonStyles.textSecondary}>
                New requests will appear here
              </Text>
            </View>
          ) : (
            requests.map((request) => (
              <View key={request.id} style={[commonStyles.card, styles.requestCard]}>
                {/* Header */}
                <View style={styles.requestHeader}>
                  <View>
                    <Text style={styles.clientName}>{request.clientName}</Text>
                    <Text style={styles.requestId}>#{request.id}</Text>
                  </View>
                  <View 
                    style={[
                      commonStyles.badge, 
                      { backgroundColor: getStatusColor(request.status) }
                    ]}
                  >
                    <Text style={commonStyles.badgeText}>{request.status}</Text>
                  </View>
                </View>

                {/* Locations */}
                <View style={styles.locationContainer}>
                  <View style={styles.locationRow}>
                    <IconSymbol name="location.fill" size={18} color={colors.primary} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {request.pickupAddress}
                    </Text>
                  </View>
                  <View style={styles.locationRow}>
                    <IconSymbol name="mappin.circle.fill" size={18} color={colors.secondary} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {request.dropoffAddress}
                    </Text>
                  </View>
                </View>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Package</Text>
                    <Text style={styles.detailValue}>{request.packageType}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Distance</Text>
                    <Text style={styles.detailValue}>{request.distance} km</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Proposed Price</Text>
                    <Text style={[styles.detailValue, styles.priceText]}>
                      ${request.proposedPrice}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{formatDate(request.createdAt)}</Text>
                  </View>
                </View>

                {/* Counter Offer Section */}
                {selectedRequest === request.id && request.status === "Pending" && (
                  <View style={styles.counterOfferSection}>
                    <Text style={styles.counterOfferLabel}>Counter Offer (USD)</Text>
                    <View style={styles.counterOfferInput}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.priceInput}
                        placeholder="0.00"
                        placeholderTextColor={colors.textSecondary}
                        value={counterPrice}
                        onChangeText={setCounterPrice}
                        keyboardType="decimal-pad"
                      />
                      <Pressable 
                        style={styles.sendCounterButton}
                        onPress={() => handleCounterOffer(request.id)}
                      >
                        <Text style={styles.sendCounterText}>Send</Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* Actions */}
                <View style={styles.actionsContainer}>
                  {request.status === "Pending" && (
                    <>
                      <Pressable 
                        style={[buttonStyles.primary, styles.actionButton]}
                        onPress={() => handleAccept(request.id)}
                      >
                        <IconSymbol name="checkmark.circle.fill" size={18} color="#FFFFFF" />
                        <Text style={[commonStyles.buttonText, styles.actionButtonText]}>
                          Accept
                        </Text>
                      </Pressable>

                      <Pressable 
                        style={[buttonStyles.outline, styles.actionButton]}
                        onPress={() => {
                          if (selectedRequest === request.id) {
                            setSelectedRequest(null);
                            setCounterPrice("");
                          } else {
                            setSelectedRequest(request.id);
                            setCounterPrice(request.proposedPrice);
                          }
                        }}
                      >
                        <IconSymbol name="dollarsign.circle" size={18} color={colors.primary} />
                        <Text style={[commonStyles.buttonTextPrimary, styles.actionButtonText]}>
                          Counter
                        </Text>
                      </Pressable>

                      <Pressable 
                        style={[styles.rejectButton, styles.actionButton]}
                        onPress={() => handleReject(request.id)}
                      >
                        <IconSymbol name="xmark.circle.fill" size={18} color="#FFFFFF" />
                        <Text style={[commonStyles.buttonText, styles.actionButtonText]}>
                          Reject
                        </Text>
                      </Pressable>
                    </>
                  )}

                  {request.status === "In Progress" && (
                    <Pressable 
                      style={[buttonStyles.primary, styles.actionButton, { flex: 1 }]}
                      onPress={() => handleComplete(request.id)}
                    >
                      <IconSymbol name="checkmark.circle.fill" size={18} color="#FFFFFF" />
                      <Text style={[commonStyles.buttonText, styles.actionButtonText]}>
                        Mark Complete
                      </Text>
                    </Pressable>
                  )}

                  <Pressable 
                    style={[buttonStyles.whatsapp, styles.actionButton, { flex: 1 }]}
                    onPress={() => contactClient(request.clientPhone, request.id)}
                  >
                    <IconSymbol name="message.fill" size={18} color="#FFFFFF" />
                    <Text style={[commonStyles.buttonText, styles.actionButtonText]}>
                      Contact
                    </Text>
                  </Pressable>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statCard: {
    alignItems: 'center',
    padding: 20,
  },
  earningsCard: {
    backgroundColor: colors.highlight,
    marginBottom: 12,
  },
  earningsValue: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.success,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  miniStatValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  requestsSection: {
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
  requestCard: {
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  requestId: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  locationContainer: {
    marginBottom: 16,
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  priceText: {
    color: colors.primary,
    fontSize: 16,
  },
  counterOfferSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.highlight,
    borderRadius: 12,
  },
  counterOfferLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  counterOfferInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 10,
  },
  sendCounterButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendCounterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
  },
  actionButtonText: {
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: colors.error,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
