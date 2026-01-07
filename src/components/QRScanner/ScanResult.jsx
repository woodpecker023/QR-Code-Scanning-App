/**
 * ScanResult Component
 * Displays scan result and update status
 */

import { Paper, Typography, Box, Chip, Stack, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function ScanResult({ result, onReset }) {
  if (!result) return null;

  const isSuccess = result.success;

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        marginTop: 2,
        backgroundColor: isSuccess ? 'success.light' : 'error.light',
        color: isSuccess ? 'success.contrastText' : 'error.contrastText'
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isSuccess ? (
            <CheckCircleIcon fontSize="large" />
          ) : (
            <ErrorIcon fontSize="large" />
          )}
          <Typography variant="h6">
            {isSuccess ? 'Scan Successful!' : 'Scan Failed'}
          </Typography>
        </Box>

        {isSuccess && result.item && (
          <>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {result.item.itemName}
              </Typography>
              <Typography variant="body2">
                SKU: {result.item.sku}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2">
                Previous Quantity: {result.oldQuantity}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                New Quantity: {result.newQuantity}
              </Typography>
              <Chip
                label={`+${result.newQuantity - result.oldQuantity}`}
                color="success"
                size="small"
                sx={{ marginTop: 1 }}
              />
            </Box>
          </>
        )}

        {!isSuccess && (
          <Typography variant="body2">
            {result.error || 'Failed to process QR code'}
          </Typography>
        )}

        <Button
          variant="contained"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          fullWidth
          sx={{
            backgroundColor: isSuccess ? 'success.dark' : 'error.dark',
            '&:hover': {
              backgroundColor: isSuccess ? 'success.main' : 'error.main'
            }
          }}
        >
          Scan Next Item
        </Button>
      </Stack>
    </Paper>
  );
}
