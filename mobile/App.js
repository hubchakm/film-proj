import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';

// Default to the Android emulator host (10.0.2.2) so the app works
// immediately on Pixel 9a or similar emulators. Adjust this base URL
// if testing on a physical device or different network.
const API_BASE = `${Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080'}/api/v1`;

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

  useEffect(() => {
    loadFilms();
  }, [token]);

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

  const register = async () => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      await handleResponse(res);
      Alert.alert('Success', 'Account created');
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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

  const removeFilm = async id => {
    if (!token) {
      Alert.alert('Login required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/films/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await handleResponse(res);
      loadFilms();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Film Ratings</Text>
        <View style={styles.authSection}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.authButtons}>
            <Button title="Login" onPress={login} />
            <Button title="Register" onPress={register} />
          </View>
        </View>

        <View style={styles.addSection}>
          <TextInput
            placeholder="Film title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Rating"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Add Film" onPress={addFilm} />
        </View>

        <FlatList
          data={films}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.filmItem}>
              <Text style={styles.filmText}>
                {item.title} - {item.rating}/10
              </Text>
              {token ? (
                <TouchableOpacity
                  onPress={() => removeFilm(item._id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa'
  },
  content: {
    padding: 20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  authSection: {
    marginBottom: 30
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  addSection: {
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4
  },
  filmItem: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filmText: {
    fontSize: 16
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4
  },
  buttonText: {
    color: '#fff'
  }
});
