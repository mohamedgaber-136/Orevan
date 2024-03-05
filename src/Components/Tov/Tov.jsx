import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FireBaseContext } from "../../Context/FireBase";
import { useContext } from "react";
const Tov = ({ setSelectedOptions, selectedOptions }) => {
  // const [checkText, setcheckText] = useState(true);
  // const [currentOption, setCurrentOption] = useState(null);
  // const [textValue, setTextValue] = useState("");
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
  ];
  return (
    <>
      <div style={{ borderBottom: "1px solid black" }} className="mb-1">
        <Autocomplete
          multiple
          id="tags-outlined"
          options={options}
          getOptionLabel={(option) => option.types}
          // value={newEvent['TransferOfValues']}
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
        />
      </div>
      <div>
        <ul className="p-0 d-flex flex-wrap gap-1 ">
          {selectedOptions.map((savedObject, index) => (
            <li
              key={index}
              className="border d-flex flex-column p-2 rounded wrappingItems "
              style={{ width: "40%" }}
            >
              <p className="m-0">Tov : {savedObject.types} </p>
              <TextField
                onChange={(e) => checkTxtValue(e, savedObject.option, index)}
              />
            </li>
          ))}
        </ul>
        {selectedOptions.length ? (
          <button type="button" className="wrappingItems" onClick={sendData}>
            save
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Tov;
