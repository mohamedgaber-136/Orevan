import React, { memo, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FireBaseContext } from '../../Context/FireBase';

const TimePicker = ({condition,SetError,formErrors}) => {
  const {setNewEvent,newEvent} = useContext(FireBaseContext)
  const handleTimeChange = (time) => {
    if(time!=null){
      const timing =time.toLocaleTimeString()
      if(condition){
        setNewEvent({...newEvent,DateFromHours:timing})
        SetError({...formErrors,DateFromHours:''})
      }else{
        setNewEvent({...newEvent,DateEndHours:timing})
        SetError({...formErrors,DateEndHours:''})
      } 
    }else{
      if(condition){
        SetError({...formErrors,DateFromHours:'Required'})
      }else{
        SetError({...formErrors,DateEndHours:'Required'})
      } 
    }
    };

  return (
    <div className='timePikcerParent greyBgc h-100 dropDownBorder p-2 overflow-x-hidden d-flex justify-content-start align-items-center'>
    <div className=" rounded rounded-2 ">
              <DatePicker 
        onChange={handleTimeChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={10}
        dateFormat="h:mm aa"
        timeCaption="Time"
        value= {condition?newEvent.DateFromHours:newEvent.DateEndHours}
        className=' border-0 bg-transparent'
        placeholderText='3:00 PM'
      />
    </div>
    </div>

  );
};

export default memo (TimePicker);
