/**
 * QR Code Service
 * Handles encoding and decoding of item data for QR codes
 */

/**
 * Encode item data to JSON string for QR code
 * @param {Object} item - Item object with id, itemName, sku, totalSales, quantity
 * @returns {string} JSON string representation of item
 */
export function encodeItemData(item) {
  try {
    const qrData = {
      id: item.id,
      itemName: item.itemName,
      sku: item.sku,
      totalSales: item.totalSales,
      quantity: item.quantity
    };
    return JSON.stringify(qrData);
  } catch (error) {
    console.error('Error encoding item data:', error);
    throw new Error('Failed to encode item data for QR code');
  }
}

/**
 * Decode QR code string back to item object
 * @param {string} qrString - JSON string from QR code
 * @returns {Object} Item object
 * @throws {Error} If QR string is invalid or missing required fields
 */
export function decodeItemData(qrString) {
  try {
    const item = JSON.parse(qrString);

    // Validate required fields
    const requiredFields = ['id', 'itemName', 'sku', 'totalSales', 'quantity'];
    const missingFields = requiredFields.filter(field => !(field in item));

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return {
      id: item.id,
      itemName: item.itemName,
      sku: item.sku,
      totalSales: item.totalSales,
      quantity: item.quantity
    };
  } catch (error) {
    console.error('Error decoding QR data:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Invalid QR code format');
    }
    throw error;
  }
}

/**
 * Validate item data structure
 * @param {Object} item - Item object to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
export function validateItemData(item) {
  if (!item || typeof item !== 'object') {
    throw new Error('Item must be an object');
  }

  if (typeof item.id === 'undefined' || item.id === null) {
    throw new Error('Item ID is required');
  }

  if (!item.itemName || typeof item.itemName !== 'string') {
    throw new Error('Item name must be a non-empty string');
  }

  if (typeof item.quantity === 'undefined' || isNaN(item.quantity)) {
    throw new Error('Quantity must be a number');
  }

  return true;
}
