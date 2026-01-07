/**
 * useGoogleSheets Hook
 * Custom hook for Google Sheets operations with state management
 */

import { useState, useCallback, useEffect } from 'react';
import { getAllItems, updateQuantity, getItemById } from '../services/googleSheets';

export function useGoogleSheets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllItems();
      setItems(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching items:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItemQuantity = useCallback(async (itemId, newQuantity) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateQuantity(itemId, newQuantity);

      setItems(prevItems =>
        prevItems.map(item =>
          String(item.id) === String(itemId)
            ? { ...item, quantity: String(newQuantity) }
            : item
        )
      );

      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error updating quantity:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getItem = useCallback(async (itemId) => {
    setLoading(true);
    setError(null);

    try {
      const item = await getItemById(itemId);
      return item;
    } catch (err) {
      setError(err.message);
      console.error('Error getting item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshItems = useCallback(() => {
    return fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    updateItemQuantity,
    getItem,
    refreshItems
  };
}
