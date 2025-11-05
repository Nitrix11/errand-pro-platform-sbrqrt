
import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export default function BookingScreen() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [packageType, setPackageType] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [distance, setDistance] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDropoff, setLoadingDropoff] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestLocationPermissions();
    }
  }, []);

  const requestLocationPermissions = async () => {
    if (Platform.OS === 'web') {
      console.log('Location permissions not needed on web');
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
    }
  };

  const getCurrentLocation = async (isPickup: boolean) => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Web Platform',
        'Geolocation on web requires HTTPS and user permission. Please enter your address manually or use the browser location API.',
        [{ text: 'OK' }]
      );
      
      // Try to use browser geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // For web, we'll just set coordinates without reverse geocoding
            const locationData: LocationData = {
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              latitude,
              longitude,
            };

            if (isPickup) {
              setPickupLocation(locationData);
              setPickupAddress(locationData.address);
            } else {
              setDropoffLocation(locationData);
              setDropoffAddress(locationData.address);
            }

            Alert.alert('Success', 'Location captured! Please enter a full address for better accuracy.');
          },
          (error) => {
            console.error('Geolocation error:', error);
            Alert.alert('Error', 'Could not get location. Please enter address manually.');
          }
        );
      } else {
        Alert.alert('Not Supported', 'Geolocation is not supported by your browser. Please enter address manually.');
      }
      return;
    }

    try {
      if (isPickup) {
        setLoadingPickup(true);
      } else {
        setLoadingDropoff(true);
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location permissions to use this feature');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const addr = addresses[0];
        const formattedAddress = `${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
        
        const locationData: LocationData = {
          address: formattedAddress,
          latitude,
          longitude,
        };

        if (isPickup) {
          setPickupLocation(locationData);
          setPickupAddress(formattedAddress);
        } else {
          setDropoffLocation(locationData);
          setDropoffAddress(formattedAddress);
        }

        Alert.alert('Success', 'Location captured successfully!');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location. Please enter address manually.');
    } finally {
      if (isPickup) {
        setLoadingPickup(false);
      } else {
        setLoadingDropoff(false);
      }
    }
  };

  const geocodeAddress = async (address: string, isPickup: boolean) => {
    if (!address || address.length < 5) return;
    if (Platform.OS === 'web') {
      // On web, we'll skip geocoding and just use the address
      console.log('Geocoding not available on web, using address as-is');
      return;
    }

    try {
      const locations = await Location.geocodeAsync(address);
      
      if (locations.length > 0) {
        const { latitude, longitude } = locations[0];
        
        const locationData: LocationData = {
          address,
          latitude,
          longitude,
        };

        if (isPickup) {
          setPickupLocation(locationData);
        } else {
          setDropoffLocation(locationData);
        }

        calculateDistance();
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  const calculateDistance = () => {
    if (pickupLocation && dropoffLocation) {
      // Calculate distance using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = toRad(dropoffLocation.latitude - pickupLocation.latitude);
      const dLon = toRad(dropoffLocation.longitude - pickupLocation.longitude);
      
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(pickupLocation.latitude)) * 
        Math.cos(toRad(dropoffLocation.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const calculatedDistance = R * c;
      
      setDistance(calculatedDistance.toFixed(2));
      
      // Calculate suggested price: $5 base + $0.50 per km
      const suggestedPrice = (5 + calculatedDistance * 0.5).toFixed(2);
      setProposedPrice(suggestedPrice);
    } else if (pickupAddress && dropoffAddress) {
      // Fallback to mock calculation if geocoding hasn't completed
      const estimatedDistance = Math.floor(Math.random() * 20) + 5;
      setDistance(estimatedDistance.toString());
      const suggestedPrice = (5 + estimatedDistance * 0.5).toFixed(2);
      setProposedPrice(suggestedPrice);
    }
  };

  const toRad = (value: number) => {
    return (value * Math.PI) / 180;
  };

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      calculateDistance();
    }
  }, [pickupLocation, dropoffLocation]);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // On web, use HTML file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            setUploadedFile(event.target.result);
            Alert.alert("Success", "File uploaded successfully!");
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

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
      pickupLocation,
      dropoffLocation,
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
            {Platform.OS === 'web' 
              ? 'Enter pickup and delivery addresses below'
              : 'Select locations on map or enter addresses manually'}
          </Text>

          {/* Map Notice */}
          <View style={[commonStyles.card, styles.mapNotice]}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.secondary} />
            <View style={styles.mapNoticeText}>
              <Text style={styles.mapNoticeTitle}>Location Selection</Text>
              <Text style={commonStyles.textSecondary}>
                {Platform.OS === 'web'
                  ? 'Enter your addresses manually. Distance will be estimated automatically.'
                  : 'Use "Get Current Location" or enter addresses manually. We\'ll calculate the distance automatically.'}
              </Text>
            </View>
          </View>

          {/* Pickup Address */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Pickup Location *</Text>
            <View style={styles.locationInputContainer}>
              <View style={styles.inputWithIcon}>
                <IconSymbol name="location.fill" size={20} color={colors.primary} />
                <TextInput
                  style={[commonStyles.input, styles.inputWithIconField]}
                  placeholder="Enter pickup address"
                  placeholderTextColor={colors.textSecondary}
                  value={pickupAddress}
                  onChangeText={(text) => {
                    setPickupAddress(text);
                    if (Platform.OS !== 'web') {
                      geocodeAddress(text, true);
                    }
                  }}
                  onBlur={() => {
                    if (Platform.OS !== 'web') {
                      geocodeAddress(pickupAddress, true);
                    }
                  }}
                />
              </View>
              {Platform.OS !== 'web' && (
                <Pressable 
                  style={[buttonStyles.secondary, styles.locationButton]}
                  onPress={() => getCurrentLocation(true)}
                  disabled={loadingPickup}
                >
                  {loadingPickup ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <IconSymbol name="location.circle.fill" size={18} color="#FFFFFF" />
                      <Text style={[commonStyles.buttonText, styles.locationButtonText]}>
                        Use Current
                      </Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>
            {pickupLocation && (
              <View style={styles.coordinatesDisplay}>
                <Text style={styles.coordinatesText}>
                  📍 {pickupLocation.latitude.toFixed(6)}, {pickupLocation.longitude.toFixed(6)}
                </Text>
              </View>
            )}
          </View>

          {/* Dropoff Address */}
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Drop-off Location *</Text>
            <View style={styles.locationInputContainer}>
              <View style={styles.inputWithIcon}>
                <IconSymbol name="mappin.circle.fill" size={20} color={colors.secondary} />
                <TextInput
                  style={[commonStyles.input, styles.inputWithIconField]}
                  placeholder="Enter delivery address"
                  placeholderTextColor={colors.textSecondary}
                  value={dropoffAddress}
                  onChangeText={(text) => {
                    setDropoffAddress(text);
                    if (Platform.OS !== 'web') {
                      geocodeAddress(text, false);
                    }
                  }}
                  onBlur={() => {
                    if (Platform.OS !== 'web') {
                      geocodeAddress(dropoffAddress, false);
                    }
                  }}
                />
              </View>
              {Platform.OS !== 'web' && (
                <Pressable 
                  style={[buttonStyles.secondary, styles.locationButton]}
                  onPress={() => getCurrentLocation(false)}
                  disabled={loadingDropoff}
                >
                  {loadingDropoff ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <IconSymbol name="location.circle.fill" size={18} color="#FFFFFF" />
                      <Text style={[commonStyles.buttonText, styles.locationButtonText]}>
                        Use Current
                      </Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>
            {dropoffLocation && (
              <View style={styles.coordinatesDisplay}>
                <Text style={styles.coordinatesText}>
                  📍 {dropoffLocation.latitude.toFixed(6)}, {dropoffLocation.longitude.toFixed(6)}
                </Text>
              </View>
            )}
          </View>

          {/* Calculate Distance Button for Web */}
          {Platform.OS === 'web' && pickupAddress && dropoffAddress && !distance && (
            <Pressable 
              style={[buttonStyles.secondary, styles.calculateButton]}
              onPress={calculateDistance}
            >
              <IconSymbol name="arrow.left.arrow.right" size={18} color="#FFFFFF" />
              <Text style={commonStyles.buttonText}>Calculate Distance</Text>
            </Pressable>
          )}

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
    ...(Platform.OS === 'web' && {
      maxWidth: 1200,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 20 : Platform.OS === 'web' ? 40 : 100,
  },
  formSection: {
    padding: 20,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  mapNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.highlight,
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
  inputGroup: {
    marginTop: 16,
  },
  locationInputContainer: {
    gap: 8,
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
  locationButton: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
  },
  locationButtonText: {
    fontSize: 14,
  },
  calculateButton: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  coordinatesDisplay: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.highlight,
    borderRadius: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : Platform.OS === 'web' ? 'monospace' : 'monospace',
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
