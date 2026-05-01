import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, me, register as registerApi } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('smarthire_token')));

  useEffect(() => {
    if (!localStorage.getItem('smarthire_token')) return;
    me().then(setUser).catch(() => localStorage.removeItem('smarthire_token')).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(payload) {
      const data = await loginApi(payload);
      localStorage.setItem('smarthire_token', data.token);
      setUser(data.user);
      return data;
    },
    async register(payload) {
      const data = await registerApi(payload);
      localStorage.setItem('smarthire_token', data.token);
      setUser(data.user);
      return data;
    },
    logout() {
      localStorage.removeItem('smarthire_token');
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
