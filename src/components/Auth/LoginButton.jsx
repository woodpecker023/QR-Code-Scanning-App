/**
 * LoginButton Component
 * Google Sign-In button
 */

import { useGoogleLogin } from '@react-oauth/google';
import { Button, Box, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../hooks/useAuth';
import { GOOGLE_SCOPES } from '../../utils/constants';

export default function LoginButton() {
  const { handleLoginSuccess, error } = useAuth();
  const { GOOGLE_CLIENT_ID } = require('../../utils/constants');

  // Check if client ID is configured
  if (!GOOGLE_CLIENT_ID) {
    return (
      <Box className="login-container">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            maxWidth: 400,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold" color="error">
            Configuration Error
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Google Client ID is not configured. Please add environment variables to Vercel and redeploy.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Check deployment documentation for setup instructions.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: GOOGLE_SCOPES
  });

  return (
    <Box className="login-container">
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: 400,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          QR Inventory
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Scan and manage your inventory with QR codes
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ marginY: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={() => login()}
          fullWidth
          sx={{
            marginTop: 2,
            padding: 1.5,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Sign in with Google
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ marginTop: 2, display: 'block' }}>
          Sign in to access your Google Sheets inventory
        </Typography>
      </Paper>
    </Box>
  );
}
