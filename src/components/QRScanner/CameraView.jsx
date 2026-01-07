/**
 * CameraView Component
 * Camera preview and scanning controls
 */

import { useEffect, useRef } from 'react';
import { Box, Button, Paper } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StopIcon from '@mui/icons-material/Stop';
import { Html5Qrcode } from 'html5-qrcode';
import { APP_CONFIG } from '../../utils/constants';

export default function CameraView({ isScanning, onScanSuccess, onScanError, onScanStart, onScanStop }) {
  const scannerRef = useRef(null);
  const readerIdRef = useRef('qr-reader');

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error('Error stopping scanner on unmount:', err);
        });
      }
    };
  }, []);

  const handleStartScan = async () => {
    try {
      const html5QrCode = new Html5Qrcode(readerIdRef.current);
      scannerRef.current = html5QrCode;

      const config = {
        fps: APP_CONFIG.SCANNER_FPS,
        qrbox: {
          width: APP_CONFIG.SCANNER_QRBOX_SIZE,
          height: APP_CONFIG.SCANNER_QRBOX_SIZE
        },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Scanning errors are frequent, so we don't log them
        }
      );

      onScanStart();
    } catch (err) {
      console.error('Error starting scanner:', err);
      onScanError(err.message || 'Failed to start camera. Please ensure camera permissions are granted.');
    }
  };

  const handleStopScan = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        onScanStop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      <Box
        id={readerIdRef.current}
        sx={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: '#000',
          minHeight: isScanning ? '300px' : '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!isScanning && (
          <Box sx={{ textAlign: 'center', color: 'white', padding: 3 }}>
            Click "Start Scanning" to begin
          </Box>
        )}
      </Box>

      <Box sx={{ marginTop: 2, textAlign: 'center' }}>
        {!isScanning ? (
          <Button
            variant="contained"
            size="large"
            startIcon={<CameraAltIcon />}
            onClick={handleStartScan}
            fullWidth
          >
            Start Scanning
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="large"
            color="error"
            startIcon={<StopIcon />}
            onClick={handleStopScan}
            fullWidth
          >
            Stop Scanning
          </Button>
        )}
      </Box>
    </Paper>
  );
}
