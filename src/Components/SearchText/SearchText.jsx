import React, {  useEffect, useState ,memo } from "react";
import { TextField } from "@mui/material";
const SearchText = ({ list ,setRows,row}) => {
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
  useEffect(() => {
    if (filter.length === 0) {
      setRows([...row]);
    } else {
      setRows([...data]);
    }
  }, [filter]);
  return (
    <div >
      <TextField
        placeholder="search...."
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  );
};

export default memo (SearchText)
