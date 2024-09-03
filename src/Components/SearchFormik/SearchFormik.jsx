import React, { memo, useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button"; // Import the Button component
import debounce from 'lodash/debounce'; 

const SearchFormik = memo(({ rows, setRows }) => {
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filterType, setFilterType] = useState("eventDate");
  const [TovType, setTov] = useState("All");

  const options = [
    { types: "All", value: null },
    { types: "Registration Fees", value: 0 },
    { types: "Meals", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "Medical Utilities", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Transportation", value: 0 },
    { types: "Visa", value: 0 },
    { types: "Flights", value: 0 },
  ];

  const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());

  // Debounced function to handle filter changes
  const debouncedFilterUpdate = React.useMemo(() => debounce(() => {
    let filtered = rows;
    if (startDateFilter && endDateFilter) {
      if (isValidDate(startDateFilter) && isValidDate(endDateFilter)) {
        const startTimeFilterDate = new Date(startDateFilter).setHours(0, 0, 0, 0);
        const endTimeFilterDate = new Date(endDateFilter).setHours(23, 59, 59, 999); // Include the full end day
  
        filtered = filtered.filter((item) => {
          const itemDateStr = item[filterType];
          if (isValidDate(itemDateStr)) {
            const itemDate = new Date(itemDateStr).setHours(0, 0, 0, 0); // Normalize the item date
            return (!startTimeFilterDate || itemDate >= startTimeFilterDate) &&
                   (!endTimeFilterDate || itemDate <= endTimeFilterDate);
          }
          return false;
        });
      }
    }
  
    if (TovType !== "All") {
      filtered = filtered.filter((item) =>
        item.TransferOfValue.some(transfer => transfer.types === TovType)
      );
    }
    setRows(filtered);
  }, 300), [rows, startDateFilter, endDateFilter, filterType, TovType, setRows]);

  useEffect(() => {
    debouncedFilterUpdate();
    return () => {
      debouncedFilterUpdate.cancel(); 
    };

  }, [startDateFilter, endDateFilter, filterType, TovType, rows, debouncedFilterUpdate]);

  // Function to clear all filters
  const clearFilters = () => {
    setStartDateFilter("");
    setEndDateFilter("");
    setFilterType("eventDate");
    setTov("All");
    setRows(rows); // Reset to original rows
  };

  return (
    <Formik
      initialValues={{
        StartDate: startDateFilter,
        EndDate: endDateFilter,
        FilterType: filterType,
        TovType: TovType,
      }}
      enableReinitialize
    >
      {() => (
        <Form>
          <div className="d-flex gap-3 align-items-end fs-6 text-primary dateTableTitle flex-wrap">
            <span className="d-flex gap-2 align-items-start flex-column">
              <b className="d-flex gap-2 align-items-center"><i className="fa-solid fa-pause"></i>From</b>
              <span className="fs-6 d-flex align-items-end">
                <Field
                  as={TextField}
                  onChange={(e) => setStartDateFilter(new Date(e.target.value).toISOString().split("T")[0])}
                  value={startDateFilter}
                  name="StartDate"
                  type="date"
                  id="outlined-disabled"
                  className="border-2 border rounded-3"
                />
              </span>
            </span>
            <span className="d-flex gap-2 align-items-start flex-column">
              <b className="d-flex gap-2 align-items-center"><i className="fa-solid fa-bars"></i>To</b>
              <span className="fs-6">
                <Field
                  as={TextField}
                  type="date"
                  onChange={(e) => setEndDateFilter(new Date(e.target.value).toISOString().split("T")[0])}
                  value={endDateFilter}
                  name="EndDate"
                  id="outlined-disabled"
                  className="border-2 border rounded-3"
                />
              </span>
            </span>
            <div className="d-flex gap-2 align-items-start justify-content-between flex-column">
              <span><b className="d-flex gap-2 align-items-center">Filter type</b></span>
              <div className="fs-6 d-flex align-items-end rounded">
                <FormControl fullWidth>
                  <Field
                    as={Select}
                    value={filterType}
                    name="FilterType"
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border-2 border rounded-3"
                  >
                    <MenuItem value={"CreatedAt"}>Created at</MenuItem>
                    <MenuItem value={"eventDate"}>Started at</MenuItem>
                    <MenuItem value={"endDate"}>End at</MenuItem>
                  </Field>
                </FormControl>
              </div>
            </div>
            <span className="d-flex gap-2 align-items-start justify-content-between flex-column h-100">
              <b className="d-flex gap-2 align-items-center">TOV type</b>
              <span className="fs-6 d-flex align-items-end rounded">
                <FormControl fullWidth>
                  <Field
                    as={Select}
                    value={TovType}
                    name="TovType"
                    onChange={(e) => setTov(e.target.value)}
                    className="border-2 border rounded-3"
                  >
                    {options.map((item, ind) => (
                      <MenuItem value={item.types} key={`${item.types}-${ind}`}>
                        {item.types}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </span>
            </span>
            <Button
            onClick={clearFilters}
            variant="contained"
            className="btn btn-outline-primary text-dark mt-3"
          >
            Clear
          </Button>
          </div>
       
        </Form>
      )}
    </Formik>
  );
});

export default SearchFormik;
