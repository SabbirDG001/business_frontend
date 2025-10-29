import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import axios from 'axios';
import { CredentialResponse } from '@react-oauth/google'; // Import type for Google response

// Configure axios
const apiClient = axios.create({
  // Use relative path for Vite proxy
  baseURL: '/api',
});

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  verifyGoogleTokenWithBackend: (credentialResponse: CredentialResponse) => Promise<void>; // New function to handle Google token verification
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

  // Effect to set user if token exists and verify token with backend
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('authToken');
      setToken(storedToken); // Update state with token from storage

      if (storedToken) {
        try {
          // Verify token with backend /auth/me endpoint
          const response = await apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser(response.data.user); // Set user based on successful verification
        } catch (error) {
          // Token is invalid or verification failed
          console.error("Session check failed:", error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken'); // Clean up invalid token
        }
      }
      setLoading(false); // Finished checking session
    };
    checkSession();
  }, []); // Run only once on mount

  // Login with email/password
  const login = async (email: string, password: string) => {
    setLoading(true); // Use general loading
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user: loggedInUser, token: newToken } = response.data;

      setUser(loggedInUser);
      setToken(newToken);
      localStorage.setItem('authToken', newToken); // Store token
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      throw error; // Re-throw for login page UI to handle
    } finally {
      setLoading(false);
    }
  };

  // NEW Function: Send Google ID token to backend for verification
  const verifyGoogleTokenWithBackend = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.error("Google Sign-In failed: No credential (ID token) received.");
      throw new Error("Google Sign-In failed: No credential received."); // Throw error
    }

    setIsGoogleAuthLoading(true); // Start Google-specific loading
    try {
      const idToken = credentialResponse.credential;
      // Send the ID token to your backend's verification endpoint
      const response = await apiClient.post('/auth/verify-google-token', { idToken });
      const { user: loggedInUser, token: newToken } = response.data;

      setUser(loggedInUser);
      setToken(newToken);
      localStorage.setItem('authToken', newToken); // Store the new token
    } catch (error) {
      console.error('Google token backend verification failed:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      // Re-throw the error so the calling component (LoginPage) knows it failed
      throw error;
    } finally {
      setIsGoogleAuthLoading(false); // Stop Google-specific loading
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken'); // Clear token from storage
    // Optionally call backend logout endpoint if it does anything server-side
    // apiClient.post('/auth/logout').catch(err => console.error("Logout API call failed:", err));
  };

  return (
    <AuthContext.Provider value={{
        user,
        token,
        login,
        verifyGoogleTokenWithBackend, // Provide the new function
        logout,
        loading, // General loading state
        isGoogleAuthLoading // Google-specific loading state
     }}>
      {children}
    </AuthContext.Provider>
  );
};
