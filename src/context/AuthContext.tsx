import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import axios from 'axios';

// Configure axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void; // Will just redirect
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // Start true to check session

  // Effect to set user if token exists and verify token with backend
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('authToken'); // Get token again inside effect
      setToken(storedToken); // Update state

      if (storedToken) {
        try {
          // Verify token with backend /auth/me endpoint
          const response = await apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` } // Correct template literal
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
      setLoading(false); // Finished loading/checking
    };
    checkSession();
  }, []); // Run only once on mount

  const login = async (email: string, password: string) => {
    setLoading(true);
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
      throw error; // Re-throw for login page UI
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    // Redirect to the backend's Google auth URL
    const backendUrl = import.meta.env.VITE_API_URL || '';
    // Correct template literal usage
    window.location.href = `${backendUrl || ''}/api/auth/google`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken'); // Clear token
    // Optionally call backend logout endpoint
    // apiClient.post('/auth/logout').catch(err => console.error("Logout API call failed:", err));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};