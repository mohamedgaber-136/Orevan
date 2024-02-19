import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
export const SelectComponent = ({setdate,date}) => {
  const handleChange = (event) => {
    setdate(event.target.value);
  };
  return (
    <FormControl      
    sx={{ m: 0, minWidth: 20 }}>
    <Select
      value={date}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }} 
    >
      <MenuItem value="This Month">
        <span>This Month</span>
      </MenuItem>
      <MenuItem value="This Day">This Day</MenuItem>
      <MenuItem value="This Week">This Week</MenuItem>
    </Select>
  </FormControl>  )
}
