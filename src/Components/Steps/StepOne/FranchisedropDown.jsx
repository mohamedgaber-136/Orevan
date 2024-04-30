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
  };

  const data = [
    { types: "Immunology Franchise",label:'Immunology' },
    { types: "NeuroscienceFranchise ", label: "Neuroscience  " },
    { types: "GTxFranchise ", label: "GTx  " },
    { types: "In Market BrandsFranchise", label: "In Market Brands " },
    { types: "OncologyFranchise", label: " Oncology" },
    { types: "CardiovascularFranchise", label: "Cardiovascular " },
    { types: "MedicalFranchise", label: "Medical " },
    { types: "Value&Access", label: "Value & Access " },
  
  ];
  return (
    <>
      <FormControl variant="standard" className=" w-100">
        <InputLabel id="demo-simple-select-standard-label">
          <b className="p-3"> Franchise</b>
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          name="Franchise"
          value={newEvent.Franchise}
          onChange={handleChange}
          label="Franchise"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((item, index) => (
            <MenuItem value={item.types} key={index}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
