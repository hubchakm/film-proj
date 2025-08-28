import React, { createContext, useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export type AuthContextType = {
  token: string;
  setToken: (t: string) => void;
  apiBase: string;
};
export const AuthContext = createContext<AuthContextType>({
  token: '',
  setToken: () => {},
  apiBase: '',
});

const API_BASE = `${Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080'}/api/v1`;

export default function RootLayout() {
  const [token, setToken] = useState('');
  const ctx = useMemo(() => ({ token, setToken, apiBase: API_BASE }), [token]);

  return (
    <AuthContext.Provider value={ctx}>
      <Stack screenOptions={{ headerBackTitle: 'Back' }}>
        <Stack.Screen name="index" options={{ title: 'Film Ratings' }} />
        <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
        <Stack.Screen name="(auth)/register" options={{ title: 'Register' }} />
      </Stack>
    </AuthContext.Provider>
  );
}
