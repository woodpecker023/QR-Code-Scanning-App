/**
 * ItemDropdown Component
 * Dropdown populated with items from Google Sheets
 */

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function ItemDropdown({ items, selectedItem, onItemSelect, loading }) {
  const handleChange = (event) => {
    const itemId = event.target.value;
    const item = items.find(i => i.id === itemId);
    onItemSelect(item);
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: 3 }}>
      <InputLabel id="item-select-label">Select Item</InputLabel>
      <Select
        labelId="item-select-label"
        id="item-select"
        value={selectedItem?.id || ''}
        label="Select Item"
        onChange={handleChange}
        disabled={loading || items.length === 0}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.itemName} - {item.sku}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
