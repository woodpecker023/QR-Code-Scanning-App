/**
 * CameraView Component
 * Camera preview and scanning controls
 * Using jsQR for better iOS compatibility
 */

import { useEffect, useRef, useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StopIcon from '@mui/icons-material/Stop';
import jsQR from 'jsqr';

export default function CameraView({ isScanning, onScanSuccess, onScanError, onScanStart, onScanStop }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const stopScanning = () => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Check if video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Scan for QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      console.log('QR Code detected:', code.data);

      // Draw detection box (visual feedback)
      context.beginPath();
      context.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
      context.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
      context.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
      context.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
      context.closePath();
      context.strokeStyle = '#00FF00';
      context.lineWidth = 4;
      context.stroke();

      // Call success callback
      onScanSuccess(code.data);
      return; // Stop scanning after successful detection
    }

    // Continue scanning
    animationFrameRef.current = requestAnimationFrame(scanQRCode);
  };

  const handleStartScan = async () => {
    setCameraError(null);

    try {
      console.log('Starting camera...');

      // Request camera access
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      console.log('Camera stream obtained');

      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, starting scan loop');
          videoRef.current.play();
          onScanStart();
          scanQRCode(); // Start scanning
        };
      }

    } catch (err) {
      console.error('Camera error:', err);

      let errorMsg = 'Failed to start camera.';

      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera access denied. Please allow camera access in Settings > Safari > Camera.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError') {
        errorMsg = 'Camera is already in use by another app.';
      } else {
        errorMsg = err.message || errorMsg;
      }

      setCameraError(errorMsg);
      onScanError(errorMsg);
    }
  };

  const handleStopScan = () => {
    stopScanning();
    onScanStop();
  };

  return (
    <Paper elevation={2} sx={{ padding: 2 }}>
      {cameraError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {cameraError}
        </Alert>
      )}

      <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            borderRadius: '8px',
            backgroundColor: '#000',
            display: isScanning ? 'block' : 'none'
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: isScanning ? 'block' : 'none',
            pointerEvents: 'none'
          }}
        />

        {!isScanning && (
          <Box
            sx={{
              width: '100%',
              minHeight: '300px',
              borderRadius: '8px',
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              padding: 3
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1">Click "Start Scanning" to begin</Typography>
              <Typography variant="caption" sx={{ marginTop: 1, display: 'block', opacity: 0.7 }}>
                Make sure to allow camera access when prompted
              </Typography>
            </Box>
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
