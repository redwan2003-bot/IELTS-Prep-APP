import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../lib/supabase';

const SESSION_KEY = 'supabase_session';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session from secure storage
    const loadSession = async () => {
      try {
        const sessionJson = await SecureStore.getItemAsync(SESSION_KEY);
        if (sessionJson) {
          const savedSession = JSON.parse(sessionJson);
          setSession(savedSession);
          setUser(savedSession.user ?? null);
        }
      } catch (error) {
        console.error('Error loading session from secure store:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Save session to secure store
      if (session) {
        try {
          await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
        } catch (error) {
          console.error('Error saving session to secure store:', error);
        }
      } else {
        try {
          await SecureStore.deleteItemAsync(SESSION_KEY);
        } catch (error) {
          console.error('Error deleting session from secure store:', error);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
