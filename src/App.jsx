/**
 * Main App Component
 * Root component with authentication gating and navigation
 */

import { useState, useEffect } from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';
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
  const { isAuthenticated, isInitialized, error: authError } = useAuth();
  const [activeTab, setActiveTab] = useState('generate');
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gapiError, setGapiError] = useState(null);

  useEffect(() => {
    loadGapiScript()
      .then(() => {
        console.log('Google API script loaded successfully');
        setGapiLoaded(true);
      })
      .catch(err => {
        console.error('Failed to load Google API script:', err);
        setGapiError(err.message);
      });
  }, []);

  // Show loading state
  if (!isInitialized || !gapiLoaded) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 3 }}>
        {gapiError ? (
          <>
            <Typography variant="h6" color="error" gutterBottom>Failed to Load Google API</Typography>
            <Typography variant="body2" color="text.secondary">{gapiError}</Typography>
          </>
        ) : (
          <LoadingSpinner message="Initializing app..." />
        )}
      </Box>
    );
  }

  // Show auth error if any
  if (authError && !isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>Authentication Error</Typography>
        <Typography variant="body2" color="text.secondary">{authError}</Typography>
      </Box>
    );
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
