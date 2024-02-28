import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
export const SearchFormik = ({ rows, setRows }) => {
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setfilterType] = useState("StartDate");
  const options = [
    { types: " Registration Fees", value: 0 },
    { types: "Meals ", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "Medical Utlitities", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Transportation", value: 0 },
  ];
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
  };
  const onSubmit = (values) => {
    // Filter data based on the selected date range..
    const StartTimefilterdDate = new Date(startDateFilter);
    const EndTimefilterdDate = new Date(endDateFilter);

    const filtered = rows.filter((item) => {
      const startDate = new Date(item[filterType]);
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

    console.log(filtered, "filtered");
    let finalFilterd = filtered.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );

    console.log(finalFilterd, "finalFilterd");

    let finalFilterdTov = filtered.filter(
      ({ TransferOfValue }) =>
        TransferOfValue.filter((item) => item.types.includes(TovType)).length
    );
    console.log(finalFilterdTov, "finalFilterdTov");
    setRows(finalFilterdTov);
    // setRows()

    // let finalFilterdTov = rows.map(
    //   (item) => {
    //     console.log(
    //       item.TransferOfValue.filter((item) => item.types.includes(TovType)),
    //       "result value"
    //     );
    //   }
    //   // item.TransferOfValue.filter(
    //   //   (item) => item.types.includes(TovType) == true
    //   // )
    // );
    // {
    //   // console.log(
    //   //   item.TransferOfValue.filter((item) => item.types.includes(TovType)),
    //   //   "result value"
    //   // );
    //   // if (item.TransferOfValue.map((item) => item.types.includes(TovType))) {
    //   //   console.log(item);
    //   //   // return item
    //   // } else {
    //   //   console.log("no");
    //   // }
    // });
    // console.log(filtered[0].TransferOfValue.map((item)=>item.types.includes('CME Hours')))
    // .map((item)=>{
    //  let data=  item.find((item)=>item.types===TovType)
    //  console.log(data)
  };
  const BtnCheck = (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  };
  console.log(TovType);
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
                {" "}
                <Field
                  as={TextField}
                  // disabled
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  value={startDateFilter}
                  name="StartDate"
                  type="date"
                  id="outlined-disabled"
                />
              </span>
            </span>
            <span className="d-flex gap-2 align-items-start flex-column ">
              <b className="d-flex gap-2 align-items-center">
                {" "}
                <i className="fa-solid fa-bars"></i>To
              </b>
              <span className="fs-6">
                {" "}
                <Field
                  as={TextField}
                  type="date"
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  // disabled
                  value={endDateFilter}
                  name="EndDate"
                  id="outlined-disabled"
                />
              </span>
            </span>
            <span className="d-flex gap-2 align-items-start justify-content-between flex-column h-100 ">
              <b className="d-flex gap-2 align-items-center"> Filter type</b>
              <span
                className="fs-6 d-flex align-items-end rounded "
                style={{ border: "1px solid black" }}
              >
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
                    <MenuItem value={"StartDate"}>Started at</MenuItem>
                    <MenuItem value={"EndDate"}>End at</MenuItem>
                  </Field>
                </FormControl>{" "}
              </span>
            </span>
            <span className="d-flex gap-2 align-items-start justify-content-between flex-column h-100 ">
              <b className="d-flex gap-2 align-items-center"> Tov type</b>
              <span
                className="fs-6 d-flex align-items-end rounded "
                style={{ border: "1px solid black" }}
              >
                <FormControl fullWidth>
                  {/* <InputLabel id="demo-simple-select-label" className='bg-white'>FilterType</InputLabel> */}
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
                    {/* <MenuItem value={"CreatedAt"}>Created at</MenuItem>
                    <MenuItem value={"StartDate"}>Started at</MenuItem>
                    <MenuItem value={"EndDate"}>End at</MenuItem> */}
                  </Field>
                </FormControl>{" "}
              </span>
            </span>
            <span className="d-flex gap-2 align-items-start flex-column ">
              <span className="fs-6 d-flex align-items-end">
                {" "}
                <Field
                  as={TextField}
                  // disabled
                  onChange={BtnCheck}
                  name="search"
                  placeholder="search...."
                  type="text"
                  id="outlined-disabled"
                />
              </span>
            </span>
            <div className="d-flex gap-2 h-100 align-items-start flex-column">
              <button
                type="button"
                onClick={onSubmit}
                className={"btn-DarkBlue text-white p-2 rounded"}
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
