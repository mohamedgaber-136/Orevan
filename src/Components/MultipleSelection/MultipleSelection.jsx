import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { FireBaseContext } from "../../Context/FireBase";
import { useContext, useState } from "react";
import AddCityModal from "../NewCity/AddCityModal";

export default function MultipleSelection({
  type,
  list,
  SetError,
  formErrors,
  label,
}) {
  const { newEvent, setNewEvent } = useContext(FireBaseContext);
  const [valus, setValues] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  return (
    <Stack spacing={3} sx={{ width: 500 }} className="errorParent OthersParent">
      <Autocomplete
        multiple
        id="tags-outlined"
        options={list}
        getOptionLabel={(option) => option}
        value={newEvent[type]}
        filterSelectedOptions
        onChange={(e, value) => {
          if (value.length !== 0) {
            SetError({ ...formErrors, [type]: "" });
          } else {
            SetError({ ...formErrors, [type]: "Required" });
          }
          setValues(value);
          setNewEvent({
            ...newEvent,
            [type]: value,
          });
        }}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={<b>{`${label}`}</b>}
            className="dropDownBorder"
           
          />
        )}
    
      />
      <AddCityModal />
    </Stack>
  );
}
