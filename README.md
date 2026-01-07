# QR Code Inventory Management System

A React-based mobile-friendly web application for managing inventory using QR codes with Google Sheets integration.

## Features

- **Generate QR Codes**: Select items from your Google Sheets inventory and generate QR codes
- **Scan QR Codes**: Use your phone camera to scan QR codes and automatically update inventory quantities
- **Google Sheets Integration**: All data is stored and managed in Google Sheets
- **Google Authentication**: Secure sign-in with Google OAuth
- **Mobile-Friendly**: Optimized for use on mobile browsers
- **Real-time Updates**: Instant inventory updates when scanning QR codes

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- A Google account
- A Google Cloud Console project

## Setup Instructions

### 1. Google Cloud Console Setup

#### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a Project" → "New Project"
3. Name your project (e.g., "QR Inventory App")
4. Click "Create"

#### Enable Required APIs

1. In your project, go to "APIs & Services" → "Library"
2. Search for and enable the following APIs:
   - **Google Sheets API**
   - **Google Drive API**

#### Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type → Click "Create"
3. Fill in the required information:
   - App name: "QR Inventory App"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. On the Scopes screen, click "Add or Remove Scopes"
6. Add the following scopes:
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/drive.file`
7. Click "Save and Continue"
8. Review and click "Back to Dashboard"

#### Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Name it "QR Inventory Web Client"
5. Under "Authorized JavaScript origins", add:
   - `http://localhost:5173`
6. Click "Create"
7. **Copy the Client ID** (you'll need this for the .env.local file)

### 2. Google Sheets Setup

#### Create Your Inventory Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Inventory"
4. In the first row (header row), create these exact columns:
   - **A1**: ID
   - **B1**: Item Name
   - **C1**: SKU
   - **D1**: Total Sales
   - **E1**: Quantity

#### Add Sample Data

Starting from row 2, add your inventory items. Example:

| ID | Item Name | SKU | Total Sales | Quantity |
|----|-----------|-----|-------------|----------|
| 1 | Widget A | WGT-001 | 150 | 25 |
| 2 | Gadget B | GDG-002 | 200 | 10 |
| 3 | Tool C | TL-003 | 75 | 50 |

#### Get the Sheet ID

1. Look at the URL of your Google Sheet
2. The URL format is: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
3. **Copy the SHEET_ID** (you'll need this for the .env.local file)

### 3. Application Setup

#### Install Dependencies

The dependencies are already listed in `package.json`. Install them by running:

```bash
npm install
```

#### Configure Environment Variables

1. Copy `.env.example` to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your values:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   VITE_GOOGLE_SHEET_ID=your_sheet_id_here
   VITE_SHEET_NAME=Sheet1
   ```

   Replace:
   - `your_client_id_here` with the Client ID from Google Cloud Console
   - `your_sheet_id_here` with the Sheet ID from your Google Sheet URL
   - `Sheet1` with your sheet tab name (if different)

### 4. Running the Application

#### Development Mode

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:5173`

#### Build for Production

Create an optimized production build:

```bash
npm run build
```

The build files will be in the `dist/` folder.

#### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## How to Use

### Sign In

1. Open the app in your browser
2. Click "Sign in with Google"
3. Grant the requested permissions (Sheets and Drive access)

### Generate QR Codes

1. Click the "Generate QR" tab
2. Select an item from the dropdown menu
3. A QR code will appear with the item details
4. Options:
   - **Download**: Save the QR code as a PNG image
   - **Print**: Print the QR code with item information

### Scan QR Codes

1. Click the "Scan QR" tab
2. Click "Start Scanning"
3. Grant camera permissions when prompted
4. Point your camera at a QR code
5. The app will:
   - Decode the QR code
   - Retrieve the item information
   - Increase the quantity by 1
   - Update the Google Sheet
   - Show a success message
6. Click "Scan Next Item" to scan another code

## Project Structure

```
src/
├── components/
│   ├── Auth/                 # Authentication components
│   │   ├── LoginButton.jsx
│   │   └── LogoutButton.jsx
│   ├── QRGenerator/          # QR code generation
│   │   ├── QRGenerator.jsx
│   │   ├── ItemDropdown.jsx
│   │   └── QRDisplay.jsx
│   ├── QRScanner/            # QR code scanning
│   │   ├── QRScanner.jsx
│   │   ├── CameraView.jsx
│   │   └── ScanResult.jsx
│   ├── Layout/               # App layout
│   │   ├── Header.jsx
│   │   └── Navigation.jsx
│   └── Common/               # Shared components
│       ├── LoadingSpinner.jsx
│       ├── ErrorMessage.jsx
│       └── SuccessMessage.jsx
├── services/                 # Business logic
│   ├── googleAuth.js         # OAuth integration
│   ├── googleSheets.js       # Sheets API operations
│   └── qrCode.js             # QR encoding/decoding
├── contexts/
│   └── AuthContext.jsx       # Global auth state
├── hooks/
│   ├── useAuth.js
│   └── useGoogleSheets.js
├── utils/
│   └── constants.js          # App configuration
├── App.jsx                   # Root component
└── main.jsx                  # Entry point
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool
- **Material-UI (MUI)** - UI component library
- **@react-oauth/google** - Google OAuth integration
- **gapi-script** - Google API client
- **qrcode.react** - QR code generation
- **html5-qrcode** - QR code scanning

## Troubleshooting

### Camera Not Working

- **Issue**: Camera doesn't start or permission denied
- **Solution**:
  - Ensure you're using HTTPS in production (localhost works for development)
  - Check browser camera permissions in settings
  - Try a different browser (Chrome or Safari recommended)

### Google Sheets Not Loading

- **Issue**: "Failed to fetch items" error
- **Solution**:
  - Verify your Google Sheet ID in `.env.local`
  - Ensure the sheet has the correct column structure
  - Check that you're signed in with the correct Google account
  - Verify the sheet tab name matches `VITE_SHEET_NAME`

### Invalid Token Error

- **Issue**: "Invalid token" or "Unauthorized" errors
- **Solution**:
  - Sign out and sign in again
  - Check OAuth scopes in Google Cloud Console
  - Verify your Client ID is correct in `.env.local`

### QR Code Scan Fails

- **Issue**: QR code doesn't scan or returns an error
- **Solution**:
  - Ensure good lighting
  - Hold the camera steady
  - Make sure the QR code was generated by this app
  - Try moving the camera closer or further away

### Dropdown is Empty

- **Issue**: No items appear in the dropdown
- **Solution**:
  - Check your Google Sheet structure (columns A-E with headers in row 1)
  - Verify data starts from row 2
  - Ensure the sheet is shared with your Google account

## Security Considerations

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Keep your Google Cloud Console credentials private
- Use HTTPS for production deployments
- Regularly review authorized apps in your Google account

## Future Enhancements

Potential features for future versions:

- Decrease quantity option (for inventory removal)
- Custom quantity adjustment (not just +1)
- Bulk QR code generation
- Multiple sheets support
- Offline mode with sync
- Analytics dashboard
- Export/import capabilities
- Barcode support
- Multi-user collaboration

## Support

If you encounter any issues:

1. Check the Troubleshooting section above
2. Review your Google Cloud Console setup
3. Verify your `.env.local` configuration
4. Check browser console for error messages

## License

This project is provided as-is for personal and commercial use.

---

Built with React + Vite + Material-UI + Google Sheets API
