/**
 * QRDisplay Component
 * Displays generated QR code with download and print options
 */

import { useState, useRef } from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { QRCodeCanvas } from 'qrcode.react';
import { APP_CONFIG } from '../../utils/constants';

export default function QRDisplay({ item, qrData }) {
  const qrRef = useRef(null);

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${item.sku}_${item.itemName}.png`;
      link.click();
    }
  };

  const handlePrint = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const printWindow = window.open('', '_blank');
      const url = canvas.toDataURL('image/png');

      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .qr-container {
                text-align: center;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              h2 {
                margin: 10px 0;
              }
              p {
                margin: 5px 0;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>${item.itemName}</h2>
              <p>SKU: ${item.sku}</p>
              <img src="${url}" alt="QR Code" />
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Typography variant="h6" gutterBottom>
        {item.itemName}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        SKU: {item.sku} | Quantity: {item.quantity}
      </Typography>

      <Box ref={qrRef} sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1 }}>
        <QRCodeCanvas
          value={qrData}
          size={APP_CONFIG.QR_CODE_SIZE}
          level="H"
          includeMargin={true}
        />
      </Box>

      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          fullWidth
        >
          Download
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          fullWidth
        >
          Print
        </Button>
      </Stack>
    </Paper>
  );
}
