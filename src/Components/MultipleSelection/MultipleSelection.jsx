import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { FireBaseContext } from '../../Context/FireBase';
import { useContext, useState } from 'react';

export default function MultipleSelection({type,list,SetError,formErrors,label}) {
  const {newEvent,setNewEvent}=useContext(FireBaseContext)
  const [valus,setValues]=useState(null)
   return (
    <Stack spacing={3} sx={{ width: 500 }} className='errorParent '>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={list}
        getOptionLabel={(option) => option.types}
        value={newEvent[type]}
        filterSelectedOptions 
       onChange={(e,value)=>{
        if(value.length!=0){
          SetError({...formErrors,[type]:''})
        }else{
          SetError({...formErrors,[type]:'Required'})
        }
        setValues(value)
        setNewEvent({
        ...newEvent,[type]:value
       })
      }}
       isOptionEqualToValue={(option, value) => option.types === value.types}
          renderInput={(params) => (
          <TextField
            {...params}
            label={`${label}`}
            className='dropDownBorder'
          />
        )}
        
      />
  
    </Stack>
  );
}
