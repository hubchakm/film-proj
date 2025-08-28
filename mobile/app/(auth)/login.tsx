import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { AuthContext } from '../_layout';
import { handleResponse } from '../lib/api';

export default function Login() {
  const router = useRouter();
  const { setToken, apiBase } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await handleResponse(res);
      setToken(data.token);
      Alert.alert('Success', 'Logged in');
      router.replace('/'); // go back to films
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Login</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={submit} />
      <View style={{ height: 12 }} />
      <Link href="/(auth)/register" style={styles.link}>Need an account? Register</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, backgroundColor: '#fafafa' },
  h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 4 },
  link: { color: '#2c3e50', fontWeight: '600', textAlign: 'center' },
});
