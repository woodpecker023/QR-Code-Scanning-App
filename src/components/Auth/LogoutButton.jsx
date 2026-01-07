/**
 * LogoutButton Component
 * Sign-out button
 */

import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth';

export default function LogoutButton({ variant = 'outlined', size = 'small' }) {
  const { handleSignOut } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      startIcon={<LogoutIcon />}
      onClick={handleSignOut}
      sx={{ textTransform: 'none' }}
    >
      Sign Out
    </Button>
  );
}
