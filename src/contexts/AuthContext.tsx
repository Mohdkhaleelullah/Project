import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // For the MVP, we'll use a simple authentication flow with localStorage
  const login = async (email: string, password: string) => {
    // In a real app, this would make an API request to authenticate
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user - in a real app, this would come from the backend
      const demoUser = {
        id: '123456',
        username: email.split('@')[0],
        email
      };
      
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    // In a real app, this would make an API request to create a new user
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user - in a real app, this would come from the backend
      const demoUser = {
        id: '123456',
        username,
        email
      };
      
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};