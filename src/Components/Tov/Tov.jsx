import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FireBaseContext } from "../../Context/FireBase";
import { useContext, useState } from "react";

const Tov = ({ setSelectedOptions, selectedOptions }) => {
  const { newEvent, setNewEvent } = useContext(FireBaseContext);

  const checkTxtValue = (e, index) => {
    const value = e.target.value.replace(/\D/g, ''); // Removes non-numeric characters
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].value = value;
    setSelectedOptions(updatedOptions); // Update the state with the new value
  };

  const sendData = () => {
    setNewEvent({
      ...newEvent,
      ["TransferOfValue"]: selectedOptions,
    });
  };

  const options = [
    { types: "Registration Fees", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Flights", value: 0 },
    { types: "Immunology", value: 0 },
    { types: "Meals", value: 0 },
    { types: "Medical Utilities", value: 0 },
    { types: "Transportation", value: 0 },
    { types: "Visa", value: 0 },
  ];

  return (
    <>
      <div style={{ borderBottom: "1px solid black" }}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={options}
          getOptionLabel={(option) => option.types}
          filterSelectedOptions
          sx={{ border: 0, '& .MuiOutlinedInput-root': { border: 0 } }}
          onChange={(e, value) => {
            setNewEvent({
              ...newEvent,
              ["TransferOfValue"]: value,
            });
            setSelectedOptions([...value]);
          }}
          isOptionEqualToValue={(option, value) => option.types === value.types}
          renderInput={(params) => (
            <TextField
              {...params}
              label={<b>Transfer Of Values</b>}
              sx={{ border: 0 }}
              className='border-0'
               // Apply border styling
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <div
                key={index}
                {...getTagProps({ index })}
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  borderRadius: '16px',
                  padding: '4px 8px',
                  margin: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {`${option.types} - ${option.value}`}
              </div>
            ))
          }
        />
      </div>
      <div>
        <ul className="p-0 row flex-wrap gap-1 mt-2">
          {selectedOptions.map((savedObject, index) => (
            <li key={index} className="p-1 col-5 col-md-3">
              <TextField
                label={<b>Tov: {savedObject.types}</b>}
                focused

                className='border-2 border  rounded-3 w-100'
                sx={{ border: 0 }} // Apply border styling
                onChange={(e) => checkTxtValue(e, index)}
                value={savedObject.value} // Set the value to the state's value
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Restrict to numeric input
              />
            </li>
          ))}
        </ul>
 
      </div>
    </>
  );
};

export default Tov;
