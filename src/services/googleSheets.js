/**
 * Google Sheets Service
 * Handles all interactions with Google Sheets API
 */

import {
  GOOGLE_SHEET_ID,
  SHEET_NAME,
  COLUMNS,
  COLUMN_LETTERS,
  APP_CONFIG
} from '../utils/constants';

/**
 * Get all items from Google Sheet
 * @returns {Promise<Array>} Array of item objects
 */
export async function getAllItems() {
  try {
    // Check if gapi is initialized
    if (!window.gapi || !window.gapi.client || !window.gapi.client.sheets) {
      throw new Error('Google API client not initialized. Please sign in again.');
    }

    const range = `${SHEET_NAME}!A${APP_CONFIG.DATA_START_ROW}:E`;

    console.log('Fetching from range:', range);
    console.log('Sheet ID:', GOOGLE_SHEET_ID);

    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: range,
    });

    console.log('API Response:', response);

    const rows = response.result.values;

    if (!rows || rows.length === 0) {
      console.warn('No data found in sheet');
      return [];
    }

    console.log('Found rows:', rows.length);

    // Convert rows to item objects
    const items = rows.map((row, index) => ({
      id: row[COLUMNS.ID] || '',
      itemName: row[COLUMNS.ITEM_NAME] || '',
      sku: row[COLUMNS.SKU] || '',
      totalSales: row[COLUMNS.TOTAL_SALES] || '0',
      quantity: row[COLUMNS.QUANTITY] || '0',
      rowIndex: index + APP_CONFIG.DATA_START_ROW // Actual row number in sheet
    }));

    console.log('Parsed items:', items);
    return items;
  } catch (error) {
    console.error('Error fetching items from Google Sheets:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      result: error.result,
      body: error.body
    });

    // Better error message
    let errorMessage = 'Failed to fetch items';
    if (error.result && error.result.error) {
      errorMessage = error.result.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      errorMessage = `HTTP ${error.status}: ${error.statusText || 'Unknown error'}`;
    }

    throw new Error(errorMessage);
  }
}

/**
 * Update quantity for a specific item
 * @param {string|number} itemId - ID of the item to update
 * @param {number} newQuantity - New quantity value
 * @returns {Promise<Object>} Update result
 */
export async function updateQuantity(itemId, newQuantity) {
  try {
    // First, get all items to find the row number
    const items = await getAllItems();
    const item = items.find(i => String(i.id) === String(itemId));

    if (!item) {
      throw new Error(`Item with ID ${itemId} not found in sheet`);
    }

    const rowNumber = item.rowIndex;
    const range = `${SHEET_NAME}!${COLUMN_LETTERS.QUANTITY}${rowNumber}`;

    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: range,
      valueInputOption: 'RAW',
      resource: {
        values: [[newQuantity]]
      }
    });

    console.log(`Updated item ${itemId} quantity to ${newQuantity} at row ${rowNumber}`);

    return {
      success: true,
      itemId: itemId,
      newQuantity: newQuantity,
      rowNumber: rowNumber,
      response: response.result
    };
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw new Error(`Failed to update quantity: ${error.message}`);
  }
}

/**
 * Get a single item by ID
 * @param {string|number} itemId - ID of the item
 * @returns {Promise<Object|null>} Item object or null if not found
 */
export async function getItemById(itemId) {
  try {
    const items = await getAllItems();
    return items.find(i => String(i.id) === String(itemId)) || null;
  } catch (error) {
    console.error('Error getting item by ID:', error);
    throw new Error(`Failed to get item: ${error.message}`);
  }
}

/**
 * Validate sheet structure
 * Checks if the sheet has the expected columns
 * @returns {Promise<boolean>}
 */
export async function validateSheetStructure() {
  try {
    const range = `${SHEET_NAME}!A1:E1`;

    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: range,
    });

    const headers = response.result.values?.[0];

    if (!headers || headers.length < 5) {
      throw new Error('Sheet does not have required columns. Expected: ID, Item Name, SKU, Total Sales, Quantity');
    }

    return true;
  } catch (error) {
    console.error('Error validating sheet structure:', error);
    throw new Error(`Sheet validation failed: ${error.message}`);
  }
}
