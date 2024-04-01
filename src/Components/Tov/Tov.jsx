import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FireBaseContext } from "../../Context/FireBase";
import { useContext, useEffect } from "react";
const Tov = ({ setSelectedOptions, selectedOptions }) => {
  const { newEvent, setNewEvent } = useContext(FireBaseContext);

  const checkTxtValue = (e, item, i) => {
    selectedOptions[i].value = e.target.value;
  };
  const sendData = () => {
    setNewEvent({
      ...newEvent,
      ["TransferOfValue"]: selectedOptions,
    });
  };
  const options = [
    { types: " Registration Fees", value: 0 },
    { types: "Meals ", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "Medical Utlitities", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Transportation", value: 0 },
    { types: "Visa ", value: 0 },
    { types: "Flights", value: 0 },
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
              className="dropDownBorder "
            />
          )}
          renderTags={(value, getTagProps) =>
            newEvent.TransferOfValue.map((option, index) => (
              <div  key={index} {...getTagProps({ index })} >
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
            <li
              key={index}
              className=" p-1 col-5 col-md-3"
          
            >
                  <TextField
                label={<b>Tov : {savedObject.types}</b>}
                focused
                className="w-100"
                onChange={(e) => checkTxtValue(e, savedObject.option, index)}
              />
            </li>
          ))}
        </ul>
        {selectedOptions.length ? (
          <div className="w-100  d-flex justify-content-end ">

          <button type="button" className="wrappingItems border-0 p-2" onClick={sendData}>
            save +
          </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Tov;
