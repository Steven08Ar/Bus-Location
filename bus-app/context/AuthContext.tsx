import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loginDriver: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, userId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      await AsyncStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const loginDriver = async (email: string, password: string) => {
    const response = await api.post('/auth/driver/login', { email, password });
    const { access_token, refresh_token, user: userData } = response.data;
    
    await AsyncStorage.setItem('access_token', access_token);
    await AsyncStorage.setItem('refresh_token', refresh_token);
    setUser(userData);
  };

  const loginUser = async (email: string, password: string) => {
    const response = await api.post('/auth/user/login', { email, password });
    const { access_token, refresh_token, user: userData } = response.data;
    
    await AsyncStorage.setItem('access_token', access_token);
    await AsyncStorage.setItem('refresh_token', refresh_token);
    setUser(userData);
  };

  const register = async (name: string, email: string, userId: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, userId, password });
    const { access_token, refresh_token, user: userData } = response.data;
    
    await AsyncStorage.setItem('access_token', access_token);
    await AsyncStorage.setItem('refresh_token', refresh_token);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginDriver, loginUser, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
