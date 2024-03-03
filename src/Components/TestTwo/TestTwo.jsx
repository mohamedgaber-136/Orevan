import React, { useContext, useState } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { FireBaseContext } from '../../Context/FireBase';
const TestTwo = ({condition,SetError,formErrors}) => {
  const [selectedTime, setSelectedTime] = useState('12:00');
  const {setNewEvent,newEvent} = useContext(FireBaseContext)

//   const handleTimeChange = (time) => {
//     setSelectedTime(time);
//   };
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
    <div className=' w-100 h-100 ' >
      <TimePicker value={selectedTime} onChange={handleTimeChange}   disableClock={true}      />
    </div>
  );
};

export default TestTwo;
