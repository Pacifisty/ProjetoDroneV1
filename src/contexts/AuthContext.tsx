'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'avatar'>>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'dronebuild_user';
const USERS_KEY = 'dronebuild_users';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getAvatarUrl(name: string) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=f97316&color=fff&size=128`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const persist = useCallback((u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const getUsers = (): Record<string, { password: string; user: User }> => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveUsers = (users: Record<string, { password: string; user: User }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const users = getUsers();
    const entry = users[email.toLowerCase()];
    if (!entry) throw new Error('E-mail não encontrado. Crie uma conta primeiro.');
    if (entry.password !== password) throw new Error('Senha incorreta.');
    persist(entry.user);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist]);

  const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
    const users = getUsers();
    const key = email.toLowerCase();
    if (users[key]) throw new Error('Este e-mail já está cadastrado.');
    const newUser: User = {
      id: generateId(),
      name,
      email: key,
      avatar: getAvatarUrl(name),
      provider: 'email',
      createdAt: new Date().toISOString(),
    };
    users[key] = { password, user: newUser };
    saveUsers(users);
    persist(newUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist]);

  const signInWithGoogle = useCallback(async () => {
    const name = 'Usuário Google';
    const email = `google_${generateId()}@gmail.com`;
    const newUser: User = {
      id: generateId(),
      name,
      email,
      avatar: getAvatarUrl(name),
      provider: 'google',
      createdAt: new Date().toISOString(),
    };
    persist(newUser);
  }, [persist]);

  const signOut = useCallback(() => {
    persist(null);
  }, [persist]);

  const updateProfile = useCallback((data: Partial<Pick<User, 'name' | 'avatar'>>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (prev.provider === 'email') {
        try {
          const raw = localStorage.getItem(USERS_KEY);
          const users: Record<string, { password: string; user: User }> = raw ? JSON.parse(raw) : {};
          if (users[prev.email]) {
            users[prev.email].user = updated;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
          }
        } catch {
          // ignore
        }
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
