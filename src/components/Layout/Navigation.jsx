/**
 * Navigation Component
 * Toggle between Generate QR and Scan QR modes
 */

import { Tabs, Tab, Box } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

export default function Navigation({ activeTab, onTabChange }) {
  const handleChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        centered
        variant="fullWidth"
      >
        <Tab
          icon={<QrCode2Icon />}
          label="Generate QR"
          value="generate"
          sx={{ textTransform: 'none', minHeight: 64 }}
        />
        <Tab
          icon={<QrCodeScannerIcon />}
          label="Scan QR"
          value="scan"
          sx={{ textTransform: 'none', minHeight: 64 }}
        />
      </Tabs>
    </Box>
  );
}
