import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useContext } from "react";
import { FireBaseContext } from "../../../Context/FireBase";
export const FranchisedropDown = ({ SetError, formErrors }) => {
  const { newEvent, setNewEvent } = useContext(FireBaseContext);
  const handleChange = (event) => {
    setNewEvent({ ...newEvent, Franchise: event.target.value });
    if (event.target.value) {
      SetError({ ...formErrors, Franchise: "" });
    } else {
      SetError({ ...formErrors, Franchise: "Required" });
    }
  }
  const data = [   { types: "Cardio Metabolic Franchise" },
  { types: "RetinaFranchise ",label:'Retina Franchise ' },
  { types: "MedicalFranchise" ,label:'Medical Franchise'},
 ]
  return (
    <>
      <FormControl variant="standard" className=" w-100">
        <InputLabel id="demo-simple-select-standard-label">
          Franchise
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          name="Franchise"
          value={newEvent.Franchise}
          onChange={handleChange}
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
            data.map((item,index)=><MenuItem value={item.types} key={index}>{item.label}</MenuItem>
            )
          }
        </Select>
      </FormControl>
    </>
  );
};

{
  /* <FormControl fullWidth className='franchiseDropDown rounded border border-5 ' >
    <InputLabel id="demo-simple-select-label" className='bg-white px-1  '>Franchise</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      name="Franchise"
      value={newEvent.Franchise}
      onChange={handleChange}
    >
      <MenuItem value={"10"}>Ten</MenuItem>
      <MenuItem value={"20"}>Twenty</MenuItem>
      <MenuItem value={"30"}>Thirty</MenuItem>
    </Select>
  </FormControl> */
}
