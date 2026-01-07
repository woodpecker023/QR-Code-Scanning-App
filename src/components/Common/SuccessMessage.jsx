/**
 * SuccessMessage Component
 * Displays success notifications with auto-dismiss
 */

import { Snackbar, Alert } from '@mui/material';

export default function SuccessMessage({
  open,
  message,
  onClose,
  autoHideDuration = 3000
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
