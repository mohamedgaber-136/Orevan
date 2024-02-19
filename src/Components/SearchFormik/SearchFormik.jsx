import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import SearchRange from "../SearchRange/SearchRange";

export const SearchFormik = ({rows,setRows}) => {
   const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [disabledBtn,setDisabledBtn] = useState(true)
  const intialValues = {
    StartDate: "",
    EndDate: "",
  };
  // console.log(intialValues);
  // const searchDataFunc = (e)=>{
  //   setSearchData(e.target.value)
  // }
  // console.log(SearchData)
  // const onSubmit = (values) => {
  
  //   // setSearchInfo({...values,[SearchType]:SearchData})
  // };
  const onSubmit = (values) => {
    // Filter data based on the selected date range
    const StartTimefilterdDate = new Date(startDateFilter)
    // console.log(StartTimefilterdDate,'StartTimefilterdDate')
    const EndTimefilterdDate = new Date(endDateFilter)
    // console.log(EndTimefilterdDate,'EndTimefilterdDate')

    // console.log(EndTimefilterdDate-StartTimefilterdDate,'difference')
    const filtered = rows.filter((item) => {
      const startDate = new Date(item.StartDate)
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
    }
    );
    console.log(filtered)
   let finalFilterd= filtered.filter((item) =>
   Object.values(item).some((value) =>
    String(value).toLowerCase().includes(search.toLowerCase())
   ))
    setRows(finalFilterd)
  };
  const BtnCheck = (e)=>{
    setSearch(e.target.value)
    if(e.target.value){
      setDisabledBtn(false)
    }else{
      setDisabledBtn(true)
    }
  }
  return (
    <Formik initialValues={intialValues} >
      {() => (
        <Form>
          <div className="   d-flex gap-3 align-items-end gap-md-5 fs-6 text-primary dateTableTitle">
            <span className="d-flex gap-2 align-items-start flex-column">
              <b className="d-flex gap-2 align-items-center">
                <i className="fa-solid fa-pause"></i>From
              </b>
              <span className="fs-6 d-flex align-items-end">
                {" "}
                <Field
                  as={TextField}
                  // disabled
                  onChange={(e)=> setStartDateFilter(e.target.value) }
                  value={startDateFilter}
                  name="StartDate"
                  type="date"
                  id="outlined-disabled"
                />
              </span>
            </span>
            <span className="d-flex gap-2 align-items-start flex-column">
              <b className="d-flex gap-2 align-items-center">
                {" "}
                <i className="fa-solid fa-bars"></i>To
              </b>
              <span className="fs-6">
                {" "}
                <Field
                  as={TextField}
                  type="date"
                  onChange={(e)=>setEndDateFilter(e.target.value)  }
                  // disabled
                  value={endDateFilter}
                  name="EndDate"
                  id="outlined-disabled"
                />
              </span>
            </span>
            <span className="d-flex gap-2 align-items-start flex-column">           
            <span className="fs-6 d-flex align-items-end">
                {" "}
                <Field
                  as={TextField}
                  // disabled
                  onChange={BtnCheck}
                  name="search"
                  placeholder='search....'
                  type="text"
                  id="outlined-disabled"
                />
              </span>
            </span>
            <div className="d-flex gap-2 h-100 align-items-start flex-column">

<button type='button' onClick={onSubmit} className={`${disabledBtn?'d-none':'btn-DarkBlue text-white p-2 rounded'}`}>Search</button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
