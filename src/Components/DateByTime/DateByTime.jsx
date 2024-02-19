import TimePicker from "@material-ui/lab/TimePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { TextField } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
export const DateByTime = ({condition}) => {
    const [value, setValue] = useState('');
    const {setNewEvent,newEvent} = useContext(FireBaseContext)
    useEffect(()=>{
      if(condition){
        setValue(newEvent["Date From Hours"]);
      }else{
        setValue(newEvent["Date End Hours"]);
      }
          },[newEvent["Date From Hours"],newEvent["Date End Hours"]])
        return (  
          <div className="border border-2 rounded rounded-2">
          <LocalizationProvider dateAdapter={AdapterDateFns}  >
            <TimePicker   
              value={value}
              onChange={(newValue) => {
                const numericDate = new Date(newValue).getTime();
                  const formattedDate = new Date(numericDate).toLocaleString();
                  setValue(formattedDate.split(',')[1])
                  if(condition){
                    setNewEvent({...newEvent,"Date From Hours":value})
                  }else{
                    setNewEvent({...newEvent,"Date End Hours":value})
                  }             
              }}
              renderInput={(startProps) => (
                  <>
                  <TextField {...startProps}  />
                </>
              )}
              />
          </LocalizationProvider>
          </div>   
      )
            }  

