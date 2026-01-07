/**
 * Main App Component
 * Root component with authentication gating and navigation
 */

import { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginButton from './components/Auth/LoginButton';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import QRGenerator from './components/QRGenerator/QRGenerator';
import QRScanner from './components/QRScanner/QRScanner';
import LoadingSpinner from './components/Common/LoadingSpinner';
import './App.css';

// Add gapi script to head
const loadGapiScript = () => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function AppContent() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState('generate');
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    loadGapiScript()
      .then(() => {
        setGapiLoaded(true);
      })
      .catch(err => {
        console.error('Failed to load Google API script:', err);
      });
  }, []);

  if (!isInitialized || !gapiLoaded) {
    return <LoadingSpinner message="Initializing app..." />;
  }

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  return (
    <Box className="app-container">
      <Header />
      <Box className="main-content">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'generate' ? (
          <QRGenerator />
        ) : (
          <QRScanner />
        )}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
