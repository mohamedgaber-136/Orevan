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
    { types: "Immunology", label: "Immunology" },
    { types: "Neuroscience", label: "Neuroscience" },
    { types: "GTx", label: "GTx " },
    { types: "In Market Brands", label: "In Market Brands" },
    { types: "Oncology", label: "Oncology" },
    { types: "Cardiovascular", label: "Cardiovascular" },
    { types: "Medical", label: "Medical" },
    { types: "Retina", label: "Retina" },
    { types: "Value&Access", label: "Value & Access" },
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
