import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';

const Test = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentOption, setCurrentOption] = useState(null);
  const [allData,setAllData]=useState([])
const [currentValue,setCurrentValue]=useState(0)
const [ChosenOption,setChosen]=useState()
  const handleAutocompleteChange = (event, newValue) => {
    setSelectedOptions(newValue);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOptionClick = (option) => {
    setCurrentOption(option);
    handleOpenModal();
  };

  const options = ['Option 1', 'Option 2', 'Option 3'];
const setData = ()=>{
  setAllData([...allData,{types:ChosenOption,value:currentValue}])
  handleCloseModal()
}
console.log(selectedOptions)
  return (
    <div>
      <Autocomplete
        multiple
        
        options={options}
        value={selectedOptions}
        onChange={handleAutocompleteChange}
        disableCloseOnSelect
        getOptionLabel={(option) => option}
        renderOption={(props, option, { selected }) => (
          <li {...props} onClick={()=>{
            setOpenModal(true)
            setChosen(option)
            setSelectedOptions([...selectedOptions,ChosenOption])
          }}>
          
            <ListItemText primary={option} />
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Select options" />
        )}
      />

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          <h5>{ChosenOption}</h5>
          <TextField onChange={(e)=>setCurrentValue(e.target.value)} value={currentValue} />
          <button onClick={setData}>Save</button>
          {/* Add your content for the modal */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Test;
