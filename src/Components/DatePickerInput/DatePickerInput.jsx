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
      setNewEvent({ ...newEvent, eventDate: formattedDate.split(",")[0] });
      setValue(formattedDate.split(",")[0]);
      if (date) {
        SetError({ ...formErrors, eventDate: "" });
      } else {
        SetError({ ...formErrors, eventDate: "Required" });
      }
    } else {
      setNewEvent({ ...newEvent, endDate: formattedDate.split(",")[0] });
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
      setValue(newEvent.eventDate);
    } else {
      setValue(newEvent.endDate);
    }
  }, [newEvent.endDate, newEvent.eventDate]);
  return (
    <div className="test">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="mm/dd/yyyy"
        value={condition ? newEvent.eventDate : newEvent.endDate}
        placeholderText={"mm/dd/yyyy"}
        name={condition ? "eventDate" : "endDate"}
      />
    </div>
  );
};

export default DatePickerInput;
