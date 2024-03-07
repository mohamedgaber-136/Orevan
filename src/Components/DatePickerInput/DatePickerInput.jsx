import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FireBaseContext } from "../../Context/FireBase";

const DatePickerInput = ({ condition, SetError, formErrors }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [value, setValue] = useState("");
  const { setNewEvent, newEvent } = useContext(FireBaseContext);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const numericDate = new Date(date).getTime();
    const formattedDate = new Date(numericDate).toLocaleString();
    if (condition) {
      setNewEvent({ ...newEvent, StartDate: formattedDate.split(",")[0] });
      setValue(formattedDate.split(",")[0]);
      if (date) {
        SetError({ ...formErrors, CreatedAt: "" });
      } else {
        SetError({ ...formErrors, CreatedAt: "Required" });
      }
    } else {
      setNewEvent({ ...newEvent, EndDate: formattedDate.split(",")[0] });
      setValue(formattedDate.split(",")[0]);

      if (date) {
        SetError({ ...formErrors, EndDate: "" });
      } else {
        SetError({ ...formErrors, EndDate: "Required" });
      }
    }
  };
  useEffect(() => {
    if (condition) {
      setValue(newEvent.StartDate);
    } else {
      setValue(newEvent.EndDate);
    }
  }, [newEvent.EndDate, newEvent.StartDate]);
  return (
    <div className="test">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        value={condition ? newEvent.StartDate : newEvent.EndDate}
        placeholderText={"dd/MM/yyyy"}
        name={condition ? "StartDate" : "EndDate"}
      />
    </div>
  );
};

export default DatePickerInput;
