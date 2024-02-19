import {useContext, useState}from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { SearchContext } from '../../Context/SearchContext';

export default function CheckboxesGroup() {
  const [singlState,setSingleState]=useState({
    Name:true,
    Email:true,
    MedicalLicense:true,
    Telephone:true,
    City:true,
    Speciality:true,
    LicenseID:true,
    Organization:true,

  })
  const handleChangeSingle = (e) => {
    setSingleState({...singlState,[e.target.name]:e.target.checked})
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel control={
              <Checkbox checked={singlState.Name} name={`Name`} />
            }
            label={`Name`} 
          />
          <FormControlLabel control={
              <Checkbox checked={singlState.Email} name={`Email`} />
            }
            label={`Email`} 
          />
          <FormControlLabel control={
              <Checkbox checked={singlState.MedicalLicense} name={`MedicalLicense`} />
            }
            label={`MedicalLicense`} 
          />
          <FormControlLabel control={
              <Checkbox checked={singlState.Telephone} name={`Telephone`} />
            }
            label={`Telephone`} 
          />
          <FormControlLabel control={
              <Checkbox checked={singlState.City} name={`City`} />
            }
            label={`City`} 
          />
          <FormControlLabel control={
              <Checkbox checked={singlState.Speciality} name={`Speciality`} />
            }
            label={`Speciality`} 
          />
          <FormControlLabel control={
              <Checkbox checked={singlState.LicenseID} name={`LicenseID`} />
            }
            label={`LicenseID`} 
          />
          <FormControlLabel control={
              <Checkbox checked={singlState.Organization}  name={`Organization`}  />
            }
            label={`Organization`} 
          />
     
        </FormGroup>
      </FormControl>
  
    </Box>
  );
}