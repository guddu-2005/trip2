import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';

type PlaceDetails = {
  geometry: {
    location: { lat: number; lng: number }
  }
  [key: string]: any
};

export default function TripPlannerScreen() {
  const [origin, setOrigin] = useState<PlaceDetails | null>(null);
  const [destination, setDestination] = useState<PlaceDetails | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [travelTime, setTravelTime] = useState(new Date());

  // Placeholder for loading and trip options
  const [loading, setLoading] = useState(false);
  const [tripOptions, setTripOptions] = useState([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Smart Trip Planner</Text>
      <View style={styles.inputSection}>
        <Text style={styles.label}>Origin</Text>
        <GooglePlacesAutocomplete
          placeholder="Enter origin"
          onPress={(data, details = null) => setOrigin(details as PlaceDetails)}
          fetchDetails
          query={{ key: 'YOUR_GOOGLE_MAPS_API_KEY', language: 'en' }}
          styles={{ textInput: styles.input }}
        />
        <Text style={styles.label}>Destination</Text>
        <GooglePlacesAutocomplete
          placeholder="Enter destination"
          onPress={(data, details = null) => setDestination(details as PlaceDetails)}
          fetchDetails
          query={{ key: 'YOUR_GOOGLE_MAPS_API_KEY', language: 'en' }}
          styles={{ textInput: styles.input }}
        />
        <Text style={styles.label}>Travel Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
          <Text>{travelTime.toLocaleString()}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={travelTime}
            mode="datetime"
            display="default"
            onChange={(event: DateTimePickerEvent, date?: Date) => {
              setShowTimePicker(false);
              if (date) setTravelTime(date);
            }}
          />
        )}
      </View>
      {/* Map preview (optional, can be enhanced) */}
      <View style={styles.mapPreview}>
        <MapView style={{ flex: 1 }}>
          {origin && origin.geometry && origin.geometry.location && (
            <Marker coordinate={{ latitude: origin.geometry.location.lat, longitude: origin.geometry.location.lng }} title="Origin" />
          )}
          {destination && destination.geometry && destination.geometry.location && (
            <Marker coordinate={{ latitude: destination.geometry.location.lat, longitude: destination.geometry.location.lng }} title="Destination" />
          )}
        </MapView>
      </View>
      {/* Loading indicator */}
      {loading && <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />}
      {/* Trip options will be rendered here in the next steps */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f9fafb', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, alignSelf: 'center' },
  inputSection: { marginBottom: 20 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  mapPreview: { height: 180, borderRadius: 12, overflow: 'hidden', marginVertical: 16 },
});
