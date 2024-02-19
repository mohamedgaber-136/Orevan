import DatePicker from "@material-ui/lab/DatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { TextField } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
const DateByYMD =({condition,SetError,formErrors})=>{
   const [value, setValue] = useState('');
const {setNewEvent,newEvent} = useContext(FireBaseContext)
useEffect(()=>{
  if(condition){
    setValue(newEvent.StartDate);
  }else{
    setValue(newEvent.EndDate);
  }
      },[newEvent.EndDate,newEvent.StartDate])


    return (
   <div className=" rounded rounded-2">
      <LocalizationProvider dateAdapter={AdapterDateFns}   >
        <DatePicker   
          value={value}
          onChange={(newValue) => {
            const numericDate = new Date(newValue).getTime();
            const formattedDate = new Date(numericDate).toLocaleString();
           if(condition){
              setNewEvent({...newEvent,StartDate:formattedDate.split(',')[0]})
              setValue(formattedDate.split(',')[0])
              if(newValue){
                SetError({...formErrors,CreatedAt:''})
              }else{
                SetError({...formErrors,CreatedAt:'Required'})
              }
            }else{
              setNewEvent({...newEvent,EndDate:formattedDate.split(',')[0]})
              setValue(formattedDate.split(',')[0])

              if(newValue){
                SetError({...formErrors,EndDate:''})
              }else{
                SetError({...formErrors,EndDate:'Required'})
              }
            }
          }}
         
          renderInput={(startProps) => (
            <>
              <TextField {...startProps} name={condition?'StartDate':'EndDate'} className="dateField" />
            </>
          )}
          />
      </LocalizationProvider>
          </div>
  )
        }
export default DateByYMD;
