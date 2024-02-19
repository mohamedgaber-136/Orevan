import { Formik, Form } from "formik";
import { FormData } from "../../../Pages/Profile/FormData/FormData";
import DateByYMD from "../../DateByYMD/DateByYMD";
import { DateByTime } from "../../DateByTime/DateByTime";
import TextField from "@mui/material/TextField";
import "./StepOneStyle.css";
import { useContext, useState } from "react";
import { FireBaseContext } from "../../../Context/FireBase";
import MultipleSelection from "../../MultipleSelection/MultipleSelection";
import ToggleBtn from "../../ToggleBtn/ToggleBtn";
import TimePicker from "../../timePicker/TimePicker";
import { FranchisedropDown } from "./FranchisedropDown";
export const StepOne = () => {
  const { newEvent, setNewEvent } = useContext(FireBaseContext);
  const [amexNumber, setAmexNumber] = useState(false);
  const [formErrors, setFormErrors] = useState({
    EventName:newEvent.EventName?'':'Required',
    CreatedAt: newEvent.StartDate?'':'Required',
    City: newEvent.City.length!=0?'':'Required',
    EndDate: newEvent.EndDate?'':'Required',
    TransferOfValue: newEvent.TransferOfValue.length!=0?'':'Required',
    P3: newEvent.P3?'':'Required',
    PO: newEvent.PO?'':'Required',
    Franchise: newEvent.Franchise?'':'Required',
    CostperDelegate: newEvent.CostperDelegate?'':'Required',
    DateEndHours:newEvent.DateEndHours?'':'Required',
    DateFromHours:newEvent.DateFromHours?'':'Required'
  });
  const Franchises = [
    { types: "Pharma" },
    { types: "chem" },
    { types: "phys" },
  ];
  const City = [{ types: "egypt" }, { types: "saudi" }, { types: "frace" }];
  const getData = (e) => {
    console.log(e.target.name,'e')
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    if (e.target.value) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    } else {
      setFormErrors({ ...formErrors, [e.target.name]: "Required" });
    }
  };

  return (
    <div>
      <Formik>
        {() => (
            <Form className="d-flex flex-column ">
            <div
              className="align-self-end border-0 bg-transparent text-dark"
              onClick={() => setAmexNumber(!amexNumber)}
            >
              <ToggleBtn />
            </div>
            <div className="d-flex flex-column gap-5">
              <div className="pt-2">
                <div className="container  ">
                  <div className="d-flex  gap-2 gap-md-5 px-md-4 px-2  justify-content-center align-item-center">
                    <div className="d-flex gap-5 flex-column w-50 ">
                      <div className="errorParent ">
                        <TextField
                          name={"EventName"}
                          label={"Event Name"}
                          focused
                          defaultValue={newEvent.EventName}
                          className={`w-100 `}
                          onChange={getData}                
                                  />
                        <small className="text-danger errorMsg">
                          {formErrors.EventName}
                        </small>
                      </div>
                      <div className="errorParent">
                      <small className="SingleDelegate text-primary">Not Total Cost</small>

                        <TextField
                          name={"CostperDelegate"}
                          label={"Cost Per Delegate"}
                          focused
                          defaultValue={newEvent.CostperDelegate}
                          className="w-100"
                          type="number"
                          onChange={getData}  
                        />
                        <small className="text-danger errorMsg">
                          {" "}
                          {formErrors.CostperDelegate}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-5 flex-column w-50 ">
                      <div className="errorParent">
                        <TextField
                          name={'PO'}
                          label={amexNumber ? "Amex Num" : "PO"}
                          focused
                          className="w-100"
                          defaultValue={newEvent.PO}
                          onChange={getData}  
                        />
                        <small className="text-danger errorMsg">
                          {formErrors.PO}
                        </small>
                      </div>
                      <div className="errorParent">
                        <TextField
                          name={"P3"}
                          label={"P3"}
                          focused
                          defaultValue={newEvent.P3}
                          className="w-100"
                          onChange={getData}  
                        />
                        <small className="text-danger errorMsg">
                          {formErrors.P3}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container d-flex flex-column gap-5">
                <div className="d-flex two flex-column flex-md-row  gap-5  gap-md-5 px-md-4 px-2 gap2  justify-content-center align-item-center">
                  <div className="w-50   errorParent d-flex justify-content-center align-items-end " >
                    <FranchisedropDown  SetError={setFormErrors}
                      formErrors={formErrors}/>
                    <small className="text-danger errorMsg">
                      {" "}
                      {formErrors.Franchise}
                    </small>
                  </div>

                   <div className="w-50 errorParent  ">
                    <MultipleSelection
                      type="City"
                      label="City"
                      list={City}
                      SetError={setFormErrors}
                      formErrors={formErrors}
                    />
                    <small className="text-danger errorMsg">
                      {" "}
                      {formErrors.City}
                    </small>
                  </div> 
                </div>
                 <div className="w-100 errorParent px-md-4 px-2  ">
                  <MultipleSelection
                    type="TransferOfValue"
                    label="Transfer of Value"
                    className="w-100"
                    list={Franchises}
                    SetError={setFormErrors}
                    formErrors={formErrors}
                  />
                  <small className="text-danger errorMsg">
                    {" "}
                    {formErrors.TransferOfValue}
                  </small>
                </div> 
              </div>
              <div className="container d-flex flex-wrap flex-md-nowrap gap-md-5 px-md-4 px-2 gap-4  justify-content-between align-item-center">
                <div className="d-flex flex-column gap-3 ">
                  <h6>
                    <b className="text-secondary">From</b>
                  </h6>
                  <div className="d-flex justify-content-between  flex-md-row align-items-center gap-3">
                    <div className="w-50 errorParent  dropDownBorder p-2 greyBgc">
                      <DateByYMD
                        condition={true}
                        SetError={setFormErrors}
                        formErrors={formErrors}
                      />
                       <small className="text-danger errorMsg">
                      {" "}
                      {formErrors.CreatedAt}
                    </small>
                    </div>
                    <div className="w-50 errorParent h-100">
                      <TimePicker
                        condition={true}
                        SetError={setFormErrors}
                        formErrors={formErrors}
                      />
                      <small className="text-danger errorMsg">
                        {formErrors.DateFromHours}
                      </small>
                    </div>               
                  </div>
                </div>
                <div className="d-flex flex-column gap-3  ">
                  <h6>
                    <b className="text-secondary">To</b>
                  </h6>
                  <div className="d-flex  justify-content-between  flex-md-row  align-items-center gap-3 ">
                    <div className="w-50 dropDownBorder p-2 errorParent greyBgc ">
                      <DateByYMD
                        condition={false}
                        SetError={setFormErrors}
                        formErrors={formErrors}
                      />
                       <small className="text-danger errorMsg">
                      {" "}
                      {formErrors.EndDate}
                    </small>
                    </div>
                    <div className="w-50 errorParent h-100">
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
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
