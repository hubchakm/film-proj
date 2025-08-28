import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { AuthContext } from '../_layout';
import { handleResponse } from '../lib/api';

export default function Register() {
  const router = useRouter();
  const { apiBase } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    try {
      const res = await fetch(`${apiBase}/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      });
      await handleResponse(res);
      Alert.alert('Success', 'Account created');
      router.replace('/(auth)/login');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Register</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Create Account" onPress={submit} />
      <View style={{ height: 12 }} />
      <Link href="/(auth)/login" style={styles.link}>Already have an account? Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, backgroundColor: '#fafafa' },
  h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 4 },
  link: { color: '#2c3e50', fontWeight: '600', textAlign: 'center' },
});
