import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { FireBaseContext } from '../../Context/FireBase';
import { useContext, useState,useEffect } from 'react';
const Tov = ({SetError,formErrors}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentOption, setCurrentOption] = useState(null);
  const [textValue, setTextValue] = useState('');
  const {newEvent,setNewEvent}=useContext(FireBaseContext)
  
  const handleAutocompleteChange = (event, newValue) => {
    setSelectedOptions(newValue);
  };

  const handleOpenModal = (option) => {
    setCurrentOption(option);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setCurrentOption(null);
    setOpenModal(false);
  };

  const handleTextFieldChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleSave = () => {
    // Save the value of the TextField and the selected option
    const savedObject = {
      option: currentOption,
      textValue: textValue,
    };

    // Update the state with the saved object
    setSelectedOptions([...selectedOptions, savedObject]);
    // Close the modal
    handleCloseModal();
    console.log(selectedOptions,'selectedOptions2')
  };
  useEffect(()=>{
    if(selectedOptions.length!==0){
      SetError({...formErrors,TransferOfValue:''})
    }else{
      SetError({...formErrors,TransferOfValue:'Required'})
    }
    setNewEvent({
      ...newEvent,TransferOfValue:[...selectedOptions]})
  },[selectedOptions])
  const options = [' Registration Fees', 'Meals ', 'Accommodation','Medical Utlitities','CME Hours',
'Transportation'];

  return (
    <>
    <div style={{borderBottom:'1px solid black'}} className='mb-1'>
      <Autocomplete
        multiple
        options={options}
        value={selectedOptions.map((option) => option.option)}
        onChange={handleAutocompleteChange}
        disableCloseOnSelect
        getOptionLabel={(option) => option}
        renderOption={(props, option) => (
          <li {...props} onClick={() => handleOpenModal(option)}>
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Transfer of values" />
        )}
      />

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          <h2>{currentOption}</h2>
          <div className="d-flex align-items-center gap-2">

          <TextField
            label="Enter value"
            value={textValue}
            onChange={handleTextFieldChange}
            />
          <button onClick={handleSave} className='wrappingItems'>Save</button>
            </div>
        </DialogContent>
      </Dialog>

      {/* Display saved selections */}
     
    </div>
     <div>
     <ul className='p-0 d-flex flex-wrap gap-1 '>
       {selectedOptions.map((savedObject, index) => (
         <li key={index} className='border d-flex flex-column p-2 rounded wrappingItems ' style={{width:'40%'}}>
           <p className='m-0'>Tov : {savedObject.option} </p>
           <p className='m-0'> Value : {savedObject.textValue}</p>
         </li>
       ))}
     </ul>
   </div>
   </>
  );
};

export default Tov;
