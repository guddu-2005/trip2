"use client";

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUser } from '../src/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!email.trim() || !password) {
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }
    setLoading(true);
    const res = await loginUser(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      Alert.alert('Login failed', res.error || 'Unknown error');
      return;
    }
    if (res.user) {
      Alert.alert('Welcome', `Hello ${res.user.name}`);
    } else {
      Alert.alert('Welcome', 'Login successful');
    }
    // Navigate to home or dashboard
    router.push('/');
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text>Don't have an account? </Text>
          <Text style={styles.link} onPress={() => router.push('/signup')}>
            Sign up
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
    maxWidth: 600,
    alignSelf: 'center',
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0a84ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  link: {
    color: '#0a84ff',
    fontWeight: '700',
  },
});
