import React, { useContext, useEffect, useState ,memo } from "react";
import { TextField } from "@mui/material";
import { FireBaseContext } from "../../Context/FireBase";
const SearchText = ({ list }) => {
  const { setRows } = useContext(FireBaseContext);
  const [filter, setFilter] = useState("");
  const [data, setData] = useState([]);
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    filterData(e.target.value);
  };
  const filterData = (filterValue) => {
    const filteredData = list.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
    setData(filteredData);
  };

  return (
    <div >
      <TextField
        label="SEARCH"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  );
};

export default memo (SearchText)
