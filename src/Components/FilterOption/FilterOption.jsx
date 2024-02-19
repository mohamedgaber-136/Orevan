import {useEffect, useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function FilterOption({setSearchType}) {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
useEffect(()=>{setSearchType(age)},[
  age
])
  return (
    <FormControl sx={{ minWidth: 120 ,border:'1px solid black ',borderRadius:2}} size="small" >
      <InputLabel id="demo-select-small-label" className='bg-white'>Filters</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        name='select'
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={'Cost'}>Cost/Delegate</MenuItem>
        <MenuItem value={'EventCost'}>EventCost</MenuItem>
        <MenuItem value={'Status'}>Status</MenuItem>
      </Select>
    </FormControl>
  );
}