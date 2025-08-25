import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, Alert } from 'react-native';

const API_BASE = 'http://YOUR_IP:8080/api/v1';

export default function App() {
  const [token, setToken] = useState('');
  const [films, setFilms] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState('');

  const handleResponse = async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  const loadFilms = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/films`, { headers });
      const data = await handleResponse(res);
      setFilms(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => { loadFilms(); }, [token]);

  const login = async () => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await handleResponse(res);
      setToken(data.token);
      Alert.alert('Success', 'Logged in');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const addFilm = async () => {
    if (!token) {
      Alert.alert('Login required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/films`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, rating })
      });
      await handleResponse(res);
      setTitle('');
      setRating('');
      loadFilms();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const updateRating = async id => {
    if (!token) {
      Alert.alert('Login required');
      return;
    }
    const newRating = prompt('New rating 1-10');
    if (newRating === null) return;
    try {
      const res = await fetch(`${API_BASE}/films/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: newRating })
      });
      await handleResponse(res);
      loadFilms();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text>Username</Text>
        <TextInput value={username} onChangeText={setUsername} autoCapitalize='none' style={{ borderWidth:1, marginBottom:8 }} />
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, marginBottom:8 }} />
        <Button title="Login" onPress={login} />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={{ borderWidth:1, marginBottom:8 }} />
        <Text>Rating</Text>
        <TextInput value={rating} onChangeText={setRating} keyboardType='numeric' style={{ borderWidth:1, marginBottom:8 }} />
        <Button title="Add Film" onPress={addFilm} />
      </View>

      <FlatList
        data={films}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.title} - {item.rating}/10</Text>
            {token ? <Button title="Edit" onPress={() => updateRating(item._id)} /> : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
