import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const SearchFormik = ({ rows, setRows}) => {
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setfilterType] = useState("eventDate");
  const options = [
    { types: "All", value: null },
    { types: " Registration Fees", value: 0 },
    { types: "Meals ", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "Medical Utlitities", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Transportation", value: 0 },
    { types: "Visa ", value: 0 },
    { types: "Flights", value: 0 },
  ];
  // TovType initial value should be null?
  const [TovType, setTov] = useState(options[0].types);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const intialValues = {
    StartDate: "",
    EndDate: "",
  };
  const handleChange = (event) => {
    setfilterType(event.target.value);
  };
  const handleChangeTov = (event) => {
    setTov(event.target.value);
    console.log(event.target.value);
  };

  const onSubmit = () => {
    if (startDateFilter === "" || endDateFilter === "") {
      if (TovType !== "All") {
        console.log('hi')
        const filteredEvents = rows.filter(item => {
          // Check if the 'TransferOfValue' array contains an object with 'types' equal to 'visa'
          const TovFilterd = item.TransferOfValue.some(transfer => transfer.types === TovType)
        return TovFilterd;
        }
        )
          console.log(filteredEvents)
          setRows(filteredEvents);
        }else{
          console.log(rows)
          setRows(rows);

      }
    } else {
      const StartTimefilterdDate = startDateFilter;
        const EndTimefilterdDate = endDateFilter;
  
        console.log(StartTimefilterdDate, "filter start");
        console.log(EndTimefilterdDate, "filter end");
  
        const filtered = rows.filter((item) => {
          const startDate = new Date(item[filterType])
            .toISOString()
            .split("T")[0];
          console.log(startDate, "startDate");
          console.log(StartTimefilterdDate, "StartTimefilterdDate");
          console.log(EndTimefilterdDate, "EndTimefilterdDate");
          if (
            (!StartTimefilterdDate || startDate >= StartTimefilterdDate) &&
            (!EndTimefilterdDate || startDate <= EndTimefilterdDate)
          ) {
            // Include the item in the filtered array
            return true;
          } else {
            // Exclude the item from the filtered array
            return false;
          }
        });
        console.log(filtered)
  
        let finalFilterd = filtered.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
        );
        setRows(finalFilterd)
        console.log(finalFilterd)
    }
  };
  const BtnCheck = (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  };
  return (
    <Formik initialValues={intialValues}>
      {() => (
        <Form>
          <div className="   d-flex gap-3 align-items-end  fs-6 text-primary dateTableTitle flex-wrap ">
            <span className="d-flex gap-2 align-items-start flex-column ">
              <b className="d-flex gap-2 align-items-center">
                <i className="fa-solid fa-pause"></i>From
              </b>
              <span className="fs-6 d-flex align-items-end">
                <Field
                  as={TextField}
                  onChange={(e) =>
                    setStartDateFilter(
                      new Date(e.target.value).toISOString().split("T")[0]
                    )
                  }
                  value={startDateFilter}
                  name="StartDate"
                  type="date"
                  id="outlined-disabled"
                />
              </span>
            </span>
            <span className="d-flex gap-2 align-items-start flex-column ">
              <b className="d-flex gap-2 align-items-center">
                <i className="fa-solid fa-bars"></i>To
              </b>
              <span className="fs-6">
                <Field
                  as={TextField}
                  type="date"
                  onChange={(e) =>
                    setEndDateFilter(
                      new Date(e.target.value).toISOString().split("T")[0]
                    )
                  }
                  // disabled
                  value={endDateFilter}
                  name="EndDate"
                  id="outlined-disabled"
                />
              </span>
            </span>
            <div className="d-flex gap-2 align-items-start justify-content-between flex-column ">
              <span>
                <b className="d-flex gap-2 align-items-center"> Filter type</b>
              </span>
              <div
                className="fs-6 d-flex align-items-end rounded  "
                style={{ border: "1px solid black" }}
              >
                <FormControl fullWidth>
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
                    <MenuItem value={"eventDate"}>Started at</MenuItem>
                    <MenuItem value={"endDate"}>End at</MenuItem>
                  </Field>
                </FormControl>
              </div>
            </div>
            <span className="d-flex gap-2 align-items-start justify-content-between flex-column h-100 ">
              <b className="d-flex gap-2 align-items-center"> Tov type</b>
              <span
                className="fs-6 d-flex align-items-end rounded "
                style={{ border: "1px solid black" }}
              >
                <FormControl fullWidth>
                  <Field
                    as={Select}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={TovType}
                    label="Filter Type"
                    name="FilterType"
                    onChange={handleChangeTov}
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
          
            <div className="d-flex gap-2 h-100 align-items-center ">
              <button
                type="button"
                onClick={onSubmit}
                className={"btn-DarkBlue text-white p-2 rounded border-0"}
              >
                Search
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default SearchFormik;
 // const filtered = rows.filter((item) => {
      //   const startDate = new Date(item[filterType]).getTime();
      //   const startTimeFilter = startDateFilter ? new Date(startDateFilter).getTime() : 0;
      //   const endTimeFilter = endDateFilter ? new Date(endDateFilter).getTime() : Number.MAX_SAFE_INTEGER;
  
      //   return startDate >= startTimeFilter && startDate <= endTimeFilter;
      // });
  
      // const finalFiltered = filtered.filter((item) => {
      //   if (TovType === "All") return true;
      //   return item.TransferOfValue.some((transfer) => transfer.types === TovType);
      // });
  
      // setRows(finalFiltered);
    
      // Filter data based on the selected date range..
    //   const StartTimefilterdDate = startDateFilter;
    //   const EndTimefilterdDate = endDateFilter;

    //   console.log(StartTimefilterdDate, "filter start");
    //   console.log(EndTimefilterdDate, "filter end");

    //   const filtered = rows.filter((item) => {
    //     const startDate = new Date(item[filterType])
    //       .toISOString()
    //       .split("T")[0];
    //     console.log(startDate, "startDate");
    //     if (
    //       (!StartTimefilterdDate || startDate >= StartTimefilterdDate) &&
    //       (!EndTimefilterdDate || startDate <= EndTimefilterdDate)
    //     ) {
    //       // Include the item in the filtered array
    //       return true;
    //     } else {
    //       // Exclude the item from the filtered array
    //       return false;
    //     }
    //   });

    //   let finalFilterd = filtered.filter((item) =>
    //     Object.values(item).some((value) =>
    //       String(value).toLowerCase().includes(search.toLowerCase())
    //     )
    //   );
    //   console.log(finalFilterd)
    //   if(TovType !== "All"){
    //     let finalFilterdTov = filtered.filter(({ TransferOfValue }) =>
    //     TransferOfValue.some((item) => item.types.includes(TovType))
    //   );
    //   setRows( finalFilterdTov);
      
    // }else{
    //     setRows( finalFilterd);

    //   }

      // Filter data based on selected TOV type
    
      // Set the rows based on the selected TOV t



        // const [startDateFilter, setStartDateFilter] = useState(
  //   new Date().toISOString().split("T")[0]
  // );
  // const [endDateFilter, setEndDateFilter] = useState( new Date().toISOString().split("T")[0]
  // );
    {/* <span className="d-flex gap-2 align-items-start flex-column ">
              <span className="fs-6 d-flex align-items-end">
                <Field
                  as={TextField}
                  onChange={BtnCheck}
                  name="search"
                  placeholder="search...."
                  type="text"
                  id="outlined-disabled"
                />
              </span>
            </span> */}