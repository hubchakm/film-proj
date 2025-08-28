import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, Button, FlatList,
  Alert, TouchableOpacity, StyleSheet, RefreshControl
} from 'react-native';
import { Link } from 'expo-router';
import { AuthContext } from './_layout';
import { handleResponse } from './lib/api';

type Film = { _id: string; title: string; rating: number | string };

export default function FilmsScreen() {
  const { token, apiBase } = useContext(AuthContext);
  const [films, setFilms] = useState<Film[]>([]);
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadFilms = useCallback(async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiBase}/films`, { headers });
      const data = await handleResponse(res);
      setFilms(Array.isArray(data) ? data : []);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  }, [apiBase, token]);

  useEffect(() => { loadFilms(); }, [loadFilms]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFilms().catch(() => {});
    setRefreshing(false);
  }, [loadFilms]);

  const addFilm = useCallback(async () => {
    if (!token) return Alert.alert('Login required');
    try {
      const res = await fetch(`${apiBase}/films`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, rating }),
      });
      await handleResponse(res);
      setTitle(''); setRating('');
      loadFilms();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  }, [apiBase, token, title, rating, loadFilms]);

  const removeFilm = useCallback(async (id: string) => {
    if (!token) return Alert.alert('Login required');
    try {
      const res = await fetch(`${apiBase}/films/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await handleResponse(res);
      loadFilms();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  }, [apiBase, token, loadFilms]);

  const renderHeader = useMemo(() => (
    <View style={styles.headerWrap}>
      <Text style={styles.h1}>Film Ratings</Text>

      <View style={styles.row}>
        <Link href="/(auth)/login" style={styles.linkButton}><Text style={styles.linkText}>Login</Text></Link>
        <Link href="/(auth)/register" style={styles.linkButton}><Text style={styles.linkText}>Register</Text></Link>
      </View>

      <View style={styles.addSection}>
        <TextInput placeholder="Film title" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="Rating" value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />
        <Button title="Add Film" onPress={addFilm} />
      </View>
    </View>
  ), [title, rating, addFilm]);

  const renderItem = useCallback(({ item }: { item: Film }) => (
    <View style={styles.filmItem}>
      <Text style={styles.filmText}>{item.title} - {item.rating}/10</Text>
      {token ? (
        <TouchableOpacity onPress={() => removeFilm(item._id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  ), [token, removeFilm]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={films}
        keyExtractor={(item) => String(item._id)}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.empty}>No films yet. Add one above!</Text>}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        initialNumToRender={10}
        windowSize={11}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  listContent: { padding: 20, paddingBottom: 40 },
  headerWrap: { marginBottom: 16 },
  h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  linkButton: { backgroundColor: '#2c3e50', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  linkText: { color: '#fff', fontWeight: '600' },
  addSection: { marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 4 },
  filmItem: { marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filmText: { fontSize: 16 },
  deleteButton: { backgroundColor: '#e74c3c', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  buttonText: { color: '#fff' },
  empty: { textAlign: 'center', color: '#666', paddingVertical: 24 },
});
