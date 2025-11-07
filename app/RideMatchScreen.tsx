import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import firestore from '@react-native-firebase/firestore'; // Uncomment if using Firestore
// import { GiftedChat } from 'react-native-gifted-chat'; // For chat feature

// --- Types ---
type LatLng = { lat: number; lng: number };
type Ride = {
  driverId: string;
  driverName: string;
  driverRating: number;
  origin: LatLng;
  destination: LatLng;
  time: string; // ISO
  availableSeats: number;
  participants: string[];
};
type UserTrip = {
  origin: LatLng;
  destination: LatLng;
  time: string; // ISO
};

// --- Mock Data ---
const mockRides: Ride[] = [
  {
    driverId: 'user123',
    driverName: 'Alice',
    driverRating: 4.8,
    origin: { lat: 20.2961, lng: 85.8245 },
    destination: { lat: 20.297, lng: 85.826 },
    time: '2025-11-07T09:00:00Z',
    availableSeats: 3,
    participants: ['user123'],
  },
  {
    driverId: 'user456',
    driverName: 'Bob',
    driverRating: 4.6,
    origin: { lat: 20.295, lng: 85.823 },
    destination: { lat: 20.298, lng: 85.828 },
    time: '2025-11-07T09:10:00Z',
    availableSeats: 2,
    participants: ['user456'],
  },
  // Add more mock rides as needed
];

// --- Haversine Distance ---
function haversineDistance(a: LatLng, b: LatLng) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const aVal = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(aVal));
}

// --- Matching Logic ---
function getOverlapPercentage(user: UserTrip, ride: Ride) {
  // For demo: inverse of sum of start/end distances
  const startDist = haversineDistance(user.origin, ride.origin);
  const endDist = haversineDistance(user.destination, ride.destination);
  const maxDist = 2; // km, for 100% overlap
  const overlap = Math.max(0, 1 - (startDist + endDist) / (2 * maxDist));
  return overlap * 100;
}

function calculateMatchScore(user: UserTrip, ride: Ride) {
  const overlap = getOverlapPercentage(user, ride);
  const timeDiff = Math.abs(new Date(user.time).getTime() - new Date(ride.time).getTime()) / 60000;
  return overlap - timeDiff * 0.5;
}

export default function RideMatchScreen() {
  // In real app, get userTrip from context or navigation params
  const [userTrip] = useState<UserTrip>({
    origin: { lat: 20.2961, lng: 85.8245 },
    destination: { lat: 20.297, lng: 85.826 },
    time: '2025-11-07T09:05:00Z',
  });
  const [matches, setMatches] = useState<Ride[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  useEffect(() => {
    // Filter and rank matches
    const filtered = mockRides
      .filter((ride) => {
        const overlap = getOverlapPercentage(userTrip, ride);
        const timeDiff = Math.abs(new Date(userTrip.time).getTime() - new Date(ride.time).getTime()) / 60000;
        return (
          overlap >= 70 &&
          timeDiff <= 15 &&
          ride.availableSeats > 0 &&
          ride.participants.length < 4
        );
      })
      .sort((a, b) => calculateMatchScore(userTrip, b) - calculateMatchScore(userTrip, a))
      .slice(0, 5);
    setMatches(filtered);
  }, [userTrip]);

  const handleSendRequest = (ride: Ride) => {
    // In real app, store request in Firestore
    setSelectedRide(ride);
    setModalVisible(true);
    // Alert.alert('Request sent!', 'You have requested to join this ride.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Matched Rides</Text>
      {matches.length === 0 && <Text style={styles.noMatch}>No suitable rides found.</Text>}
      {matches.map((ride, idx) => {
        const overlap = getOverlapPercentage(userTrip, ride);
        const detour = (100 - overlap).toFixed(1);
        const time = new Date(ride.time).toLocaleTimeString();
        return (
          <View key={ride.driverId} style={styles.card}>
            <Text style={styles.driver}>{ride.driverName} ({ride.driverRating}★)</Text>
            <Text>Seats: {ride.availableSeats - ride.participants.length} / {ride.availableSeats}</Text>
            <Text>Departure: {time}</Text>
            <Text>Detour: {detour}%</Text>
            <Text>CO₂ Saved: {((overlap/100)*2).toFixed(2)} kg</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleSendRequest(ride)}>
              <Text style={styles.buttonText}>Send Request to Join Ride</Text>
            </TouchableOpacity>
          </View>
        );
      })}
      {/* Confirmation Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: '700', fontSize: 18 }}>Request Sent!</Text>
            <Text style={{ marginVertical: 10 }}>You have requested to join {selectedRide?.driverName}'s ride.</Text>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Go to Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f9fafb', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, alignSelf: 'center' },
  noMatch: { textAlign: 'center', color: '#888', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  driver: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  button: { backgroundColor: '#22c55e', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 300, alignItems: 'center' },
});
