/**
 * QRScanner Component
 * Container for QR code scanning feature
 */

import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import CameraView from './CameraView';
import ScanResult from './ScanResult';
import ErrorMessage from '../Common/ErrorMessage';
import SuccessMessage from '../Common/SuccessMessage';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';
import { decodeItemData } from '../../services/qrCode';

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { updateItemQuantity } = useGoogleSheets();

  const handleScanSuccess = async (decodedText) => {
    setIsScanning(false);
    setError(null);

    try {
      const itemData = decodeItemData(decodedText);

      const oldQuantity = parseInt(itemData.quantity) || 0;
      const newQuantity = oldQuantity + 1;

      await updateItemQuantity(itemData.id, newQuantity);

      setScanResult({
        success: true,
        item: itemData,
        oldQuantity: oldQuantity,
        newQuantity: newQuantity
      });

      setSuccessMessage(`Successfully updated ${itemData.itemName} quantity to ${newQuantity}`);
    } catch (err) {
      console.error('Error processing scan:', err);
      setScanResult({
        success: false,
        error: err.message
      });
      setError(err.message);
    }
  };

  const handleScanError = (errorMessage) => {
    setError(errorMessage);
    setIsScanning(false);
  };

  const handleReset = () => {
    setScanResult(null);
    setError(null);
    setSuccessMessage('');
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);
  };

  const handleScanStop = () => {
    setIsScanning(false);
  };

  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ paddingY: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Scan QR Code
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph align="center">
          Point your camera at a QR code to scan and update inventory
        </Typography>

        {error && !scanResult && (
          <ErrorMessage
            message={error}
            title="Camera Error"
            severity="error"
            onClose={() => setError(null)}
          />
        )}

        <CameraView
          isScanning={isScanning}
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
          onScanStart={handleScanStart}
          onScanStop={handleScanStop}
        />

        <ScanResult result={scanResult} onReset={handleReset} />

        {!isScanning && !scanResult && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ marginTop: 3 }}
          >
            Click "Start Scanning" to use your camera and scan QR codes
          </Typography>
        )}

        <SuccessMessage
          open={!!successMessage}
          message={successMessage}
          onClose={handleCloseSuccess}
        />
      </Box>
    </Container>
  );
}
