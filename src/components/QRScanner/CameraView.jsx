/**
 * CameraView Component
 * Camera preview and scanning controls
 */

import { useEffect, useRef, useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StopIcon from '@mui/icons-material/Stop';
import { Html5Qrcode } from 'html5-qrcode';
import { APP_CONFIG } from '../../utils/constants';

export default function CameraView({ isScanning, onScanSuccess, onScanError, onScanStart, onScanStop }) {
  const scannerRef = useRef(null);
  const readerIdRef = useRef('qr-reader');
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => {
          console.error('Error stopping scanner on unmount:', err);
        });
      }
    };
  }, []);

  const handleStartScan = async () => {
    setCameraError(null);

    try {
      console.log('Starting camera...');
      const html5QrCode = new Html5Qrcode(readerIdRef.current);
      scannerRef.current = html5QrCode;

      const config = {
        fps: APP_CONFIG.SCANNER_FPS,
        qrbox: {
          width: APP_CONFIG.SCANNER_QRBOX_SIZE,
          height: APP_CONFIG.SCANNER_QRBOX_SIZE
        },
        aspectRatio: 1.0,
        disableFlip: false
      };

      // Try to get available cameras first
      let cameraId = null;
      try {
        const devices = await Html5Qrcode.getCameras();
        console.log('Available cameras:', devices);

        if (devices && devices.length > 0) {
          // Prefer back camera
          const backCamera = devices.find(device =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          cameraId = backCamera ? backCamera.id : devices[0].id;
          console.log('Using camera:', cameraId);
        }
      } catch (devErr) {
        console.warn('Could not enumerate cameras:', devErr);
      }

      // Start scanning with camera ID or facingMode
      if (cameraId) {
        await html5QrCode.start(
          cameraId,
          config,
          (decodedText) => {
            console.log('QR Code detected:', decodedText);
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Scanning errors are frequent, so we don't log them
          }
        );
      } else {
        // Fallback to facingMode
        await html5QrCode.start(
          { facingMode: { exact: "environment" } },
          config,
          (decodedText) => {
            console.log('QR Code detected:', decodedText);
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Scanning errors are frequent, so we don't log them
          }
        );
      }

      console.log('Camera started successfully');
      onScanStart();
    } catch (err) {
      console.error('Error starting scanner:', err);
      const errorMsg = err.message || 'Failed to start camera. Please ensure camera permissions are granted.';
      setCameraError(errorMsg);
      onScanError(errorMsg);
    }
  };

  const handleStopScan = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        onScanStop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      {cameraError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {cameraError}
        </Alert>
      )}

      <Box
        id={readerIdRef.current}
        sx={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: '#000',
          minHeight: isScanning ? '400px' : '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!isScanning && (
          <Box sx={{ textAlign: 'center', color: 'white', padding: 3 }}>
            <Typography variant="body1">Click "Start Scanning" to begin</Typography>
            <Typography variant="caption" sx={{ marginTop: 1, display: 'block', opacity: 0.7 }}>
              Make sure to allow camera access when prompted
            </Typography>
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
