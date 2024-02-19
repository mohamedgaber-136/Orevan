
import { Field } from "formik";
export const RoleDropDown = () => {
  const options = ["Brand Manager", {label:"Franchise Manager",
options:['10','30']
}, "Franchise User"];
  return (
    <div className="form-control d-flex w-75   justify-content-center ">
      <Field as="select" className=' w-100 border-0' id={"Role"} name={"Role"}> 
        {options.map((option) => 
          typeof(option)=='object'?<optgroup label={option.label}>
          {option.options.map((item)=><option value={`${option.label}-${item}`}>Franchise {item}</option>)}
          </optgroup>:
         (  <option  key={option} value={option}>
            {option}
          </option>)
        )}
      </Field>
    </div>
  );
};
