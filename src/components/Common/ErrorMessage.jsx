/**
 * ErrorMessage Component
 * Displays error messages with optional severity
 */

import { Alert, AlertTitle } from '@mui/material';

export default function ErrorMessage({ message, title = 'Error', severity = 'error', onClose }) {
  if (!message) return null;

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      sx={{ marginY: 2 }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
}
