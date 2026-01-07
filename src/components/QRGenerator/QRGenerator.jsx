/**
 * QRGenerator Component
 * Container for QR code generation feature
 */

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ItemDropdown from './ItemDropdown';
import QRDisplay from './QRDisplay';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';
import { encodeItemData } from '../../services/qrCode';

export default function QRGenerator() {
  const { items, loading, error, fetchItems } = useGoogleSheets();
  const [selectedItem, setSelectedItem] = useState(null);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    // GAPI should be ready by the time user is authenticated
    fetchItems();
  }, [fetchItems]);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    if (item) {
      try {
        const encoded = encodeItemData(item);
        setQrData(encoded);
      } catch (err) {
        console.error('Error encoding item:', err);
      }
    } else {
      setQrData(null);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ paddingY: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Generate QR Code
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph align="center">
          Select an item from your inventory to generate a QR code
        </Typography>

        {error && (
          <>
            <ErrorMessage
              message={error}
              title="Failed to load items"
              severity="error"
            />
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => fetchItems()}
              disabled={loading}
              sx={{ marginBottom: 2 }}
            >
              Retry Loading Items
            </Button>
          </>
        )}

        {loading && !items.length ? (
          <LoadingSpinner message="Loading items from Google Sheets..." />
        ) : (
          <>
            <ItemDropdown
              items={items}
              selectedItem={selectedItem}
              onItemSelect={handleItemSelect}
              loading={loading}
            />

            {selectedItem && qrData && (
              <QRDisplay item={selectedItem} qrData={qrData} />
            )}

            {!selectedItem && items.length > 0 && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ marginTop: 3 }}>
                Select an item from the dropdown to generate its QR code
              </Typography>
            )}

            {!loading && items.length === 0 && !error && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ marginTop: 3 }}>
                No items found in your Google Sheet. Please add items first.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}
