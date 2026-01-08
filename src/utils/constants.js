// Google OAuth and API configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const GOOGLE_SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
export const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || 'Sheet1';

// Debug logging
console.log('🔧 Configuration loaded:', {
  hasClientId: !!GOOGLE_CLIENT_ID,
  hasSheetId: !!GOOGLE_SHEET_ID,
  sheetName: SHEET_NAME,
  clientIdPreview: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'NOT SET',
  sheetIdPreview: GOOGLE_SHEET_ID ? GOOGLE_SHEET_ID.substring(0, 20) + '...' : 'NOT SET'
});

// Google API scopes
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
].join(' ');

// Google API Discovery Docs
export const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4'
];

// Sheet column indices (0-based)
export const COLUMNS = {
  ID: 0,
  ITEM_NAME: 1,
  SKU: 2,
  TOTAL_SALES: 3,
  QUANTITY: 4
};

// Sheet column letters (for updates)
export const COLUMN_LETTERS = {
  ID: 'A',
  ITEM_NAME: 'B',
  SKU: 'C',
  TOTAL_SALES: 'D',
  QUANTITY: 'E'
};

// App configuration
export const APP_CONFIG = {
  QR_CODE_SIZE: 256,
  SCANNER_FPS: 10,
  SCANNER_QRBOX_SIZE: 250,
  DATA_HEADER_ROW: 1, // Row 1 is header
  DATA_START_ROW: 2   // Data starts from row 2
};
