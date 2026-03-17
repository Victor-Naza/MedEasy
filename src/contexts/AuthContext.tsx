import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../models/User';
import { UserRole } from '../types';
import { AuthController } from '../controllers/AuthController';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string, crm?: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, crm?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthController.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, crm?: string) => {
    setLoading(true);
    try {
      const user = await AuthController.login(email, password, crm);
      setCurrentUser(user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, crm?: string) => {
    setLoading(true);
    try {
      const user = await AuthController.register(name, email, password, role, crm);
      setCurrentUser(user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthController.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};