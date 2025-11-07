"use client";

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signupUser } from '../src/auth';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!name.trim()) return 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email required';
    if (!mobile.trim() || mobile.trim().length < 6) return 'Valid mobile required';
    if (!password || password.length < 6) return 'Password should be at least 6 characters';
    if (pincode && !/^\d{4,6}$/.test(pincode)) return 'Pincode seems invalid';
    return null;
  }

  async function onSubmit() {
    const error = validate();
    if (error) {
      Alert.alert('Validation error', error);
      return;
    }
    setLoading(true);
    const res = await signupUser({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      currentLocation: currentLocation.trim(),
      address: address.trim(),
      pincode: pincode.trim(),
      state: stateName.trim(),
      district: district.trim(),
      password,
    });
    setLoading(false);
    if (!res.ok) {
      Alert.alert('Sign up failed', res.error || 'Unknown error');
      return;
    }
    Alert.alert('Success', 'Account created');
    router.push('/login');
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Sign up</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Full name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your full name" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Mobile</Text>
        <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={styles.label}>Current location</Text>
        <TextInput style={styles.input} value={currentLocation} onChangeText={setCurrentLocation} placeholder="City or place" />

        <Text style={styles.label}>Address / Location details</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Street, house, etc." />

        <Text style={styles.label}>Pincode</Text>
        <TextInput style={styles.input} value={pincode} onChangeText={setPincode} keyboardType="numeric" />

        <Text style={styles.label}>State</Text>
        <TextInput style={styles.input} value={stateName} onChangeText={setStateName} />

        <Text style={styles.label}>District</Text>
        <TextInput style={styles.input} value={district} onChangeText={setDistrict} />

        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create account'}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
          <Text>Already have an account? </Text>
          <Text style={{ color: '#0a84ff', fontWeight: '700' }} onPress={() => router.push('/login')}>
            Login
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    alignSelf: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 },
  button: { marginTop: 20, backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
