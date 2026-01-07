/**
 * Google Authentication Service
 * Handles OAuth initialization and token management
 */

import { GOOGLE_SCOPES } from '../utils/constants';

let gapiInited = false;
let tokenClient = null;

/**
 * Initialize Google API client
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<void>}
 */
export async function initializeGapi(accessToken) {
  return new Promise((resolve, reject) => {
    if (gapiInited && gapi.client.sheets) {
      gapi.client.setToken({ access_token: accessToken });
      resolve();
      return;
    }

    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: undefined, // Not using API key, using OAuth
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        });

        // Wait for the discovery doc to fully load
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Verify sheets API is loaded
        if (!gapi.client.sheets) {
          throw new Error('Sheets API failed to load');
        }

        gapi.client.setToken({ access_token: accessToken });
        gapiInited = true;

        console.log('GAPI initialized successfully');
        console.log('Sheets API available:', !!gapi.client.sheets);
        resolve();
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
        reject(error);
      }
    });
  });
}

/**
 * Check if user is authenticated
 * @param {Object} user - User object from @react-oauth/google
 * @returns {boolean}
 */
export function isAuthenticated(user) {
  return !!user;
}

/**
 * Get access token from credentials
 * @param {Object} credentials - Token response from Google OAuth
 * @returns {string|null} Access token
 */
export function getAccessToken(credentials) {
  return credentials?.access_token || null;
}

/**
 * Handle sign out
 * Clears gapi tokens
 */
export function handleSignOut() {
  if (gapiInited && gapi.client.getToken()) {
    gapi.client.setToken(null);
  }
}

/**
 * Check if gapi is initialized
 * @returns {boolean}
 */
export function isGapiInitialized() {
  return gapiInited;
}
