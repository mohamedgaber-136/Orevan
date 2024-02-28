import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { FireBaseContext } from '../../Context/FireBase';
import { useContext, useState,useEffect } from 'react';
const Tov = ({SetError,formErrors,setSelectedOptions,selectedOptions}) => {
  // const [openModal, setOpenModal] = useState(false);
  const [checkText, setcheckText] = useState(true);
  const [currentOption, setCurrentOption] = useState(null);
  const [textValue, setTextValue] = useState('');
  const {newEvent,setNewEvent}=useContext(FireBaseContext)
  

  const checkTxtValue = (e,item,i)=>{
    selectedOptions[i].value=e.target.value
}
const sendData =()=>{
  setNewEvent({
    ...newEvent,["TransferOfValue"]:selectedOptions   
   }) 
}
const options = [{types:' Registration Fees',value:0}, {types:'Meals ',value:0}, {types:'Accommodation',value:0},{types:'Medical Utlitities',value:0},{types:'CME Hours',value:0},
{types:'Transportation',value:0}];
return (
  <>
    <div style={{borderBottom:'1px solid black'}} className='mb-1'>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={options}
        getOptionLabel={(option) => option.types}
        // value={newEvent['TransferOfValues']}
        filterSelectedOptions 
       onChange={(e,value)=>{
        setNewEvent({
        ...newEvent,["TransferOfValue"]:value   
       })    
       setSelectedOptions([...value])
      }
    
    }
       isOptionEqualToValue={(option, value) => option.types === value.types}
          renderInput={(params) => (
          <TextField
            {...params}
            label={<b>Transfer Of Values</b>}
            className='dropDownBorder '
          />
        )}
      />
    </div>
     <div>
     <ul className='p-0 d-flex flex-wrap gap-1 '>
       {selectedOptions.map((savedObject, index) => (
         <li key={index}   className='border d-flex flex-column p-2 rounded wrappingItems ' style={{width:'40%'}} >
           <p className='m-0'>Tov : {savedObject.types} </p>
           {/* <p className='m-0'> Value : {savedObject.textValue}</p> */}
           <TextField onChange={(e)=>checkTxtValue(e,savedObject.option,index)} />
         </li>
       ))}
     </ul>
       <button type='button' onClick={sendData} >save</button>
   </div>
   </>
  );
};

export default Tov;
 // multiple
    // id="tags-outlined"
    // options={options}
    // getOptionLabel={(option) => option.types}
    // value={selectedOptions}
    // filterSelectedOptions 
        // multiple
        // options={options}
        // value={selectedOptions.map((option) => option)}
        // onChange={()=>console.log('hi')}
        // disableCloseOnSelect
        // filterSelectedOptions
        // getOptionLabel={(option) => option}
        // renderOption={(props, option) => (
        //   <li {...props} onClick={() => handleOpenModal(option)}>
        //     {option}
        //   </li>
        // )}
        // renderInput={(params) => (
        //   <TextField {...params} label="Transfer of values" />
        // )}


          {/* <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          <h2>{currentOption}</h2>
          <div className="d-flex align-items-center gap-2">

          <TextField
            label="Enter value"
            value={textValue}
            onChange={handleTextFieldChange}
            />
            {checkText&&<small className='text-danger'>Please Set a value</small>}
          <button  onClick={handleSave} className={checkText?"bg-secondary text-white rounded":"wrappingItems"} disabled={checkText}>Save</button>
            </div>
        </DialogContent>
      </Dialog> */}

      {/* Display saved selections */}

         // if(value.length!==0){
        //   SetError({...formErrors,[type]:''})
        // }else{
        //   SetError({...formErrors,[type]:'Required'})
        // }
        // setValues(value)