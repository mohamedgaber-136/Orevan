import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useContext } from "react";
import { FireBaseContext } from "../../../Context/FireBase";
import data from '../../../Json/currencies.json'
export const EventCurrencyDropDown = ({ SetError, formErrors }) => {
  const { newEvent, setNewEvent } = useContext(FireBaseContext);
  const handleChange = (event) => {
    setNewEvent({ ...newEvent, EventCurrency: event.target.value });
    if (event.target.value) {
      SetError({ ...formErrors, EventCurrency: "" });
    } else {
      SetError({ ...formErrors, EventCurrency: "Required" });
    }
  };

  return (
    <>
      <FormControl variant="standard" className=" w-100">
        <InputLabel id="demo-simple-select-standard-label">
          <b className="p-3">Currency</b>
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          name="Franchise"
          value={newEvent.EventCurrency}
          onChange={handleChange}
          label="Franchise"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.data.map((item, index) => (
            <MenuItem value={item.name} key={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
