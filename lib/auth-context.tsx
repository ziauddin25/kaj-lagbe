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
  isMockMode: boolean;
  login: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  signup: (data: { name: string; email: string; phone: string; role?: 'USER' | 'PROVIDER' }) => Promise<void>;
  logout: () => void;
  resendOTP: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function checkBackendAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const backendUp = await checkBackendAvailable();
    setIsMockMode(!backendUp);

    if (!backendUp) {
      console.log('⚠️ Backend not available, using mock mode');
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      if (backendUp) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch {
          const savedUser = localStorage.getItem('mock_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsMockMode(true);
          }
        }
      } else {
        const savedUser = localStorage.getItem('mock_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    }
    setIsLoading(false);
  };

  const login = async (phone: string) => {
    if (isMockMode) {
      const savedUser = localStorage.getItem(`user_${phone}`);
      if (savedUser) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`🔐 OTP for ${phone}: ${otp}`);
        localStorage.setItem(`otp_${phone}`, otp);
        return;
      }
      throw new Error('not found');
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (e: any) {
      if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        setIsMockMode(true);
        const savedUser = localStorage.getItem(`user_${phone}`);
        if (savedUser) {
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          console.log(`🔐 OTP for ${phone}: ${otp}`);
          localStorage.setItem(`otp_${phone}`, otp);
          return;
        }
        throw new Error('not found');
      }
      throw e;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    if (isMockMode) {
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

    try {
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
    } catch (e: any) {
      if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        setIsMockMode(true);
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
          }
          localStorage.setItem('auth_token', 'mock_token_' + userData.id);
          localStorage.setItem('mock_user', JSON.stringify(userData));
          setUser(userData);
          return;
        }
        throw new Error('Invalid OTP');
      }
      throw e;
    }
  };

  const signup = async (data: { name: string; email: string; phone: string; role?: 'USER' | 'PROVIDER' }) => {
    if (isMockMode) {
      const userData: User = {
        id: 'user_' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'USER'
      };
      localStorage.setItem(`user_${data.phone}`, JSON.stringify(userData));
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`🔐 OTP for ${data.phone}: ${otp}`);
      localStorage.setItem(`otp_${data.phone}`, otp);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }
    } catch (e: any) {
      if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        setIsMockMode(true);
        const userData: User = {
          id: 'user_' + Date.now(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role || 'USER'
        };
        localStorage.setItem(`user_${data.phone}`, JSON.stringify(userData));
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`🔐 OTP for ${data.phone}: ${otp}`);
        localStorage.setItem(`otp_${data.phone}`, otp);
        return;
      }
      throw e;
    }
  };

  const resendOTP = async (phone: string) => {
    if (isMockMode) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`🔐 New OTP for ${phone}: ${otp}`);
      localStorage.setItem(`otp_${phone}`, otp);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        throw new Error('Failed to resend OTP');
      }
    } catch (e: any) {
      if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        setIsMockMode(true);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`🔐 New OTP for ${phone}: ${otp}`);
        localStorage.setItem(`otp_${phone}`, otp);
        return;
      }
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, isMockMode, login, verifyOTP, signup, logout, resendOTP }}>
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
