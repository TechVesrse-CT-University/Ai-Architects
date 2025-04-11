'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database - in a real app, this would be in a backend database
const MOCK_USERS = [
  {
    id: '1',
    email: 'teacher@example.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'John Smith'
  },
  {
    id: '2',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
    name: 'Jane Doe'
  }
];

// Type guard to validate User object
const isValidRole = (role: string): role is 'student' | 'teacher' => {
  return role === 'student' || role === 'teacher';
};

const isValidUser = (user: any): user is User => {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.name === 'string' &&
    typeof user.role === 'string' &&
    isValidRole(user.role)
  );
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth on mount
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsedUser = JSON.parse(storedAuth);
      if (isValidUser(parsedUser)) {
        setUser(parsedUser);
        
        // Redirect to appropriate dashboard if already logged in
        if (parsedUser.role === 'student') {
          router.push('/dashboard/student');
        } else if (parsedUser.role === 'teacher') {
          router.push('/dashboard/teacher');
        }
      } else {
        localStorage.removeItem('auth');
      }
    } else {
      router.push('/login');
    }
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'teacher') => {
    try {
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = MOCK_USERS.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === role
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Type assertion since we know the mock data is correctly typed
      const typedUser = userWithoutPassword as User;
      
      // Store auth in localStorage
      localStorage.setItem('auth', JSON.stringify(typedUser));
      setUser(typedUser);

      // Redirect to appropriate dashboard
      if (role === 'student') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/teacher');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
