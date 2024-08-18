import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FireBaseContext } from "../../Context/FireBase";
import { useContext, useEffect } from "react";

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
    { types: "Registration Fees", value: 100 },
    { types: "Meals", value: 100 },
    { types: "Accommodation", value: 100 },
    { types: "Medical Utilities", value: 100 },
    { types: "CME Hours", value: 100 },
    { types: "Transportation", value: 100 },
    { types: "Visa", value: 100 },
    { types: "Flights", value: 100 },
  ];

  return (
    <>
      <div style={{ borderBottom: "1px solid black" }} className="">
        <Autocomplete
          multiple
          id="tags-outlined"
          options={options}
          getOptionLabel={(option) => option.types}
          filterSelectedOptions
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
              className="dropDownBorder"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <div key={index} {...getTagProps({ index })}>
                <div className="p-2">
                  {`${option.types} - ${option.value}`}
                </div>
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
                className="w-100"
                onChange={(e) => checkTxtValue(e, index)}
                value={savedObject.value} // Set the value to the state's value
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Restrict to numeric input
              />
            </li>
          ))}
        </ul>
        {selectedOptions.length ? (
          <div className="w-100 d-flex justify-content-end">
            <button
              type="button"
              className="wrappingItems border-0 p-2"
              onClick={sendData}
            >
              Save +
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Tov;
