import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../models/User';
import { AuthController } from '../controllers/AuthController';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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
    // Restaura sessão buscando o usuário do banco via token em sessionStorage
    AuthController.getMe()
      .then(user => setCurrentUser(user))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const user = await AuthController.login(email, password);
    setCurrentUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const user = await AuthController.register(name, email, password);
    setCurrentUser(user);
  };

  const logout = () => {
    AuthController.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
