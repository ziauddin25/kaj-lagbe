'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'PROVIDER' | 'ADMIN';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  signup: (data: { name: string; email: string; phone: string; role?: 'USER' | 'PROVIDER' }) => Promise<void>;
  logout: () => void;
  resendOTP: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const MOCK_MODE = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mockOTP, setMockOTP] = useState<string>('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        if (MOCK_MODE) {
          const savedUser = localStorage.getItem('mock_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } else {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string) => {
    if (MOCK_MODE) {
      const savedUser = localStorage.getItem(`user_${phone}`);
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setMockOTP(otp);
        console.log(`🔐 OTP for ${phone}: ${otp}`);
        localStorage.setItem(`otp_${phone}`, otp);
        return;
      }
      throw new Error('not found');
    }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    if (MOCK_MODE) {
      const storedOTP = localStorage.getItem(`otp_${phone}`);
      if (otp === storedOTP || otp === '123456') {
        let userData: User;
        const savedUser = localStorage.getItem(`user_${phone}`);
        if (savedUser) {
          userData = JSON.parse(savedUser);
        } else {
          userData = {
            id: 'user_' + Date.now(),
            name: 'User',
            email: '',
            phone: phone,
            role: 'USER'
          };
          localStorage.setItem(`user_${phone}`, JSON.stringify(userData));
        }
        localStorage.setItem('auth_token', 'mock_token_' + userData.id);
        localStorage.setItem('mock_user', JSON.stringify(userData));
        setUser(userData);
        return;
      }
      throw new Error('Invalid OTP');
    }

    const res = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Verification failed');
    }
    
    const data = await res.json();
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
  };

  const signup = async (data: { name: string; email: string; phone: string; role?: 'USER' | 'PROVIDER' }) => {
    if (MOCK_MODE) {
      const userData: User = {
        id: 'user_' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'USER'
      };
      localStorage.setItem(`user_${data.phone}`, JSON.stringify(userData));
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOTP(otp);
      console.log(`🔐 OTP for ${data.phone}: ${otp}`);
      localStorage.setItem(`otp_${data.phone}`, otp);
      return;
    }

    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }
  };

  const resendOTP = async (phone: string) => {
    if (MOCK_MODE) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOTP(otp);
      console.log(`🔐 New OTP for ${phone}: ${otp}`);
      localStorage.setItem(`otp_${phone}`, otp);
      return;
    }

    const res = await fetch(`${API_URL}/auth/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
      throw new Error('Failed to resend OTP');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, verifyOTP, signup, logout, resendOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}