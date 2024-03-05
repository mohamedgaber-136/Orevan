import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Field } from "formik";

export default function FilterDropDown({ setfilterType, filterType }) {
  const handleChange = (event) => {
    setfilterType(event.target.value);
  };
  return (
    <Box sx={{ minWidth: 120, border: "1px solid grey", borderRadius: 2 }}>
      <FormControl fullWidth>
        {/* <InputLabel id="demo-simple-select-label" className='bg-white'>FilterType</InputLabel> */}
        <Field
          as={Select}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterType}
          label="Filter Type"
          name="FilterType"
          onChange={handleChange}
        >
          <MenuItem value={"CreatedAt"}>Created at</MenuItem>
          <MenuItem value={"StartedAt"}>Started at</MenuItem>
          <MenuItem value={"EndAt"}>End at</MenuItem>
        </Field>
      </FormControl>
    </Box>
  );
}
