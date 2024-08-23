import { Field, useFormikContext } from "formik";
import { useState, useEffect } from "react";

export const ConditionDropDown = ({SetCondition}) => {
  const options = ["admin","manager", "user"];
  
  const { values, setFieldValue } = useFormikContext();
  
  useEffect(() => {
    SetCondition(values.Role);
  }, [values.Role]);
  return (
    <>
      <b className="w-100">Choose Role</b>
      <div className="form-control d-flex flex-column align-items-start w-100 justify-content-center">
        <Field
          as="select"
          className="w-100 border-0"
          id={"Role"}
          name={"Role"}
          onChange={(e) => {
            SetCondition(e.target.value);
            setFieldValue("Role", e.target.value);
          }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Field>
      </div>
    </>
  );
};
