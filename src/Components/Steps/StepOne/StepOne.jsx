import { Formik, Form } from "formik";
import TextField from "@mui/material/TextField";
import "./StepOneStyle.css";
import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../../Context/FireBase";
import MultipleSelection from "../../MultipleSelection/MultipleSelection";
import ToggleBtn from "../../ToggleBtn/ToggleBtn";
import TimePicker from "../../timePicker/TimePicker";
import { FranchisedropDown } from "./FranchisedropDown";
import Tov from "../../Tov/Tov";
import DatePickerInput from "../../DatePickerInput/DatePickerInput";
import { onSnapshot } from "firebase/firestore";
export const StepOne = () => {
  const { newEvent, setNewEvent ,Cities} = useContext(FireBaseContext);
  const [amexNumber, setAmexNumber] = useState(false);
  const [CPD, SetCPD] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [items, setItem] = useState([]);
  const [formErrors, setFormErrors] = useState({
    EventName: newEvent.EventName ? "" : "",
    CreatedAt: newEvent.StartDate ? "" : "",
    City: newEvent.City.length !== 0 ? "" : "",
    EndDate: newEvent.EndDate ? "" : "",
    TransferOfValue: newEvent.TransferOfValue.length !== 0 ? "" : "",
    P3: newEvent.BeSure ? "" : "",
    PO: newEvent.PO ? "" : "",
    Franchise: newEvent.Franchise ? "" : "",
    DateEndHours: newEvent.DateEndHours ? "" : "",
    DateFromHours: newEvent.DateFromHours ? "" : "",
  });
  const getDatas = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    if (e.target.value) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    } else {
      setFormErrors({ ...formErrors, [e.target.name]: "Required" });
    }
  };
  const TovSum = () => {
    const data = newEvent.TransferOfValue;
    if (newEvent.TransferOfValue.length) {
      let sum = data.map((item) => item.value);
      let result = sum.reduce((x, y) => parseFloat(x) + parseFloat(y));
      SetCPD(result);
      return result;
    } else {
      return 0;
    }
  };
  
  useEffect(() => {
    setNewEvent({ ...newEvent, CostperDelegate: CPD });
  }, [CPD]);
  useEffect(() => {
    TovSum();
  }, [selectedOptions]);

  const getData = (CollectionType, SetItem) => {
    const returnedValue = onSnapshot(CollectionType, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      SetItem(newData[0].data);
    })}


  useEffect(()=>{
    getData(Cities,setItem)
  },[])
  return (
    <div>
      <Formik>
        {() => (
          <Form
            className="row container justify-content-between  "
            style={{ gap: "40px 0" }}
          >
            <div
              className="align-self-end border-0 bg-transparent text-dark "
              onClick={() => setAmexNumber(!amexNumber)}
            >
              <ToggleBtn />
            </div>
            <div className="errorParent col-md-6 col-12">
              <TextField
                name={"EventName"}
                label={<b>Event Name</b>}
                focused
                defaultValue={newEvent.EventName}
                className={`w-100 `}
                onChange={getDatas}
              />
              <small className="text-danger errorMsg">
                {formErrors.EventName}
              </small>
            </div>
            <div className="errorParent col-md-6 col-12">
              <TextField
                name={"PO"}
                label={amexNumber ? <b>Amex Num </b> : <b>PO</b>}
                focused
                className="w-100"
                defaultValue={newEvent.PO}
                onChange={getDatas}
              />
              <small className="text-danger errorMsg">{formErrors.PO}</small>
            </div>
            <div className="errorParent col-md-6 col-12 ">
              <TextField
                name={"BeSure"}
                label={<b>BeSure</b>}
                focused
                defaultValue={newEvent.BeSure}
                className="w-100"
                onChange={getDatas}
              />
              <small className="text-danger errorMsg">{formErrors.BeSure}</small>
            </div>
            <div className="errorParent col-md-6 col-12  ">
              
              <MultipleSelection
                type="City"
                label="City"
                list={items}
                SetError={setFormErrors}
                formErrors={formErrors}
              />
              <small className="text-danger errorMsg">{formErrors.City}</small>
            </div>
            <div className="errorParent col-12">
              <FranchisedropDown
                SetError={setFormErrors}
                formErrors={formErrors}
              />
              <small className="text-danger errorMsg">
                {formErrors.Franchise}
              </small>
            </div>
            <div className="errorParent  col-12  ">
              <Tov
                SetError={setFormErrors}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                formErrors={formErrors}
              />
              <small className="text-danger errorMsg">
                {formErrors.TransferOfValue}
              </small>
            </div>
            <div className="errorParent col-12  ">
              <small className="SingleDelegate text-primary" style={{zIndex:'1'}}>
                Not Total Cost
              </small>

              <TextField
                name={"CostperDelegate"}
                label={<b>Cost Per Delegate</b>}
                focused
                className="w-100 CostPerDelegate"
                type="number"
                readOnly
                value={TovSum()}
              />
            </div>
            <div className=" col-12 row p-0 m-0 gap-2 container justify-content-center justify-content-md-around ">
              <div className=" col-12  gap-1 col-md-6 row align-items-center">
                <h6>
                  <b className="text-secondary">From</b>
                </h6>
                <div className=" col-12 col-md-5  dropDownBorder p-2 greyBgc">
                  <DatePickerInput
                    condition={true}
                    SetError={setFormErrors}
                    formErrors={formErrors}
                  />
                  <small className="text-danger errorMsg">
                    {formErrors.CreatedAt}
                  </small>
                </div>
                <div className=" col-12 col-md-5 p-0 ">
                  <TimePicker
                    condition={true}
                    SetError={setFormErrors}
                    formErrors={formErrors}
                  />
                </div>

                <small className="text-danger errorMsg">
                  {formErrors.DateFromHours}
                </small>
              </div>
              <div className=" col-12  gap-1 col-md-6 row align-items-center">
                  <h6>
                    <b className="text-secondary">To</b>
                  </h6>
                  <div className=" dropDownBorder p-2 errorParent greyBgc col-12 col-md-5">
                    <DatePickerInput
                      condition={false}
                      SetError={setFormErrors}
                      formErrors={formErrors}
                    />
                    <small className="text-danger errorMsg">
                      {formErrors.EndDate}
                    </small>
                  </div>
                  <div className=" col-12 p-0 col-md-5">
                    <TimePicker
                      condition={false}
                      SetError={setFormErrors}
                      formErrors={formErrors}
                    />
                    <small className="text-danger errorMsg">
                      {formErrors.DateEndHours}
                    </small>
                  </div>
                </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
