import {useState} from "react";
import { ColorPicker,createColor } from "material-ui-color";
import { makeStyles } from "@material-ui/core";
import { FireBaseContext } from '../../Context/FireBase';
import { useContext, } from 'react';
const ColorPickers = ({type}) => {
  const {newEvent,setNewEvent} = useContext(FireBaseContext)
  const useStyles = makeStyles({
    root: {
      border: "1px solid red"
    }
  });
  const [color, setColor] = useState(createColor(newEvent[type]));
  const handleChange = (value) => {
    setColor(value);
    setNewEvent({...newEvent,[type]:value.css.backgroundColor})
  }; 

  return ( <>


    <ColorPicker  value={color} onChange={handleChange}    />

     </>
  );
}

export default ColorPickers;
