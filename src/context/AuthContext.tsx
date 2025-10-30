// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import axios from 'axios';
import { apiClient } from '../services/api';
// --- Import Firebase client auth and functions ---
import { auth, googleProvider } from '../services/firebaseClient.js'; // Use .js since you created that file
import { signInWithPopup } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  // --- Updated function to trigger Firebase Google Sign-In ---
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean; // General loading state
  isGoogleAuthLoading: boolean; // Specific loading state for Google process
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // For initial session check
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false); // For Google Sign-In process

  // Effect to check session (no changes needed)
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('authToken');
      setToken(storedToken);

      if (storedToken) {
        try {
          const response = await apiClient.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error("Session check failed:", error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  // Login with email/password (no changes needed)
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user: loggedInUser, token: newToken } = response.data;

      setUser(loggedInUser);
      setToken(newToken);
      localStorage.setItem('authToken', newToken);
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error instanceof Error) {
        throw new Error(error.message || 'Login failed.');
      } else {
        throw new Error('An unknown error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- *** REPLACED Google Sign-In Logic *** ---
  // This function now uses the Firebase SDK to get the correct token
  const signInWithGoogle = async () => {
    setIsGoogleAuthLoading(true);
    try {
      // 1. Trigger the Firebase Google Sign-In popup
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // 2. Get the Firebase ID token from the result (this is the crucial change)
      const idToken = await userCredential.user.getIdToken();

      // 3. Send *this* Firebase-issued token to your backend
      const response = await apiClient.post('/auth/verify-google-token', { idToken });
      
      // 4. Get your server's custom token and user info
      const { user: loggedInUser, token: newToken } = response.data;

      setUser(loggedInUser);
      setToken(newToken);
      localStorage.setItem('authToken', newToken); // Store your server's token
      
    } catch (error: any) { // Catch all errors
      console.error('Google Sign-In failed:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      
      // Handle different error types
      if (error.code === 'auth/popup-closed-by-user') {
          // Don't throw an error, just stop loading
          setIsGoogleAuthLoading(false);
          return; // User cancelled, so just stop.
      } else if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message); // Backend error
      } else if (error instanceof Error) {
        throw new Error(error.message || 'Google Sign-In failed.');
      } else {
        throw new Error('An unknown error occurred during Google Sign-In.');
      }
    } finally {
      setIsGoogleAuthLoading(false); // Stop Google-specific loading
    }
  };

  // Logout function (no changes needed)
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{
        user,
        token,
        login,
        signInWithGoogle, // --- Pass the new function
        logout,
        loading,
        isGoogleAuthLoading
     }}>
      {children}
    </AuthContext.Provider>
  );
};