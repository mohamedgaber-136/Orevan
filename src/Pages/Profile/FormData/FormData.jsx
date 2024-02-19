import TextField from '@mui/material/TextField';
import './FormDataStyle.css'

export const FormData = ({ColOne,ColTwo}) => {   

  return (
         <div className='container  '> 
            <div className='d-flex  gap-2 gap-md-5 px-md-4 px-2  justify-content-center align-item-center'>
                <div className='d-flex gap-5 flex-column w-50 '>
                  {ColOne.map((item,indx)=>
                    <TextField name={item.label}   key={indx} label={item.label} focused defaultValue={item.defaultValue}   />        
)}
                </div>
                <div className='d-flex gap-5 flex-column w-50 '>
                {ColTwo.map((item,indx)=> <TextField key={indx} name={item.label} label={item.label} focused defaultValue={item.defaultValue}   />
                
                
)}               
                </div>     
                </div>
                </div>
                  
  )
}
