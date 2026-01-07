/**
 * Header Component
 * App title, user info, and logout button
 */

import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { useAuth } from '../../hooks/useAuth';
import LogoutButton from '../Auth/LogoutButton';

export default function Header() {
  const { user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <QrCode2Icon sx={{ marginRight: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          QR Inventory
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Avatar
                src={user.picture}
                alt={user.name}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="body2">
                {user.name}
              </Typography>
            </Box>
            <LogoutButton />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
