
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  Platform,
  Alert,
  Linking,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";
import * as ImagePicker from 'expo-image-picker';

export default function BookingScreen() {
  const router = useRouter();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [packageType, setPackageType] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [distance, setDistance] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const calculateDistance = () => {
    // Simple distance estimation based on address length (mock calculation)
    if (pickupAddress && dropoffAddress) {
      const estimatedDistance = Math.floor(Math.random() * 20) + 5;
      setDistance(estimatedDistance.toString());
      
      // Calculate suggested price: $5 base + $0.50 per km
      const suggestedPrice = (5 + estimatedDistance * 0.5).toFixed(2);
      setProposedPrice(suggestedPrice);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedFile(result.assets[0].uri);
      Alert.alert("Success", "File uploaded successfully!");
    }
  };

  const handleSubmit = () => {
    if (!pickupAddress || !dropoffAddress || !packageType || !proposedPrice) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Create booking object
    const booking = {
      id: Date.now().toString(),
      pickupAddress,
      dropoffAddress,
      packageType,
      preferredTime,
      distance,
      proposedPrice,
      notes,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    console.log("Booking submitted:", booking);

    Alert.alert(
      "Booking Submitted!",
      "Your errand request has been submitted. We'll contact you shortly via WhatsApp.",
      [
        {
          text: "View My Errands",
          onPress: () => router.push('/client-dashboard'),
        },
        {
          text: "Contact on WhatsApp",
          onPress: () => {
            const phoneNumber = "263779925482";
            const message = `Hi! I just submitted a booking (ID: ${booking.id}). Pickup: ${pickupAddress}, Dropoff: ${dropoffAddress}`;
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            Linking.openURL(url);
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Request Errand",
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
        <View style={styles.formSection}>
          <Text style={commonStyles.subtitle}>Errand Details</Text>
          <Text style={commonStyles.textSecondary}>
            Fill in the details below to request an errand
          </Text>

          {/* Pickup Address */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Pickup Address *</Text>
            <View style={styles.inputWithIcon}>
              <IconSymbol name="location.fill" size={20} color={colors.primary} />
              <TextInput
                style={[commonStyles.input, styles.inputWithIconField]}
                placeholder="Enter pickup location"
                placeholderTextColor={colors.textSecondary}
                value={pickupAddress}
                onChangeText={setPickupAddress}
                onBlur={calculateDistance}
              />
            </View>
          </View>

          {/* Dropoff Address */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Drop-off Address *</Text>
            <View style={styles.inputWithIcon}>
              <IconSymbol name="mappin.circle.fill" size={20} color={colors.secondary} />
              <TextInput
                style={[commonStyles.input, styles.inputWithIconField]}
                placeholder="Enter delivery location"
                placeholderTextColor={colors.textSecondary}
                value={dropoffAddress}
                onChangeText={setDropoffAddress}
                onBlur={calculateDistance}
              />
            </View>
          </View>

          {/* Distance Display */}
          {distance && (
            <View style={[commonStyles.card, styles.distanceCard]}>
              <IconSymbol name="arrow.left.arrow.right" size={24} color={colors.primary} />
              <View style={styles.distanceInfo}>
                <Text style={styles.distanceLabel}>Estimated Distance</Text>
                <Text style={styles.distanceValue}>{distance} km</Text>
              </View>
            </View>
          )}

          {/* Package Type */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Package Type *</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., Documents, Food, Parcel"
              placeholderTextColor={colors.textSecondary}
              value={packageType}
              onChangeText={setPackageType}
            />
          </View>

          {/* Preferred Time */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Preferred Time</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., Today 2PM, Tomorrow Morning"
              placeholderTextColor={colors.textSecondary}
              value={preferredTime}
              onChangeText={setPreferredTime}
            />
          </View>

          {/* Proposed Price */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Your Proposed Price (USD) *</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[commonStyles.input, styles.priceInput]}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                value={proposedPrice}
                onChangeText={setProposedPrice}
                keyboardType="decimal-pad"
              />
            </View>
            {distance && (
              <Text style={styles.priceHint}>
                Suggested: ${(5 + parseFloat(distance) * 0.5).toFixed(2)} (Base $5 + $0.50/km)
              </Text>
            )}
          </View>

          {/* Additional Notes */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Additional Notes</Text>
            <TextInput
              style={[commonStyles.input, styles.textArea]}
              placeholder="Any special instructions or details"
              placeholderTextColor={colors.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* File Upload */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Upload Photo/Receipt (Optional)</Text>
            <Pressable 
              style={styles.uploadButton}
              onPress={pickImage}
            >
              <IconSymbol name="photo.fill" size={24} color={colors.primary} />
              <Text style={styles.uploadButtonText}>
                {uploadedFile ? "File Uploaded ✓" : "Choose File"}
              </Text>
            </Pressable>
          </View>

          {/* Submit Button */}
          <Pressable 
            style={[buttonStyles.primary, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={commonStyles.buttonText}>Submit Request</Text>
          </Pressable>

          {/* WhatsApp Quick Contact */}
          <Pressable 
            style={[buttonStyles.whatsapp, styles.whatsappButton]}
            onPress={() => {
              const phoneNumber = "263779925482";
              const message = "Hi! I have a question about booking an errand.";
              const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
              Linking.openURL(url);
            }}
          >
            <IconSymbol name="message.fill" size={20} color="#FFFFFF" />
            <Text style={commonStyles.buttonText}>Quick Chat on WhatsApp</Text>
          </Pressable>
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
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginTop: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputWithIconField: {
    flex: 1,
    marginBottom: 0,
    borderWidth: 0,
    paddingLeft: 12,
  },
  distanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.highlight,
  },
  distanceInfo: {
    marginLeft: 16,
  },
  distanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
  },
  priceHint: {
    fontSize: 13,
    color: colors.secondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  submitButton: {
    marginTop: 32,
  },
  whatsappButton: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
});
