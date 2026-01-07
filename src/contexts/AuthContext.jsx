/**
 * Authentication Context
 * Manages global authentication state
 */

import { createContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '../utils/constants';
import { initializeGapi, handleSignOut as authSignOut } from '../services/googleAuth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedToken);
      initializeGapi(savedToken)
        .then(() => {
          console.log('GAPI restored from saved session');
          setIsInitialized(true);
        })
        .catch(err => {
          console.error('Failed to initialize GAPI from saved session:', err);
          // Clear invalid session
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          setUser(null);
          setAccessToken(null);
          setError('Session expired. Please sign in again.');
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, []);

  const handleLoginSuccess = async (tokenResponse) => {
    try {
      console.log('Token response:', tokenResponse);

      const token = tokenResponse.access_token;

      if (!token) {
        throw new Error('No access token received');
      }

      // Fetch user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await userInfoResponse.json();

      const userData = {
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      };

      // Initialize GAPI FIRST before setting user state
      console.log('Initializing Google API...');
      await initializeGapi(token);
      console.log('Google API initialized, setting user...');

      // Only set user after GAPI is ready
      setUser(userData);
      setAccessToken(token);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', token);

      setError(null);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    authSignOut();
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isInitialized,
    error,
    handleLoginSuccess,
    handleSignOut
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
