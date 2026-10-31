import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  quickLogin: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('masterymind_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('masterymind_token');
      if (storedToken) {
        try {
          const me = await api.getCurrentUser();
          setUser(me);
        } catch (err) {
          localStorage.removeItem('masterymind_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const authRes = await api.login(email, pass);
      localStorage.setItem('masterymind_token', authRes.access_token);
      setToken(authRes.access_token);
      setUser({
        id: authRes.user_id,
        email: authRes.email,
        full_name: authRes.full_name,
        role: authRes.role as any,
        is_active: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const authRes = await api.register(data);
      localStorage.setItem('masterymind_token', authRes.access_token);
      setToken(authRes.access_token);
      setUser({
        id: authRes.user_id,
        email: authRes.email,
        full_name: authRes.full_name,
        role: authRes.role as any,
        is_active: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (email: string, pass: string) => {
    await login(email, pass);
  };

  const logout = () => {
    localStorage.removeItem('masterymind_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        quickLogin,
        logout,
        isTeacher: user?.role === 'teacher' || user?.role === 'admin',
        isStudent: user?.role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
